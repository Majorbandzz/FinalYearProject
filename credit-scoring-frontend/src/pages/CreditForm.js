import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "../api";
import { useUser } from "../context/UserContext";

const CreditForm = () => {
  const navigate = useNavigate();
  const { user, refreshUser, logout } = useUser();

  const [formData, setFormData] = useState({
    total_payments: "",
    missed_payments: "",
    total_credit_limit: "",
    credit_used: "",
    credit_history_length: "",
    credit_accounts: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("User not logged in");
      navigate("/login");
      return;
    }

    try {
      const dataToSubmit = {
        total_payments: Number(formData.total_payments) || 0,
        missed_payments: Number(formData.missed_payments) || 0,
        total_credit_limit: Number(formData.total_credit_limit) || 0,
        credit_used: Number(formData.credit_used) || 0,
        credit_history_length: Number(formData.credit_history_length) || 0,
        credit_accounts: Number(formData.credit_accounts) || 0,
      };

      await axios.post("/cscore/submit", dataToSubmit);
      await refreshUser();
      toast.success("Credit score submitted!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit credit data");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white/90 shadow-md backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1
            className="text-2xl font-bold text-blue-600 cursor-pointer"
            onClick={() => navigate('/dashboard')}
          >
            SynergyScore
          </h1>

          <div className="flex-1 flex justify-center space-x-10 text-gray-700 font-medium">
            <button onClick={() => navigate('/dashboard')} className="hover:text-blue-600 transition">Home</button>
            <button onClick={() => navigate('/loans')} className="hover:text-blue-600 transition">Loans</button>
            <button onClick={() => navigate('/feedback-report')} className="hover:text-blue-600 transition">Improve</button>
            <button onClick={() => navigate('/credit-cards')} className="hover:text-blue-600 transition">Credit Cards</button>
          </div>

          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="flex items-center justify-center p-6">
        <form onSubmit={handleSubmit} className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Credit Data Form</h2>
          {[
            { name: "total_payments", label: "Total Payments" },
            { name: "missed_payments", label: "Missed Payments" },
            { name: "total_credit_limit", label: "Total Credit Limit" },
            { name: "credit_used", label: "Credit Used" },
            { name: "credit_history_length", label: "Credit History Length (months)" },
            { name: "credit_accounts", label: "Number of Credit Accounts" },
          ].map(({ name, label }) => (
            <div key={name} className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">{label}</label>
              <input
                type="number"
                name={name}
                value={formData[name]}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreditForm;

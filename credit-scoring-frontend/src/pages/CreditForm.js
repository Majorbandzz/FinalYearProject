import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "../api";
import { useUser } from "../context/UserContext";

const CreditForm = () => {
  const navigate = useNavigate();
  const { user, refreshUser } = useUser();

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

  const handleLogout = async () => {
    try {
      await axios.post("/auth/logout");
      await refreshUser();
      navigate("/login");
      toast.success("Logged out successfully!");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user.user_id) {
      toast.error("User not logged in");
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
        user_id: user.user_id,
      };

      await axios.post("/cscore/submit", dataToSubmit);

      await refreshUser();
      toast.success("Credit score submitted!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit credit data");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 relative">
      <div
        className="absolute top-4 left-4 text-blue-600 font-bold cursor-pointer hover:underline"
        onClick={() => navigate("/dashboard")}
      >
        SynergyScore
      </div>


      <div className="absolute top-4 right-4">
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white shadow-lg rounded-lg p-6"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Credit Data Form
        </h2>

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
  );
};

export default CreditForm;

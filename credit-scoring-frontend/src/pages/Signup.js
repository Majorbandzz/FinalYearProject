import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    date_of_birth: "",
    address: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://127.0.0.1:5000/auth/register", formData);
      alert("Registration successful! You can now log in.");
      navigate("/login");
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">Sign Up</h2>
        {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
        <form onSubmit={handleSubmit} className="mt-4">
          <input name="name" type="text" placeholder="Full Name" onChange={handleChange} className="input-field" required />
          <input name="email" type="email" placeholder="Email" onChange={handleChange} className="input-field" required />
          <input name="phone_number" type="text" placeholder="Phone Number" onChange={handleChange} className="input-field" required />
          <input name="date_of_birth" type="date" onChange={handleChange} className="input-field" required />
          <input name="address" type="text" placeholder="Address" onChange={handleChange} className="input-field" required />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} className="input-field" required />
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 mt-4">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;

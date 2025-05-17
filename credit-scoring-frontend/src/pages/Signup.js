import { useState } from "react"; 
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
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
      alert("Registration successful! Please log in to continue.");
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

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <input
            name="name"
            type="text"
            placeholder="Full Name"
            onChange={handleChange}
            value={formData.name}
            className="w-full p-2 border rounded"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            value={formData.email}
            className="w-full p-2 border rounded"
            required
          />
          <input
            name="date_of_birth"
            type="date"
            onChange={handleChange}
            value={formData.date_of_birth}
            className="w-full p-2 border rounded"
            required
          />
          <input
            name="address"
            type="text"
            placeholder="Address"
            onChange={handleChange}
            value={formData.address}
            className="w-full p-2 border rounded"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            value={formData.password}
            className="w-full p-2 border rounded"
            required
          />
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
            Register
          </button>
        </form>

        
        <p className="text-center text-sm text-gray-600 mt-4">
          Already signed up?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;

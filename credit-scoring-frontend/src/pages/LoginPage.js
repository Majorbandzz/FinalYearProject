import React, { useState } from 'react'; 
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';


function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
  
    try {
      const response = await axios.post('http://127.0.0.1:5000/auth/login', {
        email,
        password,
      });
  
      console.log('Login successful:', response.data);
  
      localStorage.setItem('token', response.data.token || response.data.access_token);
  
      toast.success('Logged in successfully! ✅'); // success popup
      navigate('/dashboard');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage); // show error popup
    } finally {
      setLoading(false); 
    }
  };
  

  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-gray-100">
      {/* Navigation Bar */}
      <nav className="w-full flex justify-between items-center p-6 bg-white shadow">
        <div className="text-2xl font-bold text-blue-600">SynergyScore</div>
        <div>
          <Link to="/signup" className="px-4 py-2 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition">
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Login Form */}
      <main className="flex flex-col items-center justify-center flex-grow text-center px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Welcome Back!</h2>

        <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm">
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="mb-4 text-left">
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div className="mb-6 text-left">
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          
          {/* Spinner or Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition flex justify-center items-center"
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12" cy="12" r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            ) : (
              "Log In"
            )}
          </button>
        </form>
      </main>

      {/* Footer */}
      <footer className="w-full p-4 bg-white shadow text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} SynergyScore — Secure Your Financial Future
      </footer>
    </div>
  );
}

export default LoginPage;

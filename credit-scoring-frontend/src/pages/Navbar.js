import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { logout } = useUser();

  return (
    <nav className="bg-white/90 shadow-md backdrop-blur-sm z-50">
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
  );
};

export default Navbar;

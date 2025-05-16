import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useUser } from '../context/UserContext';
import axios from '../api';

const Dashboard = () => {
  const { user, setUser, refreshUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      const fetchUserData = async () => {
        try {
          await refreshUser();
        } catch (err) {
          toast.error('Failed to load user data');
          navigate('/login');
        }
      };

      fetchUserData();
    }
  }, [user, setUser, navigate, refreshUser]);

  const handleFillForm = () => {
    navigate('/credit-form');
  };

  const handleLogout = async () => {
    try {
      await axios.post('/auth/logout');
      setUser(null);
      navigate('/login');
    } catch (err) {
      toast.error('Logout failed');
  }
};

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 relative px-4 py-4">
    
      <div
        className="absolute top-4 left-4 text-blue-600 font-bold cursor-pointer hover:underline"
        onClick={() => navigate('/dashboard')}
      >
        SynergyScore
      </div>

      <div className="flex items-center justify-center h-full">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome, {user.name || 'User'}</h2>
          <p className="text-lg text-gray-700 mb-6">
            Your credit score is:{' '}
            <span className="font-semibold text-blue-600">{user.credit_score ?? 0}</span>
          </p>

          
          {(!user.credit_score || user.credit_score === 0) && (
            <button
              onClick={handleFillForm}
              className="w-full mb-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition"
            >
              Fill Credit Score Form
            </button>
          )}

         
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

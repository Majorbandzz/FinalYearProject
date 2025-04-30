import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [creditScore, setCreditScore] = useState(null);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return;
        }

        console.log("Attempting to fetch with token:", token);
        const response = await axios.get('http://127.0.0.1:5000/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log("Response data:", response.data);
        setCreditScore(response.data.credit_score);
        setName(response.data.name);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="p-6 bg-blue-600 text-white flex justify-between items-center shadow">
        <h1 className="text-2xl font-bold">Welcome {name || 'User'}</h1>
        <button 
          onClick={handleLogout}
          className="px-4 py-2 bg-white text-blue-600 rounded-2xl hover:bg-gray-100 transition"
        >
          Log Out
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center text-center p-8">
        {loading ? (
          <p className="text-gray-600 text-lg">Loading...</p>
        ) : (
          <>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Your Credit Score: <span className="text-green-500">{creditScore || 'N/A'}</span>
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              {creditScore > 0
                ? "Great work! Keep maintaining good financial habits."
                : "You haven't filled out your credit profile yet. Let's get started!"}
            </p>
            <button 
              onClick={() => navigate('/credit-form')}
              className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
            >
              {creditScore > 0 ? "View Detailed Report" : "Fill Credit Score Form"}
            </button>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full p-4 bg-white shadow text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} SynergyScore — Stay Credit Smart
      </footer>
    </div>
  );
}

export default Dashboard;
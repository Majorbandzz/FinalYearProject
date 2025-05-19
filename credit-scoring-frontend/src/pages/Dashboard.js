import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { FaUserCircle } from 'react-icons/fa';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isLoading, logout } = useUser();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getColor = (score) => {
    if (score >= 700) return 'border-green-500 text-green-600 glow-green';
    if (score >= 600) return 'border-yellow-500 text-yellow-600 glow-yellow';
    return 'border-red-500 text-red-600 glow-red';
  };

  const score = user?.credit_score ?? 0;
  const ringColor = getColor(score);

  if (isLoading) {
    return (
      <div className="p-10 text-center text-gray-600">
        Loading your dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[url('https://cdn.pixabay.com/photo/2024/04/28/22/55/ai-generated-8726433_1280.png')] bg-cover bg-center bg-no-repeat">
      <div className="min-h-screen bg-white/70">
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

       
        <div className="max-w-5xl mx-auto px-6 py-10 text-center">
          <div className="flex items-center justify-center mb-6 space-x-3">
            <FaUserCircle className="text-3xl text-gray-600" />
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
              {getGreeting()}, {user?.name || 'User'}
            </h2>
          </div>

         
          <div className="flex justify-center my-10">
            <div
              className={`w-40 h-40 rounded-full border-8 ${ringColor} flex items-center justify-center shadow-lg animate-glow`}
            >
              <span className="text-3xl font-bold">{score}</span>
            </div>
          </div>

         
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
            <button
              onClick={() => navigate('/credit-form')}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Update Credit Information
            </button>
            <button
              onClick={() => navigate('/eligible-cards')}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            >
              See Eligible Credit Cards
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

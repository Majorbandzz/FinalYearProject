import React, { useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useUser } from '../context/UserContext';

const Dashboard = () => {
  const { user, setUser, refreshUser, isLoading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        await refreshUser();
      } catch (err) {
        toast.error('Failed to load user data');
        navigate('/login');
      }
    };


    if (!isLoading && !user) {
      fetchUserData();
    }
  }, [user, isLoading, navigate, refreshUser]);

  const handleLogout = () => {
    document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    setUser(null);
    navigate('/login');
  };

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

          {isLoading ? (
            <div className="min-h-screen flex items-center justify-center">
              Loading...
            </div>
          ) : !user ? (
            <div className="min-h-screen flex items-center justify-center">
              <p>User not found. Please log in.</p>
            </div>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Welcome, {user.name}
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Your credit score is: 
                <span className="font-semibold text-blue-600">{user.credit_score}</span>
              </p>

              <div className="space-y-4">
                <button
                  onClick={() => navigate('/credit-form')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition"
                >
                  Update Credit Information
                </button>

                {user.credit_score > 0 && (
                  <button
                    onClick={() => navigate('/feedback-report')}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition"
                  >
                    Your Feedback Report
                  </button>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition"
                >
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

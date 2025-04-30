import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CreditForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    income: '',
    on_time_payments: '',
    missed_payments: '',
    total_credit_limit: '',
    credit_used: '',
    credit_history_length: '',
    credit_accounts: '',
    recent_inquiries: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const token = localStorage.getItem('token');

      const response = await axios.post('http://127.0.0.1:5000/cscore', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Credit score calculated:', response.data.score);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to submit credit data.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Credit Score Form</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {Object.keys(formData).map((field) => (
            <div key={field}>
              <label className="block mb-1 font-medium capitalize">{field.replace(/_/g, ' ')}</label>
              <input
                type="number"
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
          ))}

          <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreditForm;

import { useState } from 'react';
import { useUser } from '../context/UserContext';
import toast from 'react-hot-toast';
import axios from '../api';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const FeedbackReport = () => {
  const { user} = useUser();
  const navigate = useNavigate();

  const [income, setIncome] = useState(0);
  const [totalSpending, setTotalSpending] = useState(0);
  const [paymentInput, setPaymentInput] = useState({ name: '', amount: '' });
  const [payments, setPayments] = useState([]);
  const [feedback, setFeedback] = useState([]);

  const handleAddPayment = () => {
    const { name, amount } = paymentInput;
    const amountValue = parseFloat(amount);

    if (!name || isNaN(amountValue) || amountValue <= 0) {
      toast.error('Enter a valid name and amount');
      return;
    }

    setPayments([...payments, { name, amount: amountValue, missed: false, onTime: false }]);
    setPaymentInput({ name: '', amount: '' });
  };

  const handleCheckboxChange = (index, field) => {
    const updatedPayments = [...payments];
    updatedPayments[index][field] = !updatedPayments[index][field];

    if (field === 'missed' && updatedPayments[index].missed) {
      updatedPayments[index].onTime = false;
    } else if (field === 'onTime' && updatedPayments[index].onTime) {
      updatedPayments[index].missed = false;
    }

    setPayments(updatedPayments);
  };

  const handleFeedbackSubmit = async () => {
    if (!user) {
      toast.error('Please log in first');
      return;
    }

    if (income === 0 || totalSpending === 0 || payments.length === 0) {
      toast.error('Please fill out all fields and add at least one payment');
      return;
    }

    const totalCalculated = payments.reduce((acc, curr) => acc + curr.amount, 0);
    if (totalCalculated !== totalSpending) {
      toast.error('Total of all payments must equal your total spending');
      return;
    }

    try {
      const response = await axios.post('/feedback', {
        income,
        total_spending: totalSpending,
        payments,
      });

      setFeedback(response.data.feedback);
      console.log('Feedback received:', response.data.feedback);
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401) {
        toast.error('Please log in again');
        navigate('/login');
      } else {
        toast.error('Something went wrong while fetching feedback');
      }
    }
  };

  if (!user || user?.credit_score === 0) {
    return (
      <div
        className="min-h-screen flex flex-col bg-cover bg-center"
        style={{
          backgroundImage: `url('https://static.vecteezy.com/system/resources/previews/036/107/022/large_2x/ai-generated-winter-background-of-snow-and-frost-with-free-space-for-your-decoration-free-photo.jpg')`,
        }}
      >
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
            <h2 className="text-3xl font-bold mb-4 text-blue-600">Synergy Feedback Report</h2>
            <p>Please complete the credit form to receive personalized feedback on how to improve your credit score.</p>
            <button
              onClick={() => navigate('/credit-form')}
              className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded transition"
            >
              Fill Credit Form
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="mt-4 w-full bg-gray-700 hover:bg-gray-800 text-white py-2 px-4 rounded transition"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center"
      style={{
        backgroundImage: `url('https://static.vecteezy.com/system/resources/previews/036/107/022/large_2x/ai-generated-winter-background-of-snow-and-frost-with-free-space-for-your-decoration-free-photo.jpg')`,
      }}
    >
      <Navbar />
      <div className="flex-grow flex items-center justify-center px-4 py-8">
        <div className="max-w-2xl w-full bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-blue-600 text-center mb-4">Synergy Feedback Form</h2>
          <p className="text-center mb-6">
            Your current credit score is: <strong>{user?.credit_score}</strong>
          </p>

          <div className="space-y-4">
            <div>
              <label>Annual Income</label>
              <input
                type="number"
                value={income}
                onChange={(e) => setIncome(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label>Total Spending Last Month</label>
              <input
                type="number"
                value={totalSpending}
                onChange={(e) => setTotalSpending(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <h3>Add Payment</h3>
              <input
                type="text"
                placeholder="Payment Name"
                value={paymentInput.name}
                onChange={(e) => setPaymentInput({ ...paymentInput, name: e.target.value })}
                className="w-full mb-2 p-2 border border-gray-300 rounded"
              />
              <input
                type="number"
                placeholder="Amount"
                value={paymentInput.amount}
                onChange={(e) => setPaymentInput({ ...paymentInput, amount: e.target.value })}
                className="w-full mb-2 p-2 border border-gray-300 rounded"
              />
              <button onClick={handleAddPayment} className="bg-green-600 text-white py-1 px-3 rounded">
                Add Payment
              </button>
            </div>

            {payments.length > 0 && (
              <div>
                <h4>Your Payments</h4>
                {payments.map((payment, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <span>
                      {payment.name}: £{payment.amount}
                    </span>
                    <label className="flex items-center space-x-1">
                      <input
                        type="checkbox"
                        checked={payment.missed}
                        onChange={() => handleCheckboxChange(index, 'missed')}
                      />
                      <span>Missed</span>
                    </label>
                    <label className="flex items-center space-x-1">
                      <input
                        type="checkbox"
                        checked={payment.onTime}
                        onChange={() => handleCheckboxChange(index, 'onTime')}
                      />
                      <span>On Time</span>
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button onClick={handleFeedbackSubmit} className="bg-blue-600 text-white py-2 px-4 rounded mt-4">
            Get Feedback
          </button>

          {feedback.length > 0 && (
            <div className="mt-6 p-4 bg-gray-50 rounded border border-gray-200">
              <h3 className="text-xl font-semibold mb-2">Your Feedback:</h3>
              <ul className="list-disc pl-5">
                {feedback.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={() => navigate('/dashboard')}
            className="mt-6 w-full bg-gray-700 hover:bg-gray-800 text-white py-2 px-4 rounded transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackReport;

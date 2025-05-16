import { useState } from 'react';
import { useUser } from '../context/UserContext';
import toast from 'react-hot-toast';
import axios from '../api';
import { useNavigate } from 'react-router-dom';

const FeedbackReport = () => {
  const { user } = useUser();
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
        user_id: user.user_id,
        income,
        total_spending: totalSpending,
        payments,
      });

      setFeedback(response.data.feedback);
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong while fetching feedback');
    }
  };

  if (user.credit_score === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 relative">
        <div
          className="absolute top-4 left-4 text-blue-600 font-bold cursor-pointer hover:underline"
          onClick={() => navigate('/dashboard')}
        >
          SynergyScore
        </div>
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-3xl font-bold mb-4 text-blue-600">Synergy Feedback Report</h2>
          <p>Please complete the credit form to receive personalized feedback on how to improve your credit score.</p>
          <button
            onClick={() => navigate('/credit-form')}
            className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded transition"
          >
            Fill Credit Form
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center relative px-4 py-4">
      <div
        className="absolute top-4 left-4 text-blue-600 font-bold cursor-pointer hover:underline"
        onClick={() => navigate('/dashboard')}
      >
        SynergyScore
      </div>

      <div className="max-w-2xl w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-blue-600 text-center mb-4">Synergy Credit Form</h2>
        <p className="text-center mb-6">Your current credit score is: <strong>{user.credit_score}</strong></p>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Annual Income</label>
            <input
              type="number"
              value={income}
              onChange={(e) => setIncome(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter your annual income"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Total Spending This Month</label>
            <input
              type="number"
              value={totalSpending}
              onChange={(e) => setTotalSpending(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter your total spending"
            />
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-lg font-semibold mb-2">Add Payment</h3>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Payment Name"
                value={paymentInput.name}
                onChange={(e) => setPaymentInput({ ...paymentInput, name: e.target.value })}
                className="w-1/2 p-2 border border-gray-300 rounded"
              />
              <input
                type="number"
                placeholder="Amount"
                value={paymentInput.amount}
                onChange={(e) => setPaymentInput({ ...paymentInput, amount: e.target.value })}
                className="w-1/2 p-2 border border-gray-300 rounded"
              />
            </div>
            <button
              onClick={handleAddPayment}
              className="bg-green-600 text-white py-1 px-3 rounded hover:bg-green-700 transition"
            >
              Add Payment
            </button>
          </div>

          {payments.length > 0 && (
            <div className="mt-4">
              <h4 className="text-md font-semibold mb-2">Your Payments</h4>
              <ul className="space-y-2">
                {payments.map((payment, index) => (
                  <li key={index} className="p-3 bg-gray-50 rounded border">
                    <div className="flex justify-between">
                      <div>
                        <p><strong>{payment.name}</strong> - £{payment.amount}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <label className="text-sm">
                          <input
                            type="checkbox"
                            checked={payment.missed}
                            onChange={() => handleCheckboxChange(index, 'missed')}
                            className="mr-1"
                          />
                          Missed
                        </label>
                        <label className="text-sm">
                          <input
                            type="checkbox"
                            checked={payment.onTime}
                            onChange={() => handleCheckboxChange(index, 'onTime')}
                            className="mr-1"
                          />
                          On Time
                        </label>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <button
          onClick={handleFeedbackSubmit}
          className="w-full mt-6 bg-blue-600 text-white py-2 px-4 rounded transition"
        >
          Get Feedback
        </button>

        {feedback.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Your Feedback</h3>
            <ul className="list-disc list-inside text-gray-700">
              {feedback.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackReport;

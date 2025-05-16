import { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import axios from '../api';

const PastPayments = () => {
  const { user } = useUser();
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await axios.get(`/payments/${user.user_id}`);
        setPayments(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPayments();
  }, [user.user_id]);

  return (
    <div className="bg-white shadow-md rounded p-6 mt-6">
      <h3 className="text-xl font-semibold mb-4">Past Payments</h3>
      {payments.length === 0 ? (
        <p className="text-gray-500">No past payments found.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {payments.map((payment, index) => (
            <li key={index} className="py-2 flex justify-between items-center">
              <div>
                <p className="font-medium">{payment.name}</p>
                <p className="text-sm text-gray-600">£{payment.amount} — {payment.timestamp}</p>
              </div>
              <span
                className={`px-2 py-1 text-sm rounded ${
                  payment.missed
                    ? 'bg-red-100 text-red-600'
                    : payment.onTime
                    ? 'bg-green-100 text-green-600'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {payment.missed ? 'Missed' : payment.onTime ? 'On Time' : 'Unmarked'}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PastPayments;

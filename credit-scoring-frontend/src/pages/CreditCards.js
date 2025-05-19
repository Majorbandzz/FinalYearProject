import React from 'react';
import { useUser } from '../context/UserContext';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar'; 

const creditCardData = [

  {
    bank: 'NovaBank',
    name: 'Nova Rewards Card',
    description: 'With this credit card, members receive a 3% cashback, and free airport lounge access at selected airports',
    minScore: 700,
  },
  {
    bank: 'Zenith Bank',
    name: 'Zenith Builder',
    description: 'This card is a life saver for individuals who have never owned a credit card before, or have no credit history. This card helps individuals build credit, with 0% APR for the first year, and has a limit of £300',
    minScore: 0,
  },
 
  {
    bank: 'Orion Financial',
    name: 'Orion Travel Elite',
    description: 'This credit card allows you to spend your money freely in foreign countries, knowing that you will not be charged any hidden and foreign transaction fees. This credit card gives members ultimate travel insurance',
    minScore: 750,
  },
  {
    bank: 'TrustLine',
    name: 'Trust Secure',
    description: 'This is a Low APR card for individuals who are not great at managing their credit, this card allows you to build back up your credit score by enabling cheaper  borrowing',
    minScore: 600,
  },
  {
    bank: 'FutureBank',
    name: 'Future Cashback',
    description: 'This is a credit card for everyday us which grants you a 2% cashback on all purchases, which you can contribute to paying your card off',
    minScore: 680,
  },
  {
    bank: 'Horizon Bank',
    name: 'Horizon Student',
    description: 'This is a credit card specialised for students in university. There is more information about this card on their website!',
    minScore: 500,
  },
  {
    bank: 'Pulse Credit Union',
    name: 'Pulse Low APR',
    description: 'This is Low APR card for rebuilding credit, and has a maximum spend of £150',
    minScore: 400,
  },
  {
    bank: 'Aurora Bank',
    name: 'Aurora Low Rate',
    description: 'This credit card consistently gives you low interest rates on all purchases',
    minScore: 500,
  },
];

const CreditCards = ({ showEligibleOnly = false }) => {
  const { user, isLoading } = useUser();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="p-10 text-center text-gray-600">
        Loading user information...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-10 text-center text-red-500">
        You need to be logged in to view credit cards.
      </div>
    );
  }

  const userScore = user.credit_score ?? 0;
  const eligibleCards = creditCardData.filter(card => userScore >= card.minScore);
  const cardsToShow = showEligibleOnly ? eligibleCards : creditCardData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 py-10 px-6">
      <Navbar /> 

      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1
            onClick={() => navigate('/dashboard')}
            className="text-2xl font-bold text-blue-600 cursor-pointer hover:underline"
            aria-label="Go to Dashboard"
          >
            
          </h1>
        </div>


        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
          {showEligibleOnly ? 'Your Eligible Credit Cards' : 'All Credit Card Offers'}
        </h2>


        <div className="text-center mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Back to Dashboard
          </button>
        </div>

        <p className="text-center text-gray-600 mb-10">
          {showEligibleOnly
            ? 'Based on your current credit score, these are the cards you can apply for.'
            : 'Explore a full selection of cards tailored to different credit ranges.'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {cardsToShow.length > 0 ? (
            cardsToShow.map((card, index) => {
              const isEligible = userScore >= card.minScore;
              return (
                <div
                  key={index}
                  className={`border rounded-2xl shadow-md p-6 transition-transform duration-300 hover:scale-[1.02] ${
                    isEligible ? 'bg-white border-green-200' : 'bg-gray-100 border-gray-200 opacity-70'
                  }`}
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">{card.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">{card.bank}</p>
                  <p className="text-sm text-gray-700 mb-4">{card.description}</p>

                  <div className="flex items-center justify-between">
                    {isEligible ? (
                      <span className="text-green-600 font-medium flex items-center space-x-1">
                        <FaCheckCircle /> <span>Eligible</span>
                      </span>
                    ) : (
                      <span className="text-red-500 font-medium flex items-center space-x-1">
                        <FaTimesCircle /> <span>Not Eligible</span>
                      </span>
                    )}
                    <span className="text-xs text-gray-500">Min Score: {card.minScore}</span>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-500 mt-10">
              {showEligibleOnly
                ? 'No eligible cards found based on your current credit score.'
                : 'No credit cards available at the moment.'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreditCards;

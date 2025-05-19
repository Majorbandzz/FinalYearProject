import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const Loans = () => {
    const navigate = useNavigate();

  const lowScoreBanks = [
    {
      name: 'WorldPlaza',
      minScore: 0,
      maxScore: 550,
      maxLoan: '£5,000',
      interestRate: '15% APR',
      details:
        'WorldPlaza offers smaller loan amounts with higher interest rates to individuals with credit scores below 550. This is to mitigate risk while providing access to credit.',
    },
    {
      name: 'Capton',
      minScore: 300,
      maxScore: 600,
      maxLoan: '£7,500',
      interestRate: '13.5% APR',
      details:
        'Capton extends loans up to £7,500 for those with credit scores between 300 and 600, with competitive but elevated interest reflecting the borrower’s credit profile.',
    },
    {
      name: 'Libreros',
      minScore: 200,
      maxScore: 580,
      maxLoan: '£6,000',
      interestRate: '14.2% APR',
      details:
        'Libreros specialises in lending to those with lower credit scores, offering loans up to £6,000 with an emphasis on flexible repayment plans.',
    },
    {
      name: 'Sharkly',
      minScore: 400,
      maxScore: 600,
      maxLoan: '£8,000',
      interestRate: '12.8% APR',
      details:
        'Sharkly provides loans to applicants with credit scores from 400 to 600, balancing loan size and interest rate for responsible borrowing.',
    },
    {
      name: 'Hamiltons',
      minScore: 350,
      maxScore: 590,
      maxLoan: '£5,500',
      interestRate: '14.7% APR',
      details:
        'Hamiltons focuses on borrowers with sub-600 credit scores, offering modest loan amounts with interest rates tailored to credit risk.',
    },
    {
      name: 'Six',
      minScore: 0,
      maxScore: 580,
      maxLoan: '£4,000',
      interestRate: '16% APR',
      details:
        'Six offers smaller, short-term loans at higher interest rates to customers with lower credit scores, aimed at urgent financial needs.',
    },
  ];

  const highScoreBanks = [
    {
      name: 'Trogden',
      minScore: 600,
      maxScore: 850,
      maxLoan: '£25,000',
      interestRate: '5.5% APR',
      details:
        'Trogden provides substantial loan amounts with favourable interest rates for borrowers with credit scores above 600, rewarding strong credit history.',
    },
    {
      name: 'Emirates PPP',
      minScore: 650,
      maxScore: 850,
      maxLoan: '£30,000',
      interestRate: '4.8% APR',
      details:
        'Emirates PPP specialises in premium loans for high credit score customers, offering competitive rates and generous lending limits.',
    },
    {
      name: 'KP Porter',
      minScore: 620,
      maxScore: 850,
      maxLoan: '£20,000',
      interestRate: '6.0% APR',
      details:
        'KP Porter provides balanced loans for mid to high credit score individuals, combining reasonable loan amounts with attractive interest rates.',
    },
    {
      name: 'Evergreen Bank',
      minScore: 600,
      maxScore: 850,
      maxLoan: '£22,500',
      interestRate: '5.8% APR',
      details:
        'Evergreen Bank supports borrowers with solid credit scores, offering flexible loan options and competitive rates tailored to your financial standing.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-12">
        <h2 className="text-4xl font-bold text-center text-blue-600 mb-10">Loan Options – SynergyScore</h2>

        <section className="mb-12">
          <h3 className="text-2xl font-semibold mb-4 text-gray-800">For Lower Credit Scores</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {lowScoreBanks.map((bank, index) => (
              <div key={index} className="bg-white rounded-xl shadow p-6">
                <h4 className="text-xl font-bold text-blue-700">{bank.name}</h4>
                <p className="mt-2 text-gray-700">{bank.details}</p>
                <ul className="mt-4 space-y-1 text-sm text-gray-600">
                  <li>
                    <strong>Loan Range:</strong> {bank.maxLoan}
                  </li>
                  <li>
                    <strong>Credit Score:</strong> {bank.minScore}–{bank.maxScore}
                  </li>
                  <li>
                    <strong>Interest Rate:</strong> {bank.interestRate}
                  </li>
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-semibold mb-4 text-gray-800">For Higher Credit Scores</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {highScoreBanks.map((bank, index) => (
              <div key={index} className="bg-white rounded-xl shadow p-6">
                <h4 className="text-xl font-bold text-green-700">{bank.name}</h4>
                <p className="mt-2 text-gray-700">{bank.details}</p>
                <ul className="mt-4 space-y-1 text-sm text-gray-600">
                  <li>
                    <strong>Loan Range:</strong> {bank.maxLoan}
                  </li>
                  <li>
                    <strong>Credit Score:</strong> {bank.minScore}–{bank.maxScore}
                  </li>
                  <li>
                    <strong>Interest Rate:</strong> {bank.interestRate}
                  </li>
                </ul>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-10 text-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-gray-700 hover:bg-gray-800 text-white py-2 px-6 rounded transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Loans;

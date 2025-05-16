import React from 'react';
import { Link } from 'react-router-dom';

function HPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-gray-100">
     
      <nav className="w-full flex justify-between items-center p-6 bg-white shadow">
        <div className="text-2xl font-bold text-blue-600">SynergyScore</div>
        <div className="space-x-4">
          <Link 
            to="/login" 
            className="px-4 py-2 border border-blue-600 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition"
          >
            Login
          </Link>
          <Link 
            to="/signup" 
            className="px-4 py-2 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition"
          >
            Sign Up
          </Link>
        </div>
      </nav>

   
      <main className="flex flex-col items-center justify-center flex-grow text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
          Unlock Your Financial Potential
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl">
          Take control of your credit health with SynergyScore.
          Track your score, improve your profile, and secure your financial future.
        </p>
        <Link 
          to="/signup" 
          className="px-6 py-3 bg-blue-600 text-white text-lg rounded-full hover:bg-blue-700 transition"
        >
          Get Started
        </Link>
      </main>

   
      <footer className="w-full p-4 bg-white shadow text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} SynergyScore — Empowering Your Credit Journey
      </footer>
    </div>
  );
}

export default HPage;

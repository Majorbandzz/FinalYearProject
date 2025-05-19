import React from "react";
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from './context/UserContext';


import PrivateRoute from "./pages/PrivateRoute";
import Signup from "./pages/Signup";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import CreditForm from "./pages/CreditForm";
import HPage from "./pages/HPage";
import FeedbackReport from "./pages/FeedbackReport";
import CreditCards from "./pages/CreditCards";
import Loans from "./pages/Loans";

function App() {
  return (
    <UserProvider>  
      <Router>
        <Toaster position="top-center" reverseOrder={false} />
        <Routes>
          <Route path="/" element={<HPage />} />
          <Route path="/credit-cards" element={<CreditCards />} />
          <Route path="/eligible-cards" element={<CreditCards showEligibleOnly={true} />} />
          <Route path="/loans" element={<Loans/>} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/credit-form" element={<PrivateRoute><CreditForm /></PrivateRoute>} />
          <Route path="/feedback-report" element={<PrivateRoute><FeedbackReport /></PrivateRoute>} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;

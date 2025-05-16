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

function App() {
  return (
    <UserProvider>  
      <Router>
        <Toaster position="top-center" reverseOrder={false} />
        <Routes>
          <Route path="/" element={<HPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/credit-form" element={<PrivateRoute><CreditForm /></PrivateRoute>} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;

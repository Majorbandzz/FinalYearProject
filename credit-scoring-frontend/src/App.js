import React from "react";
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./pages/PrivateRoute";
import Signup from "./pages/Signup";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import CreditForm from "./pages/CreditForm";

function App() {
  return (
    <Router>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<LoginPage />} />
 

        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/credit-form" 
          element={
            <PrivateRoute>
              <CreditForm />
            </PrivateRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;

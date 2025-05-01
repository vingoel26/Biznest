import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate // Import Navigate for redirecting
} from "react-router-dom";

import './App.css';
import LoginPage from './components/LoginPage';
import ContactPage from './components/Contactus';
import HomePage from './components/HomePage'; // Re-add HomePage import
import { Home } from 'lucide-react';

function App() {
  // Basic check if user is logged in (replace with real auth check)
  const isLoggedIn = !!localStorage.getItem('username');

  return (
    // Re-add Router and Routes setup
    <Router>
      <Routes>
        <Route path="/login" element={<HomePage />} />
        <Route 
          path="/home" 
          element={isLoggedIn ? <HomePage /> : <Navigate to="/login" replace />}
        />
        <Route 
          path="/WDA-assignment/new-contact-us/contact.html" 
          element={<ContactPage/>}
        />
        {/* Redirect root path to login or home based on logged-in status */}
        <Route 
          path="/" 
          element={isLoggedIn ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />}
        />
        {/* Add other routes here if needed based on merged code */}
      </Routes>
    </Router>

    
  );
}

export default App;
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import './App.css';
import LoginPage from './components/LoginPage';
import ContactPage from './components/Contactus';
import HomePage from './components/HomePage';
import Dashboard from './components/Dashboard';
import AboutUs from './components/AboutUs';

function App() {
  const isLoggedIn = !!localStorage.getItem('username');

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/home"
        element={isLoggedIn ? <HomePage /> : <Navigate to="/login" replace />}
      />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route
        path="/"
        element={
          isLoggedIn ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />
        }
      />
    </Routes>
  );
}

export default App;

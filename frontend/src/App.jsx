"use client"

import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import Layout from "./components/layout/Layout"
import IndexPage from "./pages/IndexPage"
import LoginPage from "./pages/LoginPage"
import HomePage from "./pages/HomePage"
import AboutPage from "./pages/AboutPage"
import ContactPage from "./pages/ContactPage"
import Dashboard from "./pages/Dashboard"
import ProfilePage from "./pages/ProfilePage"
import ThemeSettings from "./pages/ThemeSettings"
import { ListingsProvider } from "./context/ListingsContext"
import { ThemeProvider } from "./context/ThemeContext"
import { useEffect } from "react"
import ForgotPasswordPage from "./pages/ForgotPasswordPage"

function App() {
  const isLoggedIn = !!localStorage.getItem("username")
  const isAdmin = localStorage.getItem("isAdmin") === "true"
  const location = useLocation()

  // Add debug class to help with theme debugging and apply transitions
  useEffect(() => {
    document.body.classList.add("biznest-app")

    // Apply transition class to all elements for smooth theme changes
    const allElements = document.querySelectorAll("*")
    allElements.forEach((el) => {
      el.classList.add("transition-theme")
    })

    // Clear selected category if not on home page
    if (location.pathname !== "/home") {
      localStorage.removeItem("selectedCategory")
    }

    return () => {
      document.body.classList.remove("biznest-app")
      allElements.forEach((el) => {
        el.classList.remove("transition-theme")
      })
    }
  }, [location.pathname])

  return (
    <ThemeProvider>
      <ListingsProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<IndexPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Protected routes within layout */}
          <Route element={<Layout />}>
            <Route path="/about" element={isLoggedIn ? <AboutPage /> : <Navigate to="/login" replace />} />
            <Route path="/contact" element={isLoggedIn ? <ContactPage /> : <Navigate to="/login" replace />} />
            <Route path="/home" element={isLoggedIn ? <HomePage /> : <Navigate to="/login" replace />} />
            <Route path="/profile" element={isLoggedIn ? <ProfilePage /> : <Navigate to="/login" replace />} />
            <Route path="/theme-settings" element={isLoggedIn ? <ThemeSettings /> : <Navigate to="/login" replace />} />
            <Route
              path="/dashboard"
              element={isLoggedIn && isAdmin ? <Dashboard /> : <Navigate to="/login" replace />}
            />
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ListingsProvider>
    </ThemeProvider>
  )
}

export default App

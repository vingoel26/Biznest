"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { User, Mail, Lock, ArrowRight, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import logoImg from "/images/logo (2).png"
import axios from "axios";
const LoginPage = () => {
  const navigate = useNavigate()
  const [isActive, setIsActive] = useState(false)
  const [signUpForm, setSignUpForm] = useState({
    username: "",
    email: "",
    password: "",
  })
  const [signInForm, setSignInForm] = useState({
    username: "",
    password: "",
  })

  const handleRegister = () => setIsActive(true)
  const handleLogin = () => setIsActive(false)

  // Check if user is already logged in
  useEffect(() => {
    if (localStorage.getItem("username")) {
      navigate("/home")
    }
  }, [navigate])

  const handleSignUpSubmit = async (e) => {
    
    e.preventDefault();

    if (!signUpForm.username) {
      alert("User Name can not be empty");
      return;
    }
    if (signUpForm.password.length < 8) {
      alert("Password needs to be more than 7 characters long!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/api/auth/signup", {
        username: signUpForm.username,
        email: signUpForm.email,
        password: signUpForm.password,
      });

      alert(response.data.message || "Account created successfully!");
      setSignUpForm({ username: "", email: "", password: "" });
      setIsActive(false);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message);
      } else {
        alert("An error occurred during sign up. Please try again.");
      }
    }
  };



  const handleSignInSubmit = async (e) => {
    e.preventDefault();

    if (!signInForm.username) {
      alert("User Name can not be empty");
      return;
    }
    if (signInForm.password.length < 8) {
      alert("Password needs to be more than 7 characters long!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/api/auth/login", {
        username: signInForm.username,
        password: signInForm.password,
      });

      const { token, username } = response.data;

      // Store data in localStorage
      localStorage.setItem("jwtToken", token);
      localStorage.setItem("username", username);

      alert("Login successful!");
      setSignInForm({ username: "", password: "" });
      navigate("/home");

    } catch (error) {
      console.error("Login error:", error);
      alert(
        error.response?.data?.message || "An error occurred during login. Please try again."
      );
    }
  };


  const updateSignUpForm = (field, value) => {
    setSignUpForm((prev) => ({ ...prev, [field]: value }))
  }

  const updateSignInForm = (field, value) => {
    setSignInForm((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="bg-gradient-to-b from-black to-purple-950 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white/5 p-8 rounded-2xl shadow-xl border border-purple-500/20">
        <div className="text-center">
          <img src={logoImg || "/placeholder.svg"} alt="BizNest Logo" className="h-16 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white">{isActive ? "Create Account" : "Welcome Back"}</h2>
          <p className="mt-2 text-gray-300">
            {isActive ? "Join BizNest to discover local businesses" : "Sign in to access your account"}
          </p>
        </div>

        {!isActive ? (
          // Sign In Form
          <form className="mt-8 space-y-6" onSubmit={handleSignInSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="signin-username" className="block text-sm font-medium text-gray-300 mb-1">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    id="signin-username"
                    type="text"
                    value={signInForm.username}
                    onChange={(e) => updateSignInForm("username", e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Your username"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="signin-password" className="block text-sm font-medium text-gray-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    id="signin-password"
                    type="password"
                    value={signInForm.password}
                    onChange={(e) => updateSignInForm("password", e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Your password"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                    Remember me
                  </label>
                </div>

                <a href="#" className="text-sm text-purple-400 hover:text-purple-300">
                  Forgot password?
                </a>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 flex items-center justify-center"
              >
                Sign In
                <LogIn className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>
        ) : (
          // Sign Up Form
          <form className="mt-8 space-y-6" onSubmit={handleSignUpSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="signup-username" className="block text-sm font-medium text-gray-300 mb-1">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    id="signup-username"
                    type="text"
                    value={signUpForm.username}
                    onChange={(e) => updateSignUpForm("username", e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Choose a username"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="signup-email" className="block text-sm font-medium text-gray-300 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    id="signup-email"
                    type="email"
                    value={signUpForm.email}
                    onChange={(e) => updateSignUpForm("email", e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Your email address"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="signup-password" className="block text-sm font-medium text-gray-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    id="signup-password"
                    type="password"
                    value={signUpForm.password}
                    onChange={(e) => updateSignUpForm("password", e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Create a password (8+ characters)"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 flex items-center justify-center"
              >
                Create Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>
        )}

        <div className="mt-6 text-center">
          <p className="text-gray-300">
            {isActive ? "Already have an account?" : "Don't have an account?"}
            <button
              onClick={isActive ? handleLogin : handleRegister}
              className="ml-2 text-purple-400 hover:text-purple-300 font-medium"
            >
              {isActive ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage

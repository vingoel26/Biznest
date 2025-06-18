"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Eye, EyeOff, LogIn, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import api from "../services/api"
import userService from "../services/userService"

const LoginPage = () => {
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (isLogin) {
        // Login
        const response = await api.post("/api/auth/login", {
          username: formData.username,
          password: formData.password,
        })

        // Store token and username in localStorage
        localStorage.setItem("jwtToken", response.data.token)
        localStorage.setItem("username", response.data.username)

        // Fetch user profile to get roles
        const userProfile = await userService.getCurrentUser()
        if (userProfile.roles && userProfile.roles.includes("ROLE_ADMIN")) {
          localStorage.setItem("isAdmin", "true")
        } else {
          localStorage.removeItem("isAdmin")
        }

        navigate("/home")
      } else {
        // Register
        await api.post("/api/auth/signup", {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        })

        // Switch to login view after successful registration
        setIsLogin(true)
        setFormData({ ...formData, email: "" })
        setError("Registration successful! Please login.")
      }
    } catch (err) {
      console.error("Auth error:", err)
      setError(err.response?.data?.message || "An error occurred. Please check your credentials and try again.")
    } finally {
      setLoading(false)
    }
  }

  const toggleView = () => {
    setIsLogin(!isLogin)
    setError("")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-purple-950 p-4">
      <div className="max-w-md w-full bg-gray-900 rounded-xl shadow-lg border border-purple-500/30 overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">{isLogin ? "Welcome Back" : "Create an Account"}</h1>
            <p className="text-gray-400">
              {isLogin ? "Sign in to access your account" : "Join BizNest to discover local businesses"}
            </p>
          </div>

          {error && (
            <div
              className={`p-3 rounded-lg mb-6 text-sm ${
                error.includes("successful")
                  ? "bg-green-900/20 text-green-400 border border-green-500/30"
                  : "bg-red-900/20 text-red-400 border border-red-500/30"
              }`}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-black/30 border border-purple-500/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-black/30 border border-purple-500/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required={!isLogin}
                />
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-black/30 border border-purple-500/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {isLogin && (
                <div className="flex justify-end mt-1">
                  <Link to="/forgot-password" className="text-sm text-purple-400 hover:text-purple-300">
                    Forgot password?
                  </Link>
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : isLogin ? (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Sign Up
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                type="button"
                onClick={toggleView}
                className="ml-2 text-purple-400 hover:text-purple-300 focus:outline-none"
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage

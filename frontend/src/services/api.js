import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:8080", // Update this to match your backend URL
  headers: {
    "Content-Type": "application/json",
  },
})

// Add a request interceptor to include the token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwtToken")
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Optional: Add a response interceptor to handle global errors (e.g., 401 Unauthorized)
api.interceptors.response.use(
  (response) => response, // Pass through successful responses
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized errors globally
      console.error("Unauthorized request - Redirecting to login.")
      // Clear potentially invalid token and user info
      localStorage.removeItem("jwtToken")
      localStorage.removeItem("username")
      localStorage.removeItem("isAdmin")
      // Redirect to login page (use window.location as this is outside React components)
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login"
      }
    }
    return Promise.reject(error)
  },
)

export default api

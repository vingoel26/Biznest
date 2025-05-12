"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import logoImg from "/images/logo (2).png"

export default function IndexPage() {
  const navigate = useNavigate()

  // Automatically redirect to login after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login")
    }, 5000) // 5 seconds delay

    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="bg-gradient-to-b from-black to-purple-950 text-white min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-3xl mx-auto text-center">
        <img src={logoImg || "/placeholder.svg"} alt="BizNest Logo" className="h-24 mx-auto mb-8 animate-pulse" />

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
          Welcome to{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">BizNest</span>
        </h1>

        <p className="text-xl text-gray-300 mb-8">
          Your one-stop platform to discover and connect with local businesses. Please log in to continue your journey
          with us.
        </p>

        <div className="animate-bounce">
          <Button
            onClick={() => navigate("/login")}
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            Continue to Login
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        <p className="mt-8 text-gray-400 text-sm">Redirecting to login page in a few seconds...</p>
      </div>
    </div>
  )
}

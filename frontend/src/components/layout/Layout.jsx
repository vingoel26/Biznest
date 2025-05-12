"use client"

import { Outlet, useLocation } from "react-router-dom"
import Navbar from "./Navbar"
import Footer from "./Footer"

export default function Layout() {
  const location = useLocation()
  const isDashboard = location.pathname === "/dashboard"

  return (
    <div className="flex flex-col min-h-screen w-full transition-colors duration-300">
      <Navbar />
      <main className={`flex-grow w-full ${isDashboard ? "p-0" : ""}`}>
        <Outlet />
      </main>
      {!isDashboard && <Footer />}
    </div>
  )
}

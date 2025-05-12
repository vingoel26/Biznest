"use client"

import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Menu, X, User, LogOut, Settings, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import logoImg from "/images/logo (2).png"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDropdownVisible, setIsDropdownVisible] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const isLoggedIn = !!localStorage.getItem("username")
  const isAdmin = localStorage.getItem("isAdmin") === "true"
  const username = localStorage.getItem("username") || "User"

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const toggleDropdown = () => setIsDropdownVisible(!isDropdownVisible)

  const handleLogout = () => {
    localStorage.removeItem("username")
    localStorage.removeItem("jwtToken")
    localStorage.removeItem("isAdmin")
    setIsDropdownVisible(false)
    navigate("/login")
  }

  // Close mobile menu when changing routes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".user-dropdown-container")) {
        setIsDropdownVisible(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // If we're on the index page and not logged in, only show the login button
  const isIndexPage = location.pathname === "/"
  const showRestrictedNav = isIndexPage && !isLoggedIn

  return (
    <header className="bg-primary text-primary-foreground shadow-md transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to={isLoggedIn ? "/home" : "/"} className="flex items-center space-x-2">
            <img src={logoImg || "/placeholder.svg"} alt="BizNest Logo" className="h-10 w-auto" />
            <span className="text-xl font-bold">BizNest</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {!showRestrictedNav && (
              <>
                {isLoggedIn && (
                  <NavLink to="/home" active={location.pathname === "/home"}>
                    Home
                  </NavLink>
                )}
                <NavLink to="/about" active={location.pathname === "/about"}>
                  About
                </NavLink>
                <NavLink to="/contact" active={location.pathname === "/contact"}>
                  Contact
                </NavLink>
                {isAdmin && (
                  <NavLink to="/dashboard" active={location.pathname === "/dashboard"}>
                    Dashboard
                  </NavLink>
                )}
              </>
            )}

            <ThemeToggle className="mr-2" />

            {!isLoggedIn ? (
              <NavLink to="/login" active={location.pathname === "/login"}>
                Login
              </NavLink>
            ) : (
              <div className="relative user-dropdown-container">
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 hover:bg-primary-foreground/20 text-primary-foreground"
                  onClick={toggleDropdown}
                >
                  <User className="h-5 w-5" />
                  <span>{username}</span>
                </Button>

                {isDropdownVisible && (
                  <div className="absolute right-0 mt-2 w-48 bg-card rounded-md shadow-lg py-1 z-10 border border-border">
                    <div className="px-4 py-2 text-sm text-card-foreground/70 border-b border-border">
                      Signed in as <span className="font-medium text-card-foreground">{username}</span>
                    </div>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-card-foreground hover:bg-accent hover:text-accent-foreground"
                    >
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </div>
                    </Link>
                    <Link
                      to="/home"
                      className="block px-4 py-2 text-sm text-card-foreground hover:bg-accent hover:text-accent-foreground"
                    >
                      Home
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 text-sm text-card-foreground hover:bg-accent hover:text-accent-foreground"
                      >
                        <div className="flex items-center">
                          <Settings className="h-4 w-4 mr-2" />
                          Dashboard
                        </div>
                      </Link>
                    )}
                    <Link
                      to="/theme-settings"
                      className="block px-4 py-2 text-sm text-card-foreground hover:bg-accent hover:text-accent-foreground"
                    >
                      <div className="flex items-center">
                        <Palette className="h-4 w-4 mr-2" />
                        Theme Settings
                      </div>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-destructive hover:bg-destructive/10"
                    >
                      <div className="flex items-center">
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign out
                      </div>
                    </button>
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={toggleMenu} className="text-primary-foreground">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-primary-foreground/20">
            <div className="flex flex-col space-y-2">
              {!showRestrictedNav && (
                <>
                  {isLoggedIn && (
                    <MobileNavLink to="/home" active={location.pathname === "/home"}>
                      Home
                    </MobileNavLink>
                  )}
                  <MobileNavLink to="/about" active={location.pathname === "/about"}>
                    About
                  </MobileNavLink>
                  <MobileNavLink to="/contact" active={location.pathname === "/contact"}>
                    Contact
                  </MobileNavLink>
                  {isAdmin && (
                    <MobileNavLink to="/dashboard" active={location.pathname === "/dashboard"}>
                      Dashboard
                    </MobileNavLink>
                  )}
                  {isLoggedIn && (
                    <MobileNavLink to="/profile" active={location.pathname === "/profile"}>
                      Profile
                    </MobileNavLink>
                  )}
                </>
              )}

              {!isLoggedIn ? (
                <MobileNavLink to="/login" active={location.pathname === "/login"}>
                  Login
                </MobileNavLink>
              ) : (
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-primary-foreground hover:bg-primary-foreground/20 rounded-md"
                >
                  <div className="flex items-center">
                    <LogOut className="h-5 w-5 mr-2" />
                    Sign out
                  </div>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

function NavLink({ to, active, children }) {
  return (
    <Link
      to={to}
      className={`px-4 py-2 rounded-md transition-colors ${
        active
          ? "bg-primary-foreground/20 text-primary-foreground"
          : "text-primary-foreground/90 hover:bg-primary-foreground/10 hover:text-primary-foreground"
      }`}
    >
      {children}
    </Link>
  )
}

function MobileNavLink({ to, active, children }) {
  return (
    <Link
      to={to}
      className={`px-4 py-2 rounded-md transition-colors ${
        active
          ? "bg-primary-foreground/20 text-primary-foreground"
          : "text-primary-foreground/90 hover:bg-primary-foreground/10 hover:text-primary-foreground"
      }`}
    >
      {children}
    </Link>
  )
}

"use client"

import { Link, useNavigate } from "react-router-dom"
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react"
import { useEffect, useState } from "react"
import { useListings } from "../../context/ListingsContext"

export default function Footer() {
  const [isAdmin, setIsAdmin] = useState(false)
  const navigate = useNavigate()
  const { listings } = useListings()

  useEffect(() => {
    // Check if user is admin
    const adminStatus = localStorage.getItem("isAdmin") === "true"
    setIsAdmin(adminStatus)
  }, [])

  // Get unique categories from listings
  const categories = [...new Set(listings.map((listing) => {
    if (!listing.category) return null;
    if (typeof listing.category === 'string') return listing.category;
    if (typeof listing.category === 'object' && listing.category.name) return listing.category.name;
    return null;
  }))].filter(Boolean).slice(0, 5)

  // Handle category click
  const handleCategoryClick = (category) => {
    // Store the selected category in localStorage
    localStorage.setItem("selectedCategory", category)

    // If already on home page, dispatch a custom event instead of navigating
    if (window.location.pathname === "/home") {
      window.dispatchEvent(new CustomEvent("categorySelected", { detail: category }))
    } else {
      // Navigate to home page
      navigate("/home")
    }
  }

  return (
    <footer className="bg-primary text-primary-foreground transition-colors duration-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">About BizNest</h3>
            <p className="text-primary-foreground/80 mb-4">
              BizNest connects customers with local businesses, making it easy to find the best services in your area.
            </p>
            <div className="flex space-x-4">
              <SocialLink href="#" icon={<Facebook size={18} />} />
              <SocialLink href="#" icon={<Twitter size={18} />} />
              <SocialLink href="#" icon={<Instagram size={18} />} />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <FooterLink to="/home">Home</FooterLink>
              <FooterLink to="/about">About Us</FooterLink>
              <FooterLink to="/contact">Contact</FooterLink>
              <FooterLink to="/profile">Profile</FooterLink>
              <FooterLink to="/theme-settings">Theme Settings</FooterLink>
              {isAdmin && <FooterLink to="/dashboard">Dashboard</FooterLink>}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              {categories.map((category, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleCategoryClick(category)}
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                  >
                    {typeof category === 'string' ? category : (category && category.name) ? category.name : 'Unknown'}
                  </button>
                </li>
              ))}
              {categories.length === 0 && (
                <>
                  <FooterLink to="#" onClick={() => handleCategoryClick("Restaurants")}>
                    Restaurants
                  </FooterLink>
                  <FooterLink to="#" onClick={() => handleCategoryClick("Shopping")}>
                    Shopping
                  </FooterLink>
                  <FooterLink to="#" onClick={() => handleCategoryClick("Health & Beauty")}>
                    Health & Beauty
                  </FooterLink>
                  <FooterLink to="#" onClick={() => handleCategoryClick("Automotive")}>
                    Automotive
                  </FooterLink>
                  <FooterLink to="#" onClick={() => handleCategoryClick("Home Services")}>
                    Home Services
                  </FooterLink>
                </>
              )}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="mr-2 h-5 w-5 text-primary-foreground/70 shrink-0 mt-0.5" />
                <span className="text-primary-foreground/80">IIIT Lucknow</span>
              </li>
              <li className="flex items-center">
                <Phone className="mr-2 h-5 w-5 text-primary-foreground/70" />
                <span className="text-primary-foreground/80">+91 9336250306</span>
              </li>
              <li className="flex items-center">
                <Mail className="mr-2 h-5 w-5 text-primary-foreground/70" />
                <span className="text-primary-foreground/80">contact.biznest@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-12 pt-6 text-center text-primary-foreground/70">
          <p>&copy; {new Date().getFullYear()} BizNest. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

function SocialLink({ href, icon }) {
  return (
    <a
      href={href}
      className="bg-primary-foreground/10 p-2 rounded-full hover:bg-primary-foreground/20 transition-colors"
      aria-label="Social media"
    >
      {icon}
    </a>
  )
}

function FooterLink({ to, children, onClick }) {
  return (
    <li>
      <Link
        to={to}
        onClick={onClick}
        className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
      >
        {children}
      </Link>
    </li>
  )
}

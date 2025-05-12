"use client"

import { createContext, useState, useContext, useEffect } from "react"
import restaurantImage from "/images/restaurant-image.webp"
import shoppingImage from "/images/shopping.webp"
import beautyImage from "/images/Beauty.webp"
import automotiveImage from "/images/automotive.webp"
import homeServiceImage from "/images/homeService.webp"
import entertainmentImage from "/images/entertainment.webp"

// Create the context
const ListingsContext = createContext()

// Initial listings data
const initialListings = [
  {
    id: 1,
    name: "Tunday Kebabi",
    desc: "Best Kebabs in town!",
    rating: 4.8,
    category: "Restaurants",
    address: "123 Food Street, Downtown",
    phone: "+1 (555) 123-4567",
    hours: "9:00 AM - 10:00 PM",
    image: restaurantImage,
    status: "Approved",
    location: "Downtown",
  },
  {
    id: 2,
    name: "Pheonix Palassio",
    desc: "Your one-stop shop for everything!",
    rating: 4.5,
    category: "Shopping",
    address: "456 Mall Avenue, Midtown",
    phone: "+1 (555) 987-6543",
    hours: "10:00 AM - 9:00 PM",
    image: shoppingImage,
    status: "Approved",
    location: "Midtown",
  },
  {
    id: 3,
    name: "IIIT Lucknow",
    desc: "The world is at IIIT Lucknow, where are you?",
    rating: 4.9,
    category: "Education",
    address: "789 University Blvd, Eastside",
    phone: "+1 (555) 456-7890",
    hours: "8:00 AM - 5:00 PM",
    image: entertainmentImage,
    status: "Approved",
    location: "Eastside",
  },
  {
    id: 4,
    name: "Saroj Hostel",
    desc: "Best hostel in the whole town!",
    rating: 4.2,
    category: "Accommodation",
    address: "321 Dorm Lane, Campus Area",
    phone: "+1 (555) 234-5678",
    hours: "24/7",
    image: homeServiceImage,
    status: "Pending",
    location: "Campus Area",
  },
  {
    id: 5,
    name: "Luxury Spa & Wellness",
    desc: "Relax and rejuvenate with our premium services",
    rating: 4.7,
    category: "Health & Beauty",
    address: "567 Wellness Way, Uptown",
    phone: "+1 (555) 789-0123",
    hours: "9:00 AM - 8:00 PM",
    image: beautyImage,
    status: "Approved",
    location: "Uptown",
  },
  {
    id: 6,
    name: "Premium Auto Repair",
    desc: "Expert mechanics for all your vehicle needs",
    rating: 4.6,
    category: "Automotive",
    address: "890 Mechanic Street, Industrial Zone",
    phone: "+1 (555) 345-6789",
    hours: "8:00 AM - 6:00 PM",
    image: automotiveImage,
    status: "Pending",
    location: "Industrial Zone",
  },
]

// Provider component
export const ListingsProvider = ({ children }) => {
  const [listings, setListings] = useState(() => {
    // Try to load from localStorage first
    const savedListings = localStorage.getItem("biznest_listings")
    return savedListings ? JSON.parse(savedListings) : initialListings
  })

  const [metrics, setMetrics] = useState({
    total: 0,
    new: 0,
    pending: 0,
    active: 3456, // Static for demo
  })

  // Calculate metrics whenever listings change
  useEffect(() => {
    const pending = listings.filter((l) => l.status === "Pending").length
    const approved = listings.filter((l) => l.status === "Approved").length

    setMetrics({
      total: listings.length,
      new: listings.length > 3 ? listings.length - 3 : 0, // Assuming first 3 are "old"
      pending,
      approved,
      active: 3456, // Static for demo
    })

    // Save to localStorage
    localStorage.setItem("biznest_listings", JSON.stringify(listings))
  }, [listings])

  // Add a new listing
  const addListing = (listing) => {
    const newListing = {
      id: Date.now(),
      ...listing,
    }
    setListings((prev) => [...prev, newListing])
  }

  // Update an existing listing
  const updateListing = (id, updatedData) => {
    setListings((prev) => prev.map((listing) => (listing.id === id ? { ...listing, ...updatedData } : listing)))
  }

  // Delete a listing
  const deleteListing = (id) => {
    setListings((prev) => prev.filter((listing) => listing.id !== id))
  }

  // Get categories with counts
  const getCategoryCounts = () => {
    const counts = {}
    listings.forEach((listing) => {
      counts[listing.category] = (counts[listing.category] || 0) + 1
    })
    return counts
  }

  return (
    <ListingsContext.Provider
      value={{
        listings,
        metrics,
        addListing,
        updateListing,
        deleteListing,
        getCategoryCounts,
      }}
    >
      {children}
    </ListingsContext.Provider>
  )
}

// Custom hook to use the listings context
export const useListings = () => {
  const context = useContext(ListingsContext)
  if (!context) {
    throw new Error("useListings must be used within a ListingsProvider")
  }
  return context
}

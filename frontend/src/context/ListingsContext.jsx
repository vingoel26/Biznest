"use client"

import { createContext, useState, useContext, useEffect } from "react"
import restaurantImage from "/images/restaurant-image.webp"
import shoppingImage from "/images/shopping.webp"
import beautyImage from "/images/Beauty.webp"
import automotiveImage from "/images/automotive.webp"
import homeServiceImage from "/images/homeService.webp"
import entertainmentImage from "/images/entertainment.webp"
import listingService from "../services/listingService"
import categoryService from "../services/categoryService"

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
  const [listings, setListings] = useState([])
  const [metrics, setMetrics] = useState({
    total: 0,
    new: 0,
    pending: 0,
    active: 0,
  })
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [categories, setCategories] = useState([])
  const [categoryStats, setCategoryStats] = useState({})

  // Fetch listings from backend
  const fetchListings = async (page = 0, size = 10) => {
    setLoading(true)
    setError(null)
    try {
      const data = await listingService.getAllListings(page, size)
      setListings(data.content)
      setMetrics((prev) => ({
        ...prev,
        total: data.totalElements,
        active: data.totalElements,
      }))
      setPage(data.number)
      setSize(data.size)
      setTotalPages(data.totalPages)
    } catch (err) {
      setError("Failed to load listings.")
    } finally {
      setLoading(false)
    }
  }

  // Fetch categories from backend
  const fetchCategories = async () => {
    try {
      const data = await categoryService.getAllCategories()
      setCategories(data)
    } catch (err) {
      // Optionally handle error
    }
  }

  // Fetch category stats from backend
  const fetchCategoryStats = async () => {
    try {
      const data = await categoryService.getCategoryStats()
      setCategoryStats(data)
    } catch (err) {
      // Optionally handle error
    }
  }

  // Fetch listings by category (not paginated)
  const fetchListingsByCategory = async (category) => {
    try {
      return await listingService.getListingsByCategory(category);
    } catch (err) {
      // Optionally handle error
      return [];
    }
  };

  useEffect(() => {
    fetchListings()
    fetchCategories()
    fetchCategoryStats()
  }, [])

  // Add a new listing
  const addListing = async (listing) => {
    await listingService.createListing(listing)
    fetchListings(page, size)
  }

  // Update an existing listing
  const updateListing = async (id, updatedData) => {
    await listingService.updateListing(id, updatedData)
    fetchListings(page, size)
  }

  // Delete a listing
  const deleteListing = async (id) => {
    await listingService.deleteListing(id)
    fetchListings(page, size)
  }

  // Search and filter listings
  const searchListings = async (searchParams) => {
    setLoading(true)
    setError(null)
    try {
      const data = await listingService.searchListings(searchParams)
      setListings(data.content)
      setMetrics((prev) => ({
        ...prev,
        total: data.totalElements,
        active: data.totalElements,
      }))
      setPage(data.number)
      setSize(data.size)
      setTotalPages(data.totalPages)
    } catch (err) {
      setError("Failed to search listings.")
    } finally {
      setLoading(false)
    }
  }

  // Get categories with counts
  const getCategoryCounts = () => {
    const counts = {}
    listings.forEach((listing) => {
      counts[listing.category] = (counts[listing.category] || 0) + 1
    })
    return counts
  }

  // Create a new category
  const createCategory = async (category) => {
    await categoryService.createCategory(category)
    fetchCategories()
    fetchCategoryStats()
  }

  // Update a category
  const updateCategory = async (id, updated) => {
    await categoryService.updateCategory(id, updated)
    fetchCategories()
    fetchCategoryStats()
  }

  // Delete a category
  const deleteCategory = async (id) => {
    await categoryService.deleteCategory(id)
    fetchCategories()
    fetchCategoryStats()
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
        fetchListings,
        searchListings,
        page,
        size,
        totalPages,
        loading,
        error,
        setPage,
        setSize,
        // Category management
        categories,
        categoryStats,
        fetchCategories,
        fetchCategoryStats,
        createCategory,
        updateCategory,
        deleteCategory,
        // Listings by category
        fetchListingsByCategory,
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

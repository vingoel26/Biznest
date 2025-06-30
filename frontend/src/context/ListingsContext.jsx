"use client"

import { createContext, useState, useContext, useEffect } from "react"
import listingService from "../services/listingService"
import categoryService from "../services/categoryService"

// Create the context
const ListingsContext = createContext()

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
      // Map image field to imageUrl if present
      const listingsArr = Array.isArray(data.content) ? data.content : Array.isArray(data) ? data : [];
      setListings(listingsArr.map(listing => ({
        ...listing,
        image: listing.imageUrl || listing.image || '',
      })));
      setMetrics((prev) => ({
        ...prev,
        total: data.totalElements || (Array.isArray(data) ? data.length : 0),
        active: data.totalElements || (Array.isArray(data) ? data.length : 0),
      }))
      setPage(data.number || 0)
      setSize(data.size || 10)
      setTotalPages(data.totalPages || 1)
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
      return data; // Return the data for immediate use
    } catch (err) {
      console.error('Error fetching categories:', err);
      setCategories([]); // Set empty array on error
      return []; // Return empty array on error
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
  const fetchListingsByCategory = async (categoryId) => {
    try {
      return await listingService.getListingsByCategory(categoryId);
    } catch (err) {
      // Optionally handle error
      return [];
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      await Promise.all([
        fetchListings(),
        fetchCategories(),
        fetchCategoryStats()
      ]);
    };
    
    initializeData();
  }, [])

  // Add a new listing
  const addListing = async (listing) => {
    // Ensure category and owner are numbers (IDs)
    const listingToSend = {
      ...listing,
      category: listing.category ? parseInt(listing.category) : undefined,
      owner: listing.owner ? parseInt(listing.owner) : undefined,
    };
    const newListing = await listingService.createListing(listingToSend);
    fetchListings(page, size);
    return newListing; // Return the new listing object
  }

  // Update an existing listing
  const updateListing = async (id, updatedData) => {
    // Ensure category and owner are numbers (IDs)
    const updatedToSend = {
      ...updatedData,
      category: updatedData.category ? parseInt(updatedData.category) : undefined,
      owner: updatedData.owner ? parseInt(updatedData.owner) : undefined,
    };
    await listingService.updateListing(id, updatedToSend)
    fetchListings(page, size)
  }

  // Delete a listing
  const deleteListing = async (id) => {
    await listingService.deleteListing(id)
    fetchListings(page, size)
  }

  // Get categories with counts
  const getCategoryCounts = () => {
    const counts = {}
    listings.forEach((listing) => {
      if (listing.category && listing.category.name) {
        counts[listing.category.name] = (counts[listing.category.name] || 0) + 1
      }
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

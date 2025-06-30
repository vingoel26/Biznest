"use client"

import { createContext, useState, useContext, useEffect } from "react"
import reviewService from "../services/reviewService"

// Create the context
const ReviewsContext = createContext()

// Provider component
export const ReviewsProvider = ({ children }) => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Load all reviews on component mount
  useEffect(() => {
    loadAllReviews()
  }, [])

  const loadAllReviews = async () => {
    setLoading(true)
    setError(null)
    try {
      // For now, we'll load reviews from all business listings
      // In a real app, you might want to load reviews differently
      const allReviews = []
      
      // Get reviews with business response
      const reviewsWithResponse = await reviewService.getReviewsWithBusinessResponse()
      allReviews.push(...reviewsWithResponse)
      
      // Get reviews without business response
      const reviewsWithoutResponse = await reviewService.getReviewsWithoutBusinessResponse()
      allReviews.push(...reviewsWithoutResponse)
      
      setReviews(allReviews)
    } catch (err) {
      console.error("Error loading reviews:", err)
      setError("Failed to load reviews")
    } finally {
      setLoading(false)
    }
  }

  // Add a new review
  const addReview = async (reviewData) => {
    try {
      const { rating, comment, userId, businessListingId } = reviewData
      const newReview = await reviewService.createReview(
        { rating, comment },
        userId,
        businessListingId
      )
      setReviews(prev => [...prev, newReview])
      return newReview
    } catch (err) {
      console.error("Error adding review:", err)
      throw new Error("Failed to add review")
    }
  }

  // Add a response to a review
  const addResponse = async (reviewId, responseText) => {
    try {
      const updatedReview = await reviewService.addBusinessResponse(reviewId, responseText)
      setReviews(prev =>
        prev.map((review) =>
          review.id === reviewId ? updatedReview : review
        )
      )
      return updatedReview
    } catch (err) {
      console.error("Error adding response:", err)
      throw new Error("Failed to add response")
    }
  }

  // Delete a review
  const deleteReview = async (reviewId) => {
    try {
      await reviewService.deleteReview(reviewId)
      setReviews(prev => prev.filter((review) => review.id !== reviewId))
    } catch (err) {
      console.error("Error deleting review:", err)
      throw new Error("Failed to delete review")
    }
  }

  // Get reviews for a specific listing
  const getReviewsByListing = async (listingId) => {
    try {
      return await reviewService.getReviewsByBusinessListing(listingId)
    } catch (err) {
      console.error("Error getting reviews by listing:", err)
      return []
    }
  }

  // Get average rating for a specific listing
  const getAverageRatingByListing = async (listingId) => {
    try {
      const averageRating = await reviewService.getAverageRating(listingId)
      return averageRating ? averageRating.toFixed(1) : "0.0"
    } catch (err) {
      console.error("Error getting average rating:", err)
      return "0.0"
    }
  }

  // Check if user has reviewed a business
  const hasUserReviewedBusiness = async (userId, businessListingId) => {
    try {
      return await reviewService.hasUserReviewedBusiness(userId, businessListingId)
    } catch (err) {
      console.error("Error checking if user reviewed business:", err)
      return false
    }
  }

  // Refresh reviews
  const refreshReviews = () => loadAllReviews();

  return (
    <ReviewsContext.Provider
      value={{
        reviews,
        loading,
        error,
        addReview,
        addResponse,
        deleteReview,
        getReviewsByListing,
        getAverageRatingByListing,
        hasUserReviewedBusiness,
        refreshReviews,
      }}
    >
      {children}
    </ReviewsContext.Provider>
  )
}

// Custom hook to use the reviews context
export const useReviews = () => {
  const context = useContext(ReviewsContext)
  if (!context) {
    throw new Error("useReviews must be used within a ReviewsProvider")
  }
  return context
}

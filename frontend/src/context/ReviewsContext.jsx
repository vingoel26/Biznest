"use client"

import { createContext, useState, useContext, useEffect } from "react"

// Create the context
const ReviewsContext = createContext()

// Initial reviews data
const initialReviews = [
  {
    id: 1,
    listingId: 1,
    listingName: "Tunday Kebabi",
    businessType: "Restaurant",
    username: "John Doe",
    rating: 5,
    comment: "Excellent service! The staff was very friendly and professional. Would definitely recommend to others.",
    date: "2023-05-10T14:22:00Z",
    hasResponse: false,
    response: "",
  },
  {
    id: 2,
    listingId: 2,
    listingName: "Pheonix Palassio",
    businessType: "Shopping",
    username: "Sarah Johnson",
    rating: 4,
    comment: "Great shopping experience. The store had everything I needed and the prices were reasonable.",
    date: "2023-05-05T09:15:00Z",
    hasResponse: true,
    response: "Thank you for your feedback! We're glad you enjoyed shopping with us.",
  },
  {
    id: 3,
    listingId: 6,
    listingName: "Premium Auto Repair",
    businessType: "Automotive",
    username: "Michael Brown",
    rating: 3,
    comment: "Average experience. The service was okay but could be improved in some areas.",
    date: "2023-04-28T16:45:00Z",
    hasResponse: false,
    response: "",
  },
]

// Provider component
export const ReviewsProvider = ({ children }) => {
  const [reviews, setReviews] = useState(() => {
    // Try to load from localStorage first
    const savedReviews = localStorage.getItem("biznest_reviews")
    return savedReviews ? JSON.parse(savedReviews) : initialReviews
  })

  // Save to localStorage whenever reviews change
  useEffect(() => {
    localStorage.setItem("biznest_reviews", JSON.stringify(reviews))
  }, [reviews])

  // Add a new review
  const addReview = (review) => {
    const newReview = {
      id: Date.now(),
      date: new Date().toISOString(),
      hasResponse: false,
      response: "",
      ...review,
    }
    setReviews((prev) => [...prev, newReview])
    return newReview
  }

  // Add a response to a review
  const addResponse = (reviewId, responseText) => {
    setReviews((prev) =>
      prev.map((review) =>
        review.id === reviewId
          ? {
              ...review,
              hasResponse: true,
              response: responseText,
            }
          : review,
      ),
    )
  }

  // Delete a review
  const deleteReview = (reviewId) => {
    setReviews((prev) => prev.filter((review) => review.id !== reviewId))
  }

  // Get reviews for a specific listing
  const getReviewsByListing = (listingId) => {
    return reviews.filter((review) => review.listingId === listingId)
  }

  // Get average rating for a specific listing
  const getAverageRatingByListing = (listingId) => {
    const listingReviews = getReviewsByListing(listingId)
    if (listingReviews.length === 0) return 0

    const sum = listingReviews.reduce((total, review) => total + review.rating, 0)
    return (sum / listingReviews.length).toFixed(1)
  }

  return (
    <ReviewsContext.Provider
      value={{
        reviews,
        addReview,
        addResponse,
        deleteReview,
        getReviewsByListing,
        getAverageRatingByListing,
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

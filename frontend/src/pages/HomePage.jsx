"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Search, Star, MapPin, Phone, Clock, ExternalLink, MessageSquare, X, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useListings } from "../context/ListingsContext"
import { useReviews } from "../context/ReviewsContext"

const HomePage = () => {
  const navigate = useNavigate()
  const { listings, metrics, categories } = useListings()
  const { reviews, addReview, getReviewsByListing, getAverageRatingByListing } = useReviews()
  const [selectedCategories, setSelectedCategories] = useState(["All"])
  const [searchQuery, setSearchQuery] = useState("")
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedListing, setSelectedListing] = useState(null)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" })
  const [listingReviews, setListingReviews] = useState([])
  const username = localStorage.getItem("username") || "User"

  // Check if user is logged in
  useEffect(() => {
    if (!localStorage.getItem("username")) {
      navigate("/login")
    }
  }, [navigate])

  // Update HomePage to use selectedCategory from footer if available
  useEffect(() => {
    // Check if there's a selected category from the footer
    const savedCategory = localStorage.getItem("selectedCategory")
    if (savedCategory) {
      setSelectedCategories([savedCategory])
      // Clear after using it
      localStorage.removeItem("selectedCategory")
    }

    // Listen for custom event from footer
    const handleCategoryEvent = (event) => {
      setSelectedCategories([event.detail])
    }

    window.addEventListener("categorySelected", handleCategoryEvent)

    return () => {
      window.removeEventListener("categorySelected", handleCategoryEvent)
    }
  }, [])

  // Compose dynamic, sorted categories with icons
  const categoryIcons = {
    "Restaurants": "🍔",
    "Shopping": "🛍️",
    "Health & Beauty": "💇",
    "Automotive": "🚗",
    "Entertainment": "🎬",
    "Education": "🎓",
    "Accommodation": "🏨",
    // Add more mappings as needed
  };
  const sortedCategories = [
    { name: "All", icon: "🏠" },
    ...[...(categories || [])]
      .filter(cat => cat && cat.name)
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(cat => ({ name: cat.name, icon: categoryIcons[cat.name] || "🏷️" }))
  ];

  // Multi-category filter
  const filteredListings = listings.filter((listing) => {
    // Only show approved listings
    if (listing.status !== 'Approved') return false;
    // Support both string and object for listing.category
    const listingCat = typeof listing.category === 'string' ? listing.category : (listing.category && listing.category.name);
    const matchesCategory =
      selectedCategories.includes("All") ||
      selectedCategories.includes(listingCat);
    const matchesSearch =
      listing.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (listing.desc && listing.desc.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Multi-select handler
  const handleCategoryToggle = (catName) => {
    if (catName === "All") {
      setSelectedCategories(["All"]);
    } else {
      setSelectedCategories(prev => {
        const newSelected = prev.includes(catName)
          ? prev.filter(c => c !== catName)
          : [...prev.filter(c => c !== "All"), catName];
        return newSelected.length === 0 ? ["All"] : newSelected;
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("username")
    localStorage.removeItem("jwtToken")
    localStorage.removeItem("isAdmin")
    navigate("/login")
  }

  const openDetailsModal = (listing) => {
    setSelectedListing(listing)
    // Get reviews for this listing
    const reviews = getReviewsByListing(listing.id)
    setListingReviews(reviews)
    setIsDetailsModalOpen(true)
  }

  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false)
    setListingReviews([])
  }

  const openReviewModal = (listing, e) => {
    e.stopPropagation()
    setSelectedListing(listing)
    setIsReviewModalOpen(true)
  }

  const closeReviewModal = () => {
    setIsReviewModalOpen(false)
    setReviewForm({ rating: 5, comment: "" })
  }

  const handleReviewSubmit = (e) => {
    e.preventDefault()

    // Add the review to the context
    const newReview = addReview({
      listingId: selectedListing.id,
      listingName: selectedListing.name,
      businessType: selectedListing.category,
      username: username,
      rating: reviewForm.rating,
      comment: reviewForm.comment,
    })

    // If the details modal is open, update the listing reviews
    if (isDetailsModalOpen) {
      setListingReviews((prev) => [...prev, newReview])
    }

    alert("Thank you for your review!")
    closeReviewModal()
  }

  const handleReviewChange = (e) => {
    const { name, value } = e.target
    setReviewForm((prev) => ({ ...prev, [name]: value }))
  }

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* User Profile Section */}

      {/* Search Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search for services or products..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-background border border-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button className="bg-primary hover:bg-primary/90">Search</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-foreground">Categories</h2>

          <div className="flex overflow-x-auto pb-4 space-x-4 scrollbar-hide">
            {sortedCategories.map((category, index) => (
              <button
                key={index}
                onClick={() => handleCategoryToggle(category.name)}
                className={`flex flex-col items-center justify-center min-w-[100px] p-4 rounded-xl transition-all ${
                  selectedCategories.includes(category.name)
                    ? "bg-primary text-primary-foreground"
                    : "bg-card hover:bg-accent text-card-foreground hover:text-accent-foreground"
                }`}
                style={{ border: selectedCategories.includes(category.name) ? '2px solid #6366f1' : undefined }}
              >
                <span className="text-2xl mb-2">{category.icon}</span>
                <span className="text-sm font-medium">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Listings Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              {selectedCategories.includes("All") ? "Featured Listings" : selectedCategories.join(", ")}
            </h2>
            <Button variant="ghost" className="text-primary hover:text-primary/80">
              View All
            </Button>
          </div>

          {filteredListings.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map((listing) => {
                // Get average rating from reviews
                const avgRating = getAverageRatingByListing(listing.id) || listing.rating

                return (
                  <div
                    key={listing.id}
                    className="bg-card border border-border rounded-xl overflow-hidden transition-transform hover:transform hover:-translate-y-2"
                  >
                    <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${listing.image})` }} />
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-semibold text-card-foreground">{listing.name}</h3>
                        <div className="flex items-center bg-primary/20 px-2 py-1 rounded-md">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="ml-1 text-sm text-card-foreground">{avgRating}</span>
                        </div>
                      </div>

                      <p className="text-muted-foreground mb-4">{listing.desc}</p>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-start">
                          <MapPin className="h-5 w-5 text-primary mr-2 shrink-0 mt-0.5" />
                          <span className="text-sm text-muted-foreground">{listing.address}</span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-5 w-5 text-primary mr-2" />
                          <span className="text-sm text-muted-foreground">{listing.phone}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-5 w-5 text-primary mr-2" />
                          <span className="text-sm text-muted-foreground">{listing.hours}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <Button
                          variant="outline"
                          className="border-primary text-primary hover:bg-primary/10"
                          onClick={() => openDetailsModal(listing)}
                        >
                          <span>View Details</span>
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-primary hover:bg-primary/10"
                          onClick={(e) => openReviewModal(listing, e)}
                        >
                          <MessageSquare className="h-4 w-4 mr-1" />
                          <span>Review</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground">No listings found matching your criteria.</p>
              <Button
                className="mt-4 bg-primary hover:bg-primary/90"
                onClick={() => {
                  setSelectedCategories(["All"])
                  setSearchQuery("")
                }}
              >
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      

      {/* Details Modal */}
      {isDetailsModalOpen && selectedListing && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div
            className="bg-card rounded-xl shadow-lg w-full max-w-4xl mx-auto border border-border overflow-hidden my-4 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <div
                className="h-48 sm:h-64 bg-cover bg-center"
                style={{ backgroundImage: `url(${selectedListing.image})` }}
              />
              <button
                onClick={closeDetailsModal}
                className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-4">
                <h2 className="text-xl sm:text-2xl font-bold text-card-foreground">{selectedListing.name}</h2>
                <div className="flex items-center bg-primary/20 px-3 py-1 rounded-md">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="ml-1 font-medium text-card-foreground">
                    {getAverageRatingByListing(selectedListing.id) || selectedListing.rating}
                  </span>
                </div>
              </div>

              <p className="text-muted-foreground mb-6">{selectedListing.desc}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-3">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-primary mr-2 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-card-foreground">Address</p>
                      <p className="text-muted-foreground">{selectedListing.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-primary mr-2 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-card-foreground">Phone</p>
                      <p className="text-muted-foreground">{selectedListing.phone}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-primary mr-2 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-card-foreground">Hours</p>
                      <p className="text-muted-foreground">{selectedListing.hours}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="h-5 w-5 flex items-center justify-center bg-primary/20 rounded-full text-primary mr-2 shrink-0 mt-0.5">
                      <span className="text-xs font-bold">C</span>
                    </div>
                    <div>
                      <p className="font-medium text-card-foreground">Category</p>
                      <p className="text-muted-foreground">{selectedListing.category}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reviews Section in Modal */}
              <div className="mt-6 border-t border-border pt-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-card-foreground">Reviews</h3>
                  <Button
                    className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
                    onClick={(e) => openReviewModal(selectedListing, e)}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Write a Review
                  </Button>
                </div>

                {listingReviews.length > 0 ? (
                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                    {listingReviews.map((review) => (
                      <div key={review.id} className="bg-background border border-border rounded-lg p-4">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                              {review.username.charAt(0)}
                            </div>
                            <div className="ml-3">
                              <h4 className="font-medium text-card-foreground">{review.username}</h4>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Calendar className="h-3 w-3 mr-1" />
                                <span>{formatDate(review.date)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${star <= review.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-card-foreground my-2">{review.comment}</p>

                        {review.hasResponse && (
                          <div className="mt-3 pl-4 border-l-2 border-primary/30">
                            <p className="text-sm font-medium text-card-foreground">Business Response:</p>
                            <p className="text-sm text-muted-foreground mt-1">{review.response}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 bg-background border border-border rounded-lg">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-2 opacity-50" />
                    <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end mt-6">
                <Button variant="outline" className="border-border text-card-foreground" onClick={closeDetailsModal}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {isReviewModalOpen && selectedListing && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div
            className="bg-card rounded-xl shadow-lg w-full max-w-md mx-auto border border-border overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 sm:p-6 border-b border-border">
              <h2 className="text-xl font-semibold text-card-foreground">Review {selectedListing.name}</h2>
            </div>

            <form onSubmit={handleReviewSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-4 sm:p-6 space-y-4 overflow-y-auto">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Rating</label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewForm((prev) => ({ ...prev, rating: star }))}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`h-6 w-6 sm:h-8 sm:w-8 ${
                            star <= reviewForm.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="comment" className="block text-sm font-medium text-muted-foreground mb-1">
                    Your Review
                  </label>
                  <textarea
                    id="comment"
                    name="comment"
                    rows="4"
                    value={reviewForm.comment}
                    onChange={handleReviewChange}
                    className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Share your experience with this business..."
                    required
                  ></textarea>
                </div>
              </div>

              <div className="p-4 sm:p-6 border-t border-border flex flex-col sm:flex-row sm:justify-end gap-2 sm:space-x-3 mt-auto">
                <Button
                  type="button"
                  variant="outline"
                  className="border-input text-foreground hover:bg-accent w-full sm:w-auto"
                  onClick={closeReviewModal}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
                  Submit Review
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

const StatCard = ({ title, value, color }) => {
  return (
    <div className="bg-card border border-border rounded-xl p-4 text-center">
      <div className={`w-12 h-12 ${color} rounded-full mx-auto mb-3 flex items-center justify-center`}>
        <span className="text-xl font-bold text-white">{value}</span>
      </div>
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
    </div>
  )
}

export default HomePage

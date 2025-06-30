"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Search, Star, MapPin, Phone, Clock, ExternalLink, MessageSquare, X, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useListings } from "../context/ListingsContext"
import { useReviews } from "../context/ReviewsContext"
import listingService from "../services/listingService"
import userService from "../services/userService"

const HomePage = () => {
  const navigate = useNavigate()
  const { listings, metrics, categories, fetchListings, fetchCategories } = useListings()
  const { reviews, getReviewsByListing, getAverageRatingByListing } = useReviews()
  const [selectedCategories, setSelectedCategories] = useState(["All"])
  const [searchQuery, setSearchQuery] = useState("")
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedListing, setSelectedListing] = useState(null)
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const username = localStorage.getItem("username") || "User"
  // Cache for blob URLs
  const [listingImages, setListingImages] = useState({})
  const fetchedImageIds = useRef(new Set())

  // Add state for average ratings
  const [averageRatings, setAverageRatings] = useState({})

  // Check if user is logged in
  useEffect(() => {
    if (!localStorage.getItem("username")) {
      navigate("/login")
    }
  }, [navigate])

  // Load categories when component mounts
  useEffect(() => {
    const loadCategories = async () => {
      setCategoriesLoading(true)
      try {
        await fetchCategories()
      } catch (error) {
        console.error('Error loading categories:', error)
      } finally {
        setCategoriesLoading(false)
      }
    }
    
    // Only load if categories are empty
    if (!categories || categories.length === 0) {
      loadCategories()
    } else {
      setCategoriesLoading(false)
    }
  }, [fetchCategories, categories])

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

  // Always fetch all listings when HomePage is mounted
  useEffect(() => {
    fetchListings(0, 10000); // Fetch all listings (set size to a very large number)
  }, []);

  // Load average ratings for listings
  const loadAverageRatings = async (listings) => {
    const ratings = {};
    for (const listing of listings) {
      try {
        const avgRating = await getAverageRatingByListing(listing.id);
        ratings[listing.id] = avgRating;
      } catch (error) {
        console.error(`Error loading rating for listing ${listing.id}:`, error);
        ratings[listing.id] = listing.rating || "0.0";
      }
    }
    setAverageRatings(ratings);
  };

  // Update average ratings when listings change
  useEffect(() => {
    if (listings.length > 0) {
      loadAverageRatings(listings);
    }
  }, [listings]);

  // Reset image cache and fetch images for all approved listings when listings change
  useEffect(() => {
    setListingImages({});
    fetchedImageIds.current = new Set();

    let isMounted = true;
    const fetchImages = async () => {
      const newImages = {};
      await Promise.all(listings
        .filter(listing => listing.status === 'Approved')
        .map(async (listing) => {
          try {
            const blob = await listingService.getListingImage(listing.id);
            const url = URL.createObjectURL(blob);
            newImages[listing.id] = url;
            fetchedImageIds.current.add(listing.id);
          } catch (err) {
            // Optionally log error
          }
        }));
      if (isMounted && Object.keys(newImages).length > 0) {
        setListingImages(prev => ({ ...prev, ...newImages }));
      }
    };
    if (listings.length > 0) {
      fetchImages();
    }
    return () => { isMounted = false; };
  }, [listings]);

  // Compose dynamic, sorted categories from backend
  const sortedCategories = [
    { name: "All", icon: "" },
    ...[...(categories || [])]
      .filter(cat => cat && cat.name)
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(cat => ({ name: cat.name, icon: "" }))
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

  const openDetailsModal = async (listing) => {
    console.log('openDetailsModal called with:', listing);
    setSelectedListing(listing)
    // Get reviews for this listing
    try {
      const reviews = await getReviewsByListing(listing.id)
      setListingReviews(reviews)
    } catch (err) {
      console.error("Error loading reviews:", err)
      setListingReviews([])
    }
    setIsDetailsModalOpen(true)
  }

  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false)
    setListingReviews([])
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

  // Revoke blob URLs only on component unmount
  useEffect(() => {
    return () => {
      Object.values(listingImages).forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  const openListingPage = (listingId) => {
    navigate(`/listing/${listingId}`);
  };

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

          {categoriesLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2 text-muted-foreground">Loading categories...</span>
            </div>
          ) : (
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
          )}
        </div>
      </section>

      {/* Listings Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              {selectedCategories.includes("All") ? "Featured Listings" : selectedCategories.join(", ")}
            </h2>
          </div>

          {filteredListings.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map((listing) => {
                // Get average rating from reviews
                const avgRating = averageRatings[listing.id] || listing.rating

                return (
                  <div
                    key={listing.id}
                    className="bg-card border border-border rounded-xl overflow-hidden transition-transform hover:transform hover:-translate-y-2 cursor-pointer"
                    onClick={() => openListingPage(listing.id)}
                  >
                    <div className="h-48 bg-cover bg-center">
                      {listingImages[listing.id] ? (
                        <>
                          {console.log('Rendering image for', listing.id, listing.name, listingImages[listing.id])}
                          <img src={listingImages[listing.id]} alt={listing.name} className="h-48 w-full object-cover" />
                        </>
                      ) : (
                        <div className="h-48 w-full bg-gray-200 flex items-center justify-center text-gray-400">No Image</div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-semibold text-card-foreground">{listing.name}</h3>
                        <div className="flex items-center bg-primary/20 px-2 py-1 rounded-md">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="ml-1 text-sm text-card-foreground">{listing.rating || 0}</span>
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
                          <span className="text-sm text-muted-foreground">{listing.businessHours || listing.hours}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <Button
                          variant="outline"
                          className="border-primary text-primary hover:bg-primary/10"
                          onClick={(e) => openDetailsModal(listing)}
                        >
                          <span>View Details</span>
                          <ExternalLink className="ml-2 h-4 w-4" />
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
        console.log('Rendering Details Modal', { isDetailsModalOpen, selectedListing }),
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div
            className="bg-card rounded-xl shadow-lg w-full max-w-4xl mx-auto border border-border overflow-hidden my-4 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <div className="h-48 sm:h-64 bg-cover bg-center">
                {listingImages[selectedListing.id] ? (
                  <img src={listingImages[selectedListing.id]} alt={selectedListing.name} className="h-48 sm:h-64 w-full object-cover" />
                ) : (
                  <div className="h-48 sm:h-64 w-full bg-gray-200 flex items-center justify-center text-gray-400">No Image</div>
                )}
              </div>
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
                    {averageRatings[selectedListing.id] || selectedListing.rating}
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
                      <p className="text-muted-foreground">{selectedListing.businessHours || selectedListing.hours}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="h-5 w-5 flex items-center justify-center bg-primary/20 rounded-full text-primary mr-2 shrink-0 mt-0.5">
                      <span className="text-xs font-bold">C</span>
                    </div>
                    <div>
                      <p className="font-medium text-card-foreground">Category</p>
                      <p className="text-muted-foreground">{
                        typeof selectedListing.category === "object"
                          ? selectedListing.category.name
                          : selectedListing.category
                      }</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reviews Section in Modal */}
              <div className="mt-6 border-t border-border pt-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-card-foreground">Reviews</h3>
                </div>

                {listingReviews.length > 0 ? (
                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                    {listingReviews.map((review) => (
                      <div key={review.id} className="bg-background border border-border rounded-lg p-4">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                              {(review.username || "U").charAt(0)}
                            </div>
                            <div className="ml-3">
                              <h4 className="font-medium text-card-foreground">
                                {review.username || "Anonymous"}
                              </h4>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Calendar className="h-3 w-3 mr-1" />
                                <span>{formatDate(review.createdAt)}</span>
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

                        {review.businessResponse && (
                          <div className="mt-3 pl-4 border-l-2 border-primary/30">
                            <p className="text-sm font-medium text-card-foreground">Business Response:</p>
                            <p className="text-sm text-muted-foreground mt-1">{review.businessResponse}</p>
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

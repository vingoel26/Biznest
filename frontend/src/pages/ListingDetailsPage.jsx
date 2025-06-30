import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { MapPin, Phone, Clock, Star, User, MessageSquare, Building2, CheckCircle, XCircle } from "lucide-react"
import listingService from "../services/listingService"
import userService from "../services/userService"
import { useReviews } from "../context/ReviewsContext"
import reviewService from "../services/reviewService"

// Minimal UI components for self-contained use
function Card({ children, className = "", ...props }) {
  return <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`} {...props}>{children}</div>;
}
function CardHeader({ children, className = "", ...props }) {
  return <div className={`p-4 border-b bg-muted/50 ${className}`} {...props}>{children}</div>;
}
function CardTitle({ children, className = "", ...props }) {
  return <h3 className={`text-lg font-semibold ${className}`} {...props}>{children}</h3>;
}
function CardContent({ children, className = "", ...props }) {
  return <div className={`p-4 ${className}`} {...props}>{children}</div>;
}
function Badge({ children, className = "", variant, ...props }) {
  // Defensive: Only render valid children
  let safeChildren = children
  if (typeof children === 'object' && !Array.isArray(children) && children !== null) {
    // If children is a React element, render as is; if plain object, stringify for debug
    if (children.$$typeof) {
      safeChildren = children
    } else {
      safeChildren = JSON.stringify(children)
    }
  }
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted ${className}`} {...props}>{safeChildren}</span>;
}
function Textarea({ className = "", ...props }) {
  return <textarea className={`block w-full rounded border p-2 text-sm bg-background ${className}`} {...props} />;
}
function Avatar({ children, className = "", ...props }) {
  return <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full bg-muted ${className}`} {...props}>{children}</span>;
}
function AvatarFallback({ children, className = "", ...props }) {
  return <span className={`w-full h-full flex items-center justify-center text-xs font-bold ${className}`} {...props}>{children}</span>;
}
function Label({ children, className = "", ...props }) {
  return <label className={`block mb-1 font-medium text-sm ${className}`} {...props}>{children}</label>;
}

export default function ListingDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addReview, getReviewsByListing, getAverageRatingByListing, hasUserReviewedBusiness, refreshReviews } = useReviews()
  const [listing, setListing] = useState(null)
  const [reviews, setReviews] = useState([])
  const [avgRating, setAvgRating] = useState(null)
  const [imageUrl, setImageUrl] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" })
  const [userHasReviewed, setUserHasReviewed] = useState(false)
  const [existingReview, setExistingReview] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const username = localStorage.getItem("username") || "Anonymous"

  useEffect(() => {
    async function fetchListing() {
      try {
        setLoading(true)
        const listingData = await listingService.getListing(id)
        setListing(listingData)
        
        // Fetch reviews
        const reviewsData = await getReviewsByListing(id)
        setReviews(reviewsData)
        
        // Fetch average rating
        const avgRatingData = await getAverageRatingByListing(id)
        setAvgRating(avgRatingData)
        
        // Check if user has already reviewed this business
        try {
          const currentUser = await userService.getCurrentUser()
          if (currentUser) {
            const hasReviewed = await hasUserReviewedBusiness(currentUser.id, Number(id))
            setUserHasReviewed(hasReviewed)
            
            if (hasReviewed) {
              // Find the user's existing review
              const userReview = reviewsData.find(review => review.username === currentUser.username)
              if (userReview) {
                setExistingReview(userReview)
                setReviewForm({ rating: userReview.rating, comment: userReview.comment })
              }
            }
          }
        } catch (userError) {
          console.log("User not logged in or error checking review status")
        }
        
        // Fetch image
        try {
          const blob = await listingService.getListingImage(id)
          const url = URL.createObjectURL(blob)
          setImageUrl(url)
        } catch (err) {
          console.log("No image found for listing")
        }
      } catch (err) {
        console.error("Error fetching listing:", err)
        setError("Failed to load listing")
      } finally {
        setLoading(false)
      }
    }
    
    fetchListing()
  }, [id, getReviewsByListing, getAverageRatingByListing, hasUserReviewedBusiness])

  const handleReviewChange = (e) => {
    const { name, value } = e.target
    setReviewForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleEditReview = () => {
    if (existingReview) {
      setReviewForm({ rating: existingReview.rating, comment: existingReview.comment })
      setIsEditing(true)
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    if (existingReview) {
      setReviewForm({ rating: existingReview.rating, comment: existingReview.comment })
    } else {
      setReviewForm({ rating: 5, comment: "" })
    }
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    
    try {
      // Get current user information
      const currentUser = await userService.getCurrentUser()
      
      if (isEditing && existingReview) {
        // Update existing review
        const updatedReview = await reviewService.updateReview(existingReview.id, {
          rating: reviewForm.rating,
          comment: reviewForm.comment
        })
        
        // Re-fetch reviews from backend to ensure latest data
        const refreshedReviews = await getReviewsByListing(id)
        setReviews(refreshedReviews)
        // Update existingReview to the latest review for the current user
        const currentUserReview = refreshedReviews.find(r => r.username === currentUser.username)
        setExistingReview(currentUserReview)
        // Also refresh global reviews context for dashboard
        await refreshReviews();
        setIsEditing(false)
        alert("Review updated successfully!")
      } else {
        // Add new review
        const newReview = await addReview({
          rating: reviewForm.rating,
          comment: reviewForm.comment,
          userId: currentUser.id,
          businessListingId: Number(id),
        })
        
        // Update local state
        setReviews(prev => [newReview, ...prev])
        setUserHasReviewed(true)
        setExistingReview(newReview)
        alert("Review submitted successfully!")
      }
      
      // Update average rating
      const newAvgRating = await getAverageRatingByListing(Number(id))
      setAvgRating(newAvgRating)
      
      // Reset form
      setReviewForm({ rating: 5, comment: "" })
    } catch (err) {
      console.error("Error submitting review:", err)
      alert("Failed to submit review. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const renderStars = (rating, interactive = false, onRatingChange) => (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={interactive ? "button" : undefined}
          className={`${interactive ? "cursor-pointer hover:scale-110 transition-transform" : "cursor-default"} ${
            star <= rating ? "text-yellow-400" : "text-muted-foreground"
          }`}
          onClick={interactive && onRatingChange ? () => onRatingChange(star) : undefined}
          disabled={!interactive}
        >
          <Star className="h-4 w-4 fill-current" />
        </button>
      ))}
      <span className="ml-2 text-sm text-muted-foreground">({rating}/5)</span>
    </div>
  )

  const getStatusIcon = (status) => {
    return status?.toLowerCase() === "open" ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    )
  }

  const getStatusColor = (status) => {
    return status?.toLowerCase() === "open"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800"
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }
  if (error || !listing) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error || "Listing not found."}</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">{listing.name}</h1>
              <div className="flex items-center space-x-4">
                {renderStars(avgRating || listing.rating || 4.5)}
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <Building2 className="h-3 w-3" />
                  <span>{typeof listing.category === 'object' && listing.category !== null ? (listing.category.name || JSON.stringify(listing.category)) : (listing.category || '-')}</span>
                </Badge>
              </div>
            </div>
            
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image */}
            {imageUrl && (
              <Card className="overflow-hidden">
                <img
                  src={imageUrl || "/placeholder.svg"}
                  alt={listing.name}
                  className="w-full h-64 md:h-80 object-cover"
                  onError={e => { e.target.onerror = null; e.target.src = "/placeholder.svg"; }}
                />
                
              </Card>
            )}

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>About</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{
                  typeof (listing.description || listing.desc) === 'object' && (listing.description || listing.desc) !== null
                    ? ((listing.description || listing.desc).value || (listing.description || listing.desc).text || JSON.stringify(listing.description || listing.desc))
                    : (listing.description || listing.desc || '-')
                }</p>
              </CardContent>
            </Card>

            {/* Reviews Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5" />
                    <span>Reviews ({reviews.length})</span>
                  </div>
                  <div className="text-sm text-muted-foreground">Average: {avgRating || listing.rating || 0}/5</div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {reviews.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No reviews yet. Be the first to review!</div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar>
                            <AvatarFallback className="bg-primary/10 text-primary">
                                {review.username?.charAt(0) || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-medium">{review.username || "Anonymous"}</h4>
                              <p className="text-xs text-muted-foreground">
                                {new Date(review.createdAt).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </p>
                            </div>
                          </div>
                          {renderStars(review.rating)}
                        </div>
                        <p className="text-sm leading-relaxed">{review.comment}</p>
                        {review.businessResponse && (
                          <div className="bg-muted/50 rounded-md p-3 border-l-4 border-primary">
                            <div className="flex items-center space-x-2 mb-1">
                              <Building2 className="h-3 w-3 text-primary" />
                              <span className="text-xs font-medium text-primary">Business Response</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{review.businessResponse}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <Separator />

                {/* Review Form Section */}
                <div>
                  {userHasReviewed && existingReview ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Your Review</h3>
                        {!isEditing && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleEditReview}
                          >
                            Edit Review
                          </Button>
                        )}
                      </div>
                      
                      {isEditing ? (
                        <form onSubmit={handleReviewSubmit} className="space-y-4">
                          <div>
                            <Label className="text-sm font-medium">Your Rating</Label>
                            {renderStars(reviewForm.rating, true, (rating) => setReviewForm((prev) => ({ ...prev, rating })))}
                          </div>
                          <div>
                            <Label htmlFor="comment" className="text-sm font-medium">
                              Your Review
                            </Label>
                            <Textarea
                              id="comment"
                              name="comment"
                              value={reviewForm.comment}
                              onChange={handleReviewChange}
                              placeholder="Share your experience..."
                              className="mt-1 min-h-[100px]"
                              required
                            />
                          </div>
                          <div className="flex space-x-3">
                            <Button type="submit" disabled={submitting}>
                              {submitting ? "Updating..." : "Update Review"}
                            </Button>
                            <Button type="button" variant="outline" onClick={handleCancelEdit}>
                              Cancel
                            </Button>
                          </div>
                        </form>
                      ) : (
                        <div className="border rounded-lg p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Avatar>
                                <AvatarFallback className="bg-primary/10 text-primary">
                                  {existingReview.username?.charAt(0) || "U"}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-medium">{existingReview.username || "You"}</h4>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(existingReview.createdAt).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })}
                                </p>
                              </div>
                            </div>
                            {renderStars(existingReview.rating)}
                          </div>
                          <p className="text-sm leading-relaxed">{existingReview.comment}</p>
                          {existingReview.businessResponse && (
                            <div className="bg-muted/50 rounded-md p-3 border-l-4 border-primary">
                              <div className="flex items-center space-x-2 mb-1">
                                <Building2 className="h-3 w-3 text-primary" />
                                <span className="text-xs font-medium text-primary">Business Response</span>
                              </div>
                              <p className="text-sm text-muted-foreground">{existingReview.businessResponse}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
                      <form onSubmit={handleReviewSubmit} className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium">Your Rating</Label>
                          {renderStars(reviewForm.rating, true, (rating) => setReviewForm((prev) => ({ ...prev, rating })))}
                        </div>
                        <div>
                          <Label htmlFor="comment" className="text-sm font-medium">
                            Your Review
                          </Label>
                          <Textarea
                            id="comment"
                            name="comment"
                            value={reviewForm.comment}
                            onChange={handleReviewChange}
                            placeholder="Share your experience..."
                            className="mt-1 min-h-[100px]"
                            required
                          />
                        </div>
                        <Button type="submit" disabled={submitting}>
                          {submitting ? "Submitting..." : "Submit Review"}
                        </Button>
                      </form>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-sm text-muted-foreground">{
                      typeof listing.address === 'object' && listing.address !== null
                        ? (listing.address.value || listing.address.text || JSON.stringify(listing.address))
                        : (listing.address || '-')
                    }</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">{
                      typeof listing.phone === 'object' && listing.phone !== null
                        ? (listing.phone.value || listing.phone.number || JSON.stringify(listing.phone))
                        : (listing.phone || '-')
                    }</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Hours</p>
                    <p className="text-sm text-muted-foreground">{
                      typeof listing.businessHours === 'string' && listing.businessHours
                        ? listing.businessHours
                        : (typeof listing.hours === 'string' && listing.hours
                            ? listing.hours
                            : '-')
                    }</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <User className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Owner</p>
                    <p className="text-sm text-muted-foreground">{
                      typeof listing.ownerName === 'object' && listing.ownerName !== null
                        ? (listing.ownerName.displayName || listing.ownerName.username || listing.ownerName.name || JSON.stringify(listing.ownerName))
                        : (listing.ownerName || (typeof listing.owner === 'object' && listing.owner !== null
                          ? (listing.owner.displayName || listing.owner.username || listing.owner.name || JSON.stringify(listing.owner))
                          : (listing.owner || '-')))
                    }</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

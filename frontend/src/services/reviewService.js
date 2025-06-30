import api from "./api";

const reviewService = {
  // Create a new review
  createReview: async (review, userId, businessListingId) => {
    const params = new URLSearchParams();
    params.append('userId', userId);
    params.append('businessListingId', businessListingId);
    const response = await api.post(`/api/reviews?${params.toString()}`, review);
    return response.data;
  },

  // Get a single review by ID
  getReview: async (id) => {
    const response = await api.get(`/api/reviews/${id}`);
    return response.data;
  },

  // Get all reviews for a business listing
  getReviewsByBusinessListing: async (businessListingId) => {
    const response = await api.get(`/api/reviews/business/${businessListingId}`);
    return response.data;
  },

  // Get all reviews for a business listing (paginated)
  getReviewsByBusinessListingPaginated: async (businessListingId, page = 0, size = 10) => {
    const response = await api.get(`/api/reviews/business/${businessListingId}/page?page=${page}&size=${size}`);
    return response.data;
  },

  // Get all reviews by a user
  getReviewsByUser: async (userId) => {
    const response = await api.get(`/api/reviews/user/${userId}`);
    return response.data;
  },

  // Get all reviews by a user (paginated)
  getReviewsByUserPaginated: async (userId, page = 0, size = 10) => {
    const response = await api.get(`/api/reviews/user/${userId}/page?page=${page}&size=${size}`);
    return response.data;
  },

  // Update a review
  updateReview: async (id, updated) => {
    const response = await api.put(`/api/reviews/${id}`, updated);
    return response.data;
  },

  // Add business response to a review
  addBusinessResponse: async (id, response) => {
    const responseData = await api.post(`/api/reviews/${id}/response`, response);
    return responseData.data;
  },

  // Delete a review
  deleteReview: async (id) => {
    const response = await api.delete(`/api/reviews/${id}`);
    return response.data;
  },

  // Get average rating for a business listing
  getAverageRating: async (businessListingId) => {
    const response = await api.get(`/api/reviews/business/${businessListingId}/average-rating`);
    return response.data;
  },

  // Get review count for a business listing
  getReviewCount: async (businessListingId) => {
    const response = await api.get(`/api/reviews/business/${businessListingId}/count`);
    return response.data;
  },

  // Get reviews with business response
  getReviewsWithBusinessResponse: async () => {
    const response = await api.get('/api/reviews/with-response');
    return response.data;
  },

  // Get reviews without business response
  getReviewsWithoutBusinessResponse: async () => {
    const response = await api.get('/api/reviews/without-response');
    return response.data;
  },

  // Check if user has reviewed a business
  hasUserReviewedBusiness: async (userId, businessListingId) => {
    const params = new URLSearchParams();
    params.append('userId', userId);
    params.append('businessListingId', businessListingId);
    const response = await api.get(`/api/reviews/check-reviewed?${params.toString()}`);
    return response.data;
  }
};

export default reviewService; 
import api from "./api";

const listingService = {
  // Create a new listing
  createListing: async (listing) => {
    const response = await api.post("/api/listings", listing);
    return response.data;
  },

  // Get a single listing by ID
  getListing: async (id) => {
    const response = await api.get(`/api/listings/${id}`);
    return response.data;
  },

  // Get all listings (paginated)
  getAllListings: async (page = 0, size = 10) => {
    const response = await api.get(`/api/listings?page=${page}&size=${size}`);
    return response.data;
  },

  // Update a listing
  updateListing: async (id, updated) => {
    const response = await api.put(`/api/listings/${id}`, updated);
    return response.data;
  },

  // Delete a listing
  deleteListing: async (id) => {
    const response = await api.delete(`/api/listings/${id}`);
    return response.data;
  },

  // Search and filter listings (paginated)
  searchListings: async ({ name = "", category = "", location = "", page = 0, size = 10 }) => {
    const params = new URLSearchParams({ name, category, location, page, size });
    const response = await api.get(`/api/listings/search?${params.toString()}`);
    return response.data;
  },
};

export default listingService; 
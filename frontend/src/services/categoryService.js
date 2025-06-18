import api from "./api";

const categoryService = {
  // Create a new category
  createCategory: async (category) => {
    const response = await api.post("/api/categories", category);
    return response.data;
  },

  // Get all categories
  getAllCategories: async () => {
    const response = await api.get("/api/categories");
    return response.data;
  },

  // Get a single category by ID
  getCategory: async (id) => {
    const response = await api.get(`/api/categories/${id}`);
    return response.data;
  },

  // Update a category
  updateCategory: async (id, updated) => {
    const response = await api.put(`/api/categories/${id}`, updated);
    return response.data;
  },

  // Delete a category
  deleteCategory: async (id) => {
    const response = await api.delete(`/api/categories/${id}`);
    return response.data;
  },

  // Get category statistics (listings per category)
  getCategoryStats: async () => {
    const response = await api.get("/api/categories/stats");
    return response.data;
  },
};

export default categoryService; 
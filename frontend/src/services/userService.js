import api from "./api"

const userService = {
  // Get current user profile
  getCurrentUser: async () => {
    try {
      const response = await api.get("/api/user/me")
      return response.data
    } catch (error) {
      console.error("Error fetching current user:", error)
      throw error
    }
  },

  // Update current user profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.put("/api/user/me", profileData)
      return response.data
    } catch (error) {
      console.error("Error updating profile:", error)
      throw error
    }
  },

  // Update password
  updatePassword: async (currentPassword, newPassword) => {
    try {
      const response = await api.put("/api/user/password", {
        currentPassword,
        newPassword,
      })
      return response.data
    } catch (error) {
      console.error("Error updating password:", error)
      throw error
    }
  },

  // Admin: Get all users
  getAllUsers: async () => {
    try {
      const response = await api.get("/api/user/all")
      return response.data
    } catch (error) {
      console.error("Error fetching all users:", error)
      throw error
    }
  },

  // Admin: Get user by username
  getUserByUsername: async (username) => {
    try {
      const response = await api.get(`/api/user/${username}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching user ${username}:`, error)
      throw error
    }
  },

  // Admin: Update user roles
  updateUserRoles: async (username, roles) => {
    try {
      // Send the roles array directly, not wrapped in an object
      const response = await api.put(`/api/user/${username}/roles`, roles)
      return response.data
    } catch (error) {
      console.error(`Error updating roles for ${username}:`, error)
      throw error
    }
  },

  // Admin: Delete user
  deleteUser: async (username) => {
    try {
      const response = await api.delete(`/api/user/${username}`)
      return response.data
    } catch (error) {
      console.error(`Error deleting user ${username}:`, error)
      throw error
    }
  },

  // Upload profile picture (placeholder for future implementation)
  uploadProfilePicture: async (file) => {
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await api.post("/api/user/profile-picture", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      return response.data
    } catch (error) {
      console.error("Error uploading profile picture:", error)
      throw error
    }
  },
}

export default userService

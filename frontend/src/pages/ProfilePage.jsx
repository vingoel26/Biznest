"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  User,
  Mail,
  MapPin,
  Camera,
  Edit,
  Save,
  Lock,
  Shield,
  LogOut,
  ChevronRight,
  Globe,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import defaultUserPicture from "/images/defaultUserPicture.png"
import userService from "../services/userService"

const ProfilePage = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("profile")
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
    displayName: "",
    bio: "",
    location: "",
    website: "",
    profilePicture: null,
    roles: [],
  })
  const [formData, setFormData] = useState({ ...profileData })
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [imageCacheBuster, setImageCacheBuster] = useState(Date.now())

  // Add this state for password update
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [passwordError, setPasswordError] = useState(null)
  const [passwordSuccess, setPasswordSuccess] = useState(null)

  // Check if user is logged in and fetch profile data
  useEffect(() => {
    const username = localStorage.getItem("username")
    if (!username) {
      navigate("/login")
      return
    }

    const fetchUserProfile = async () => {
      try {
        setIsLoading(true)
        const userData = await userService.getCurrentUser()
        setProfileData(userData)
        setFormData(userData)
        setIsLoading(false)
      } catch (err) {
        console.error("Failed to fetch user profile:", err)
        setError("Failed to load profile data. Please try again later.")
        setIsLoading(false)
      }
    }

    fetchUserProfile()
  }, [navigate])

  // Check if user is admin
  const isAdmin = profileData.roles && profileData.roles.some((role) => role === "ROLE_ADMIN")

  useEffect(() => {
    if (isAdmin) {
      localStorage.setItem("isAdmin", "true")
    }
  }, [isAdmin])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)

      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    try {
      setIsLoading(true)

      // First update profile data
      const updatedProfile = await userService.updateProfile({
        displayName: formData.displayName,
        bio: formData.bio,
        location: formData.location,
        website: formData.website,
      })

      // Then upload profile picture if selected
      if (selectedFile) {
        try {
          await userService.uploadProfilePicture(selectedFile)
          // Refetch user profile to update image URL
          const userData = await userService.getCurrentUser()
          setPreviewUrl(null)
          setSelectedFile(null)
          setImageCacheBuster(Date.now())
          setProfileData(userData)
          setFormData(userData)
          console.log('ProfilePage profileData after save:', userData)
          localStorage.setItem('profileImageUpdated', Date.now())
          window.dispatchEvent(new Event('profileImageUpdated'))
        } catch (uploadError) {
          console.error("Failed to upload profile picture:", uploadError)
          // Continue with profile update even if picture upload fails
        }
      } else {
        // Refetch user profile to ensure all fields (including image) are up to date
        const userData = await userService.getCurrentUser()
        setProfileData(userData)
        setFormData(userData)
      }
      setIsEditing(false)
      setIsLoading(false)
      setError(null)
    } catch (err) {
      console.error("Failed to update profile:", err)
      setError("Failed to update profile. Please try again.")
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("username")
    localStorage.removeItem("jwtToken")
    localStorage.removeItem("isAdmin")
    navigate("/login")
  }

  // Add this function to handle password input changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))
  }

  // Update this function to use the userService
  const handlePasswordUpdate = async (e) => {
    e.preventDefault()

    // Reset messages
    setPasswordError(null)
    setPasswordSuccess(null)

    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords don't match")
      return
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters")
      return
    }

    try {
      setIsLoading(true)

      // Call service to update password
      await userService.updatePassword(passwordData.currentPassword, passwordData.newPassword)

      // Reset form and show success message
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      setPasswordSuccess("Password updated successfully")
      setIsLoading(false)
    } catch (error) {
      console.error("Failed to update password:", error)
      setPasswordError(error.response?.data?.message || "Failed to update password. Please try again.")
      setIsLoading(false)
    }
  }

  let imageSrc = defaultUserPicture;
  if (previewUrl) {
    imageSrc = previewUrl;
  } else if (profileData && profileData.profileImageUrl) {
    imageSrc = profileData.profileImageUrl + '?cb=' + imageCacheBuster;
  }

  // Show loading state
  if (isLoading && !profileData.username) {
    return (
      <div className="bg-background text-foreground min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background text-foreground min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg">{error}</div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="p-6 text-center border-b border-border">
                <div className="relative inline-block">
                  <img
                    key={imageSrc}
                    src={imageSrc}
                    alt="Profile"
                    className="h-24 w-24 rounded-full border-2 border-primary mx-auto object-cover"
                    onError={e => { e.target.onerror = null; e.target.src = defaultUserPicture; }}
                  />
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 bg-primary p-2 rounded-full text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer">
                      <Camera className="h-4 w-4" />
                      <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    </label>
                  )}
                </div>
                <h2 className="mt-4 text-xl font-bold text-card-foreground">
                  {profileData.displayName || profileData.username}
                </h2>
                <p className="text-muted-foreground text-sm">{isAdmin ? "Administrator" : "User"}</p>
                {profileData.location && (
                  <div className="flex items-center justify-center mt-2 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>{profileData.location}</span>
                  </div>
                )}
              </div>

              <nav className="p-4">
                <ul className="space-y-1">
                  <li>
                    <button
                      onClick={() => setActiveTab("profile")}
                      className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                        activeTab === "profile"
                          ? "bg-primary/20 text-primary"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      }`}
                    >
                      <User className="h-5 w-5 mr-3" />
                      <span>Profile Information</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab("security")}
                      className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                        activeTab === "security"
                          ? "bg-primary/20 text-primary"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      }`}
                    >
                      <Lock className="h-5 w-5 mr-3" />
                      <span>Security</span>
                    </button>
                  </li>
                  {isAdmin && (
                    <li>
                      <button
                        onClick={() => setActiveTab("admin")}
                        className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                          activeTab === "admin"
                            ? "bg-primary/20 text-primary"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        }`}
                      >
                        <Shield className="h-5 w-5 mr-3" />
                        <span>Admin Settings</span>
                      </button>
                    </li>
                  )}
                </ul>

                <div className="mt-6 pt-6 border-t border-border">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-3 text-red-400 hover:bg-red-900/20 hover:text-red-300 rounded-lg transition-colors"
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              {activeTab === "profile" && (
                <div>
                  <div className="flex justify-between items-center p-6 border-b border-border">
                    <h2 className="text-xl font-bold text-card-foreground">Profile Information</h2>
                    {!isEditing ? (
                      <Button
                        onClick={() => setIsEditing(true)}
                        className="bg-primary hover:bg-primary/90 flex items-center"
                        disabled={isLoading}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    ) : (
                      <Button
                        onClick={handleSave}
                        className="bg-green-600 hover:bg-green-700 flex items-center"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    )}
                  </div>

                  <div className="p-6">
                    {!isEditing ? (
                      <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center">
                          <div className="text-muted-foreground sm:w-1/3 mb-2 sm:mb-0">Username</div>
                          <div className="text-card-foreground font-medium">{profileData.username}</div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center">
                          <div className="text-muted-foreground sm:w-1/3 mb-2 sm:mb-0">Display Name</div>
                          <div className="text-card-foreground font-medium">{profileData.displayName || "Not set"}</div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center">
                          <div className="text-muted-foreground sm:w-1/3 mb-2 sm:mb-0">Email</div>
                          <div className="text-card-foreground font-medium flex items-center">
                            <Mail className="h-4 w-4 mr-2 text-primary" />
                            {profileData.email}
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-start">
                          <div className="text-muted-foreground sm:w-1/3 mb-2 sm:mb-0 sm:pt-1">Location</div>
                          <div className="text-card-foreground font-medium flex items-start">
                            <MapPin className="h-4 w-4 mr-2 text-primary mt-1" />
                            {profileData.location || "Not set"}
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-start">
                          <div className="text-muted-foreground sm:w-1/3 mb-2 sm:mb-0 sm:pt-1">Website</div>
                          <div className="text-card-foreground font-medium flex items-start">
                            <Globe className="h-4 w-4 mr-2 text-primary mt-1" />
                            {profileData.website ? (
                              <a
                                href={profileData.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                              >
                                {profileData.website}
                              </a>
                            ) : (
                              "Not set"
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-start">
                          <div className="text-muted-foreground sm:w-1/3 mb-2 sm:mb-0 sm:pt-1">Bio</div>
                          <div className="text-card-foreground flex items-start">
                            <FileText className="h-4 w-4 mr-2 text-primary mt-1" />
                            <span>{profileData.bio || "No bio provided"}</span>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-start">
                          <div className="text-muted-foreground sm:w-1/3 mb-2 sm:mb-0 sm:pt-1">Account Type</div>
                          <div className="text-card-foreground">
                            <span className="px-2 py-1 bg-primary/20 text-primary rounded-md text-sm font-medium">
                              {isAdmin ? "Administrator" : "Regular User"}
                            </span>
                          </div>
                        </div>

                        {profileData.createdAt && (
                          <div className="flex flex-col sm:flex-row sm:items-start">
                            <div className="text-muted-foreground sm:w-1/3 mb-2 sm:mb-0 sm:pt-1">Member Since</div>
                            <div className="text-card-foreground">
                              {new Date(profileData.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="flex flex-col">
                          <label htmlFor="username" className="text-muted-foreground mb-1">
                            Username
                          </label>
                          <input
                            type="text"
                            id="username"
                            name="username"
                            value={profileData.username}
                            disabled
                            className="bg-background/50 border border-input rounded-lg px-4 py-2 text-foreground/70 focus:outline-none cursor-not-allowed"
                          />
                          <p className="text-xs text-muted-foreground mt-1">Username cannot be changed</p>
                        </div>

                        <div className="flex flex-col">
                          <label htmlFor="displayName" className="text-muted-foreground mb-1">
                            Display Name
                          </label>
                          <input
                            type="text"
                            id="displayName"
                            name="displayName"
                            value={formData.displayName || ""}
                            onChange={handleInputChange}
                            className="bg-background border border-input rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                          />
                        </div>

                        <div className="flex flex-col">
                          <label htmlFor="email" className="text-muted-foreground mb-1">
                            Email
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={profileData.email}
                            disabled
                            className="bg-background/50 border border-input rounded-lg px-4 py-2 text-foreground/70 focus:outline-none cursor-not-allowed"
                          />
                          <p className="text-xs text-muted-foreground mt-1">Contact admin to change email</p>
                        </div>

                        <div className="flex flex-col">
                          <label htmlFor="location" className="text-muted-foreground mb-1">
                            Location
                          </label>
                          <input
                            type="text"
                            id="location"
                            name="location"
                            value={formData.location || ""}
                            onChange={handleInputChange}
                            className="bg-background border border-input rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            placeholder="City, Country"
                          />
                        </div>

                        <div className="flex flex-col">
                          <label htmlFor="website" className="text-muted-foreground mb-1">
                            Website
                          </label>
                          <input
                            type="url"
                            id="website"
                            name="website"
                            value={formData.website || ""}
                            onChange={handleInputChange}
                            className="bg-background border border-input rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            placeholder="https://example.com"
                          />
                        </div>

                        <div className="flex flex-col">
                          <label htmlFor="bio" className="text-muted-foreground mb-1">
                            Bio
                          </label>
                          <textarea
                            id="bio"
                            name="bio"
                            value={formData.bio || ""}
                            onChange={handleInputChange}
                            rows="4"
                            className="bg-background border border-input rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            placeholder="Tell us about yourself..."
                          ></textarea>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "security" && (
                <div>
                  <div className="p-6 border-b border-border">
                    <h2 className="text-xl font-bold text-card-foreground">Security Settings</h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium text-card-foreground mb-4">Change Password</h3>

                        {passwordError && (
                          <div className="mb-4 bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg">
                            {passwordError}
                          </div>
                        )}

                        {passwordSuccess && (
                          <div className="mb-4 bg-green-500/10 border border-green-500/50 text-green-500 px-4 py-3 rounded-lg">
                            {passwordSuccess}
                          </div>
                        )}

                        <form onSubmit={handlePasswordUpdate} className="space-y-4">
                          <div className="flex flex-col">
                            <label htmlFor="currentPassword" className="text-muted-foreground mb-1">
                              Current Password
                            </label>
                            <input
                              type="password"
                              id="currentPassword"
                              name="currentPassword"
                              value={passwordData.currentPassword}
                              onChange={handlePasswordChange}
                              className="bg-background border border-input rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                              required
                            />
                          </div>
                          <div className="flex flex-col">
                            <label htmlFor="newPassword" className="text-muted-foreground mb-1">
                              New Password
                            </label>
                            <input
                              type="password"
                              id="newPassword"
                              name="newPassword"
                              value={passwordData.newPassword}
                              onChange={handlePasswordChange}
                              className="bg-background border border-input rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                              required
                            />
                          </div>
                          <div className="flex flex-col">
                            <label htmlFor="confirmPassword" className="text-muted-foreground mb-1">
                              Confirm New Password
                            </label>
                            <input
                              type="password"
                              id="confirmPassword"
                              name="confirmPassword"
                              value={passwordData.confirmPassword}
                              onChange={handlePasswordChange}
                              className="bg-background border border-input rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                              required
                            />
                          </div>
                          <Button type="submit" className="bg-primary hover:bg-primary/90 mt-2" disabled={isLoading}>
                            {isLoading ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                                Updating...
                              </>
                            ) : (
                              "Update Password"
                            )}
                          </Button>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "admin" && isAdmin && (
                <div>
                  <div className="p-6 border-b border-border">
                    <h2 className="text-xl font-bold text-card-foreground">Admin Settings</h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-6">
                      <div className="bg-accent rounded-lg p-4 border border-border">
                        <h3 className="text-lg font-medium text-card-foreground mb-2">User Management</h3>
                        <p className="text-muted-foreground mb-4">Manage user accounts and permissions</p>
                        <Button
                          className="bg-primary hover:bg-primary/90 flex items-center"
                          onClick={() => navigate("/dashboard?tab=users")}
                        >
                          Go to User Management
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>

                      <div className="bg-accent rounded-lg p-4 border border-border">
                        <h3 className="text-lg font-medium text-card-foreground mb-2">Content Moderation</h3>
                        <p className="text-muted-foreground mb-4">Review and approve business listings</p>
                        <Button
                          className="bg-primary hover:bg-primary/90 flex items-center"
                          onClick={() => navigate("/dashboard?tab=listings")}
                        >
                          Go to Listings
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage

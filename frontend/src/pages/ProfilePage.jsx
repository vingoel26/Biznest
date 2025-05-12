"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { User, Mail, Phone, MapPin, Camera, Edit, Save, Lock, Bell, Shield, LogOut, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import defaultUserPicture from "/images/defaultUserPicture.png"

const ProfilePage = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("profile")
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    username: localStorage.getItem("username") || "User",
    email: "user@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main Street, City, Country",
    bio: "I'm a business enthusiast who loves discovering new local gems in my community.",
  })
  const [formData, setFormData] = useState({ ...profileData })
  const isAdmin = localStorage.getItem("isAdmin") === "true"

  // Check if user is logged in
  useEffect(() => {
    if (!localStorage.getItem("username")) {
      navigate("/login")
    }
  }, [navigate])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    setProfileData({ ...formData })
    setIsEditing(false)
    // In a real app, you would save to backend here
  }

  const handleLogout = () => {
    localStorage.removeItem("username")
    localStorage.removeItem("jwtToken")
    localStorage.removeItem("isAdmin")
    navigate("/login")
  }

  return (
    <div className="bg-background text-foreground min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="p-6 text-center border-b border-border">
                <div className="relative inline-block">
                  <img
                    src={defaultUserPicture || "/placeholder.svg"}
                    alt="Profile"
                    className="h-24 w-24 rounded-full border-2 border-primary mx-auto"
                  />
                  <button className="absolute bottom-0 right-0 bg-primary p-2 rounded-full text-primary-foreground hover:bg-primary/90 transition-colors">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                <h2 className="mt-4 text-xl font-bold text-card-foreground">{profileData.username}</h2>
                <p className="text-muted-foreground text-sm">{isAdmin ? "Administrator" : "User"}</p>
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
                  <li>
                    <button
                      onClick={() => setActiveTab("notifications")}
                      className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                        activeTab === "notifications"
                          ? "bg-primary/20 text-primary"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      }`}
                    >
                      <Bell className="h-5 w-5 mr-3" />
                      <span>Notifications</span>
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
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    ) : (
                      <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700 flex items-center">
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
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
                          <div className="text-muted-foreground sm:w-1/3 mb-2 sm:mb-0">Email</div>
                          <div className="text-card-foreground font-medium flex items-center">
                            <Mail className="h-4 w-4 mr-2 text-primary" />
                            {profileData.email}
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center">
                          <div className="text-muted-foreground sm:w-1/3 mb-2 sm:mb-0">Phone</div>
                          <div className="text-card-foreground font-medium flex items-center">
                            <Phone className="h-4 w-4 mr-2 text-primary" />
                            {profileData.phone}
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-start">
                          <div className="text-muted-foreground sm:w-1/3 mb-2 sm:mb-0 sm:pt-1">Address</div>
                          <div className="text-card-foreground font-medium flex items-start">
                            <MapPin className="h-4 w-4 mr-2 text-primary mt-1" />
                            {profileData.address}
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-start">
                          <div className="text-muted-foreground sm:w-1/3 mb-2 sm:mb-0 sm:pt-1">Bio</div>
                          <div className="text-card-foreground">{profileData.bio}</div>
                        </div>
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
                            value={formData.username}
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
                            value={formData.email}
                            onChange={handleInputChange}
                            className="bg-background border border-input rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label htmlFor="phone" className="text-muted-foreground mb-1">
                            Phone
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="bg-background border border-input rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label htmlFor="address" className="text-muted-foreground mb-1">
                            Address
                          </label>
                          <input
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            className="bg-background border border-input rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label htmlFor="bio" className="text-muted-foreground mb-1">
                            Bio
                          </label>
                          <textarea
                            id="bio"
                            name="bio"
                            value={formData.bio}
                            onChange={handleInputChange}
                            rows="4"
                            className="bg-background border border-input rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
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
                        <div className="space-y-4">
                          <div className="flex flex-col">
                            <label htmlFor="currentPassword" className="text-muted-foreground mb-1">
                              Current Password
                            </label>
                            <input
                              type="password"
                              id="currentPassword"
                              className="bg-background border border-input rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                          </div>
                          <div className="flex flex-col">
                            <label htmlFor="newPassword" className="text-muted-foreground mb-1">
                              New Password
                            </label>
                            <input
                              type="password"
                              id="newPassword"
                              className="bg-background border border-input rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                          </div>
                          <div className="flex flex-col">
                            <label htmlFor="confirmPassword" className="text-muted-foreground mb-1">
                              Confirm New Password
                            </label>
                            <input
                              type="password"
                              id="confirmPassword"
                              className="bg-background border border-input rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                          </div>
                          <Button className="bg-primary hover:bg-primary/90 mt-2">Update Password</Button>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-border">
                        <h3 className="text-lg font-medium text-card-foreground mb-4">Two-Factor Authentication</h3>
                        <p className="text-muted-foreground mb-4">
                          Add an extra layer of security to your account by enabling two-factor authentication.
                        </p>
                        <Button className="bg-primary hover:bg-primary/90">Enable 2FA</Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "notifications" && (
                <div>
                  <div className="p-6 border-b border-border">
                    <h2 className="text-xl font-bold text-card-foreground">Notification Preferences</h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-card-foreground font-medium">Email Notifications</h3>
                          <p className="text-muted-foreground text-sm">
                            Receive email updates about your account activity
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-card-foreground font-medium">New Listing Alerts</h3>
                          <p className="text-muted-foreground text-sm">Get notified when new businesses are added</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-card-foreground font-medium">Marketing Communications</h3>
                          <p className="text-muted-foreground text-sm">Receive promotional offers and updates</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>

                      <div className="pt-6 border-t border-border">
                        <Button className="bg-primary hover:bg-primary/90">Save Preferences</Button>
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
                          onClick={() => navigate("/dashboard")}
                        >
                          Go to Dashboard
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>

                      <div className="bg-accent rounded-lg p-4 border border-border">
                        <h3 className="text-lg font-medium text-card-foreground mb-2">Content Moderation</h3>
                        <p className="text-muted-foreground mb-4">Review and approve business listings</p>
                        <Button
                          className="bg-primary hover:bg-primary/90 flex items-center"
                          onClick={() => navigate("/dashboard")}
                        >
                          View Pending Listings
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>

                      <div className="bg-accent rounded-lg p-4 border border-border">
                        <h3 className="text-lg font-medium text-card-foreground mb-2">System Settings</h3>
                        <p className="text-muted-foreground mb-4">Configure system-wide settings and preferences</p>
                        <Button
                          className="bg-primary hover:bg-primary/90 flex items-center"
                          onClick={() => navigate("/dashboard")}
                        >
                          System Configuration
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

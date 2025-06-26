"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import {
  LayoutDashboard,
  ListChecks,
  BarChart3,
  MessageSquare,
  Settings,
  Plus,
  Edit,
  Trash,
  Search,
  Store,
  Users,
  Star,
  Lock,
  AlertTriangle,
  X,
  TrendingUp,
  Filter,
  ChevronDown,
  UserPlus,
  Shield,
  CheckCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { useListings } from "../context/ListingsContext"
import { useReviews } from "../context/ReviewsContext"
import userService from "../services/userService"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import dashboardService from "../services/dashboardService"
import listingService from "../services/listingService"

const Dashboard = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { listings, metrics, addListing, updateListing, deleteListing, getCategoryCounts, fetchListings, page, size, totalPages, loading, error, setPage, setSize, categories, categoryStats, createCategory, updateCategory, deleteCategory, fetchCategories, fetchCategoryStats, fetchListingsByCategory } = useListings()
  const { reviews, addResponse, deleteReview, getAverageRatingByListing } = useReviews()

  const [view, setView] = useState("dashboard")
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    location: "",
    status: "Approved",
    desc: "",
    rating: 4.5,
    address: "",
    phone: "",
    hours: "",
    image: "/images/restaurant-image.webp", // Default image
    owner: "" // Add owner field if needed
  })
  const [isEditMode, setIsEditMode] = useState(false)
  const [editId, setEditId] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [responseForm, setResponseForm] = useState({ reviewId: null, text: "" })
  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false)

  // User management state
  const [users, setUsers] = useState([])
  const [isLoadingUsers, setIsLoadingUsers] = useState(false)
  const [userError, setUserError] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false)
  const [userSearchQuery, setUserSearchQuery] = useState("")

  // Admin authentication
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false)
  const [adminCredentials, setAdminCredentials] = useState({ username: "", password: "" })
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminError, setAdminError] = useState("")

  // Review filtering
  const [reviewFilter, setReviewFilter] = useState("all")
  const [ratingFilter, setRatingFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false)
  const [reviewListings, setReviewListings] = useState([])

  const [categoryForm, setCategoryForm] = useState({ name: '', description: '' });
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [categoryError, setCategoryError] = useState('');

  // Add state for expanded category
  const [expandedCategoryId, setExpandedCategoryId] = useState(null);
  // Add state for listings by category
  const [categoryListings, setCategoryListings] = useState({});
  const [categoryLoading, setCategoryLoading] = useState({});

  const [analytics, setAnalytics] = useState({
    totalListings: 0,
    activeListings: 0,
    pendingListings: 0,
    totalUsers: 0,
    pendingReviews: 0,
    averageRating: 0,
    listingsTrend: "",
    usersTrend: "",
    reviewsTrend: "",
    ratingTrend: ""
  });
  const [analyticsError, setAnalyticsError] = useState(null);

  // Add state for image file and preview
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreviewUrl(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreviewUrl(null);
    }
  };

  // Function to handle expand/collapse
  const handleToggleCategoryListings = async (categoryId) => {
    if (expandedCategoryId === categoryId) {
      setExpandedCategoryId(null);
    } else {
      setExpandedCategoryId(categoryId);
      // Only fetch if not already loaded
      if (!categoryListings[categoryId]) {
        setCategoryLoading((prev) => ({ ...prev, [categoryId]: true }));
        const listings = await fetchListingsByCategory(categoryId);
        setCategoryListings((prev) => ({ ...prev, [categoryId]: listings }));
        setCategoryLoading((prev) => ({ ...prev, [categoryId]: false }));
      }
    }
  };

  // Function to get listings for a category
  const getListingsForCategory = (categoryId) => {
    return listings.filter(listing => listing.category && listing.category.id === categoryId);
  };

  // Add debugging for categories
  useEffect(() => {
    console.log('Categories from context:', categories);
    console.log('Category stats from context:', categoryStats);
  }, [categories, categoryStats]);

  // Restore filteredUsers logic
  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      (user.displayName && user.displayName.toLowerCase().includes(userSearchQuery.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(userSearchQuery.toLowerCase()))
  )

  // Add filtered listings logic for search functionality
  const filteredListings = listings.filter((listing) => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      listing.name.toLowerCase().includes(query) ||
      (listing.category?.name && listing.category.name.toLowerCase().includes(query)) ||
      listing.location.toLowerCase().includes(query) ||
      listing.status.toLowerCase().includes(query)
    );
  });

  // Restore filteredReviews logic
  const filteredReviews = reviews.filter((review) => {
    // Filter by business
    if (reviewFilter !== "all" && review.listingName !== reviewFilter) {
      return false
    }
    // Filter by rating
    if (ratingFilter !== "all") {
      const ratingValue = Number.parseInt(ratingFilter)
      if (review.rating !== ratingValue) {
        return false
      }
    }
    // Filter by date
    if (dateFilter !== "all") {
      const reviewDate = new Date(review.date)
      const now = new Date()
      switch (dateFilter) {
        case "today":
          return reviewDate.toDateString() === now.toDateString()
        case "week":
          const weekAgo = new Date(now)
          weekAgo.setDate(now.getDate() - 7)
          return reviewDate >= weekAgo
        case "month":
          const monthAgo = new Date(now)
          monthAgo.setDate(now.getDate() - 30)
          return reviewDate >= monthAgo
        default:
          return true
      }
    }
    return true
  })

  // Check if user is logged in and is admin
  useEffect(() => {
    let initialIsAdmin = false
    const storedIsAdmin = localStorage.getItem("isAdmin")
    if (storedIsAdmin === "true") {
      initialIsAdmin = true
    }
    setIsAdmin(initialIsAdmin)

    if (!localStorage.getItem("username")) {
      navigate("/login")
      return
    }

    if (!initialIsAdmin) {
      setIsAdminModalOpen(true)
    }
  }, [navigate])

  // Handle URL query parameters for tab switching
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const tab = searchParams.get('tab')
    if (tab && ['dashboard', 'listings', 'categories', 'analytics', 'reviews', 'users'].includes(tab)) {
      setView(tab)
    }
  }, [location.search])

  // Add this useEffect to populate review listings
  useEffect(() => {
    // Get unique business names from listings
    const uniqueBusinesses = [...new Set(reviews.map((review) => review.listingName))]
    setReviewListings(uniqueBusinesses)
  }, [reviews])

  // Fetch users when in users view
  useEffect(() => {
    if (view === "users" && isAdmin) {
      fetchUsers()
    }
  }, [view, isAdmin])

  // Fetch categories when in categories view
  useEffect(() => {
    if (view === "categories" && isAdmin) {
      fetchCategories();
      fetchCategoryStats();
    }
  }, [view, isAdmin]);

  // Add new useEffect to refresh data when view changes
  useEffect(() => {
    if (!isAdmin) return;

    // Refresh data based on current view
    switch (view) {
      case "dashboard":
        fetchAnalytics();
        fetchListings();
        break;
      case "listings":
        fetchListings();
        fetchCategories(); // For category dropdown in listing form
        break;
      case "categories":
        fetchCategories();
        fetchCategoryStats();
        break;
      case "analytics":
        fetchAnalytics();
        fetchListings(); // For category distribution chart
        fetchCategoryStats();
        break;
      case "reviews":
        // Reviews are fetched through context, but we can refresh listings for review listings dropdown
        fetchListings();
        break;
      case "users":
        fetchUsers();
        break;
      default:
        break;
    }
  }, [view, isAdmin]);

  // Fetch paginated listings when page, size, or view changes to 'listings'
  useEffect(() => {
    if (view === "listings") {
      fetchListings(page, size);
    }
  }, [page, size, view]);

  const fetchUsers = async () => {
    try {
      setIsLoadingUsers(true)
      setUserError(null)
      const fetchedUsers = await userService.getAllUsers()
      setUsers(fetchedUsers)
      setIsLoadingUsers(false)
    } catch (error) {
      console.error("Failed to fetch users:", error)
      setUserError("Failed to load users. Please try again.")
      setIsLoadingUsers(false)
    }
  }

  const handleNav = (section) => setView(section)

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    let userProfile;
    try {
      userProfile = await userService.getCurrentUser();
      console.log("Fetched userProfile:", userProfile);
    } catch (err) {
      alert("Could not determine current user. Please log in again.");
      return;
    }
    // Prepare complete listing data, now with owner set
    const listingData = {
      ...formData,
      address: formData.address || `${formData.location} Address`,
      phone: formData.phone || "+1 (555) 123-4567",
      businessHours: formData.hours || "9:00 AM - 5:00 PM",
      rating: formData.rating || 4.5,
      imageUrl: formData.image || "/images/restaurant-image.webp",
      description: formData.desc || "",
      category: formData.category ? parseInt(formData.category) : undefined,
      owner: userProfile.id // <-- set owner here
    };
    console.log("Submitting listingData:", listingData);
    let listingId;
    if (isEditMode) {
      await updateListing(editId, listingData);
      listingId = editId;
    } else {
      const newListing = await addListing(listingData);
      listingId = newListing.id;
    }
    setIsModalOpen(false); // Close modal immediately after add/edit
    console.log("Modal should now be closed");
    // Upload image if selected
    if (selectedImageFile && listingId) {
      await listingService.uploadListingImage(listingId, selectedImageFile);
    }
    setFormData({
      name: "",
      category: "",
      location: "",
      status: "Approved",
      desc: "",
      rating: 4.5,
      address: "",
      phone: "",
      hours: "",
      image: "/images/restaurant-image.webp",
      owner: ""
    });
    setIsEditMode(false);
    setEditId(null);
    fetchAnalytics(); // Refresh analytics
  };

  const handleEdit = (id) => {
    const listing = listings.find((l) => l.id === id)
    setFormData({
      name: listing.name,
      category: listing.category?.id || "",
      location: listing.location,
      status: listing.status,
      desc: listing.description || "",
      rating: listing.rating || 4.5,
      address: listing.address || "",
      phone: listing.phone || "",
      hours: listing.businessHours || "",
      image: '', // not used for blob
      owner: listing.owner
    });
    setSelectedImageFile(null);
    // Fetch image blob for preview
    setImagePreviewUrl(null);
    listingService.getListingImage(id).then(blob => {
      if (blob && blob.size > 0) {
        setImagePreviewUrl(URL.createObjectURL(blob));
      }
    });
    setIsEditMode(true)
    setEditId(id)
    setIsModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      await deleteListing(id)
      fetchAnalytics(); // Refresh analytics
    }
  }

  const openModal = () => {
    setFormData({
      name: "",
      category: "",
      location: "",
      status: "Approved",
      desc: "",
      rating: 4.5,
      address: "",
      phone: "",
      hours: "",
      image: '',
      owner: ""
    });
    setSelectedImageFile(null);
    setImagePreviewUrl(null);
    setIsEditMode(false)
    setIsModalOpen(true)
  }

  const openResponseModal = (reviewId) => {
    setResponseForm({ reviewId, text: "" })
    setIsResponseModalOpen(true)
  }

  const closeResponseModal = () => {
    setIsResponseModalOpen(false)
    setResponseForm({ reviewId: null, text: "" })
  }

  const handleResponseSubmit = (e) => {
    e.preventDefault()
    addResponse(responseForm.reviewId, responseForm.text)
    closeResponseModal()
    fetchAnalytics(); // Refresh analytics
  }

  const handleResponseChange = (e) => {
    setResponseForm((prev) => ({ ...prev, text: e.target.value }))
  }

  const handleDeleteReview = (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      deleteReview(reviewId)
      fetchAnalytics(); // Refresh analytics
    }
  }

  // User management functions
  const handleViewUser = (user) => {
    setSelectedUser(user)
    setIsUserModalOpen(true)
  }

  const handleEditUserRoles = (user) => {
    setSelectedUser(user)
    setIsRoleModalOpen(true)
  }

  const handleDeleteUser = async (username) => {
    if (window.confirm(`Are you sure you want to delete user ${username}? This action cannot be undone.`)) {
      try {
        await userService.deleteUser(username)
        fetchUsers() // Refresh the user list
        fetchAnalytics(); // Refresh analytics
      } catch (error) {
        console.error(`Failed to delete user ${username}:`, error)
        setUserError(`Failed to delete user ${username}. ${error.response?.data?.message || "Please try again."}`)
      }
    }
  }

  const handleUpdateRoles = async (e) => {
    e.preventDefault()

    const form = e.target
    const isAdminChecked = form.isAdmin.checked

    try {
      // Fix: Send an array of roles instead of an object
      const roles = isAdminChecked ? ["ROLE_USER", "ROLE_ADMIN"] : ["ROLE_USER"]
      await userService.updateUserRoles(selectedUser.username, roles)
      setIsRoleModalOpen(false)
      fetchUsers() // Refresh the user list

      // If the updated user is the current user, refetch their profile and update isAdmin
      const currentUsername = localStorage.getItem("username")
      if (selectedUser.username === currentUsername) {
        const updatedUser = await userService.getCurrentUser()
        const isStillAdmin = updatedUser.roles && updatedUser.roles.includes("ROLE_ADMIN")
        setIsAdmin(isStillAdmin)
        if (!isStillAdmin) {
          localStorage.removeItem("isAdmin")
          navigate("/home")
        }
      }
    } catch (error) {
      console.error(`Failed to update roles for ${selectedUser.username}:`, error)
      setUserError(`Failed to update roles. ${error.response?.data?.message || "Please try again."}`)
    }
  }

  // Prepare data for charts
  const categoryChartData = Object.keys(categoryStats).map((name) => ({
    name,
    count: categoryStats[name],
  }))

  const pieData = categoryChartData.map((cat) => ({
    name: cat.name,
    value: cat.count,
  }))

  const COLORS = ["#8b5cf6", "#6366f1", "#ec4899", "#f43f5e", "#10b981", "#14b8a6", "#f59e0b", "#6b7280"]

  const getChartColors = () => {
    const isDark = document.documentElement.classList.contains("dark")

    // Base colors that work well in both light and dark modes
    return {
      barColor: isDark ? "#8b5cf6" : "#7c3aed",
      lineColor: isDark ? "#8b5cf6" : "#7c3aed",
      gridColor: isDark ? "#444" : "#e5e7eb",
      textColor: isDark ? "#aaa" : "#6b7280",
      pieColors: ["#8b5cf6", "#6366f1", "#ec4899", "#f43f5e", "#10b981", "#14b8a6", "#f59e0b", "#6b7280"],
      tooltipBg: isDark ? "#333" : "#fff",
      tooltipBorder: isDark ? "#555" : "#e5e7eb",
      tooltipText: isDark ? "#fff" : "#111",
    }
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

  // Add or update category
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setCategoryError('');
    try {
      if (editingCategoryId) {
        await updateCategory(editingCategoryId, categoryForm);
        setEditingCategoryId(null);
      } else {
        await createCategory(categoryForm);
      }
      setCategoryForm({ name: '', description: '' });
      fetchCategoryStats();
    } catch (err) {
      setCategoryError('Failed to save category.');
    }
  };

  // Edit category
  const handleEditCategory = (cat) => {
    setEditingCategoryId(cat.id);
    setCategoryForm({ name: cat.name, description: cat.description || '' });
  };

  // Delete category
  const handleDeleteCategory = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(id);
        fetchCategoryStats();
      } catch (err) {
        setCategoryError('Failed to delete category.');
      }
    }
  };

  // Fetch dashboard analytics
  const fetchAnalytics = async () => {
    try {
      setAnalyticsError(null); // Reset error state
      const data = await dashboardService.getDashboardAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error("Failed to fetch dashboard analytics:", error);
      setAnalyticsError("Failed to load dashboard analytics. Please try again later.");
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchAnalytics();
    }
  }, [isAdmin]);

  // Admin authentication handlers
  const handleAdminInputChange = (e) => {
    const { id, value } = e.target
    setAdminCredentials(prev => ({ ...prev, [id]: value }))
  }

  const handleAdminSubmit = async (e) => {
    e.preventDefault()
    setAdminError("")
    
    try {
      // For demo purposes, check against hardcoded credentials
      if (adminCredentials.username === "BIZNEST.CREATOR" && adminCredentials.password === "password123") {
        setIsAdmin(true)
        localStorage.setItem("isAdmin", "true")
        setIsAdminModalOpen(false)
        // Refresh data after successful authentication
        fetchAnalytics()
        fetchListings()
      } else {
        setAdminError("Invalid admin credentials. Please try again.")
      }
    } catch (error) {
      setAdminError("Authentication failed. Please try again.")
    }
  }

  let content

  if (!isAdmin) {
    content = (
      <div className="bg-gradient-to-b from-gray-900 to-purple-950 min-h-screen flex items-center justify-center p-4">
        {isAdminModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-xl shadow-lg max-w-md w-full mx-4 border border-purple-500/30">
              <div className="p-6 border-b border-purple-500/30 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white">Admin Authentication Required</h2>
                <button onClick={() => navigate("/home")} className="text-gray-400 hover:text-gray-300">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleAdminSubmit}>
                <div className="p-6 space-y-4">
                  <div className="flex items-center bg-yellow-900/20 text-yellow-400 p-3 rounded-lg mb-4 border border-yellow-500/30">
                    <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
                    <p className="text-sm">
                      This area is restricted to administrators only. Please enter your admin credentials to continue.
                    </p>
                  </div>

                  {adminError && (
                    <div className="bg-red-900/20 text-red-400 p-3 rounded-lg text-sm border border-red-500/30">
                      {adminError}
                    </div>
                  )}

                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
                      Admin Username
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="text"
                        id="username"
                        value={adminCredentials.username}
                        onChange={handleAdminInputChange}
                        className="w-full pl-10 pr-4 py-2 bg-black/30 border border-purple-500/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                      Admin Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="password"
                        id="password"
                        value={adminCredentials.password}
                        onChange={handleAdminInputChange}
                        className="w-full pl-10 pr-4 py-2 bg-black/30 border border-purple-500/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-400">
                      For demo: username = "admin", password = "adminpassword"
                    </p>
                  </div>
                </div>

                <div className="p-6 border-t border-purple-500/30 flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                    onClick={() => navigate("/home")}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                    Authenticate
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    )
  } else {
    content = (
      <div className="bg-background text-foreground min-h-screen w-full">
        <SidebarProvider>
          <div className="flex h-screen w-full">
            <Sidebar className="border-r border-purple-800/30 bg-sidebar">
              <SidebarHeader className="border-b border-purple-800/30 p-4">
                <h2 className="text-xl font-bold text-sidebar-foreground">BizNest Dashboard</h2>
              </SidebarHeader>
              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupLabel className="text-sidebar-foreground/70">Main</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          onClick={() => handleNav("dashboard")}
                          isActive={view === "dashboard"}
                          className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground"
                        >
                          <LayoutDashboard />
                          <span>Dashboard</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          onClick={() => handleNav("listings")}
                          isActive={view === "listings"}
                          className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground"
                        >
                          <ListChecks />
                          <span>Listings</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          onClick={() => handleNav("categories")}
                          isActive={view === "categories"}
                          className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground"
                        >
                          <Store />
                          <span>Categories</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          onClick={() => handleNav("users")}
                          isActive={view === "users"}
                          className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground"
                        >
                          <Users />
                          <span>Users</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>

                <SidebarSeparator className="bg-sidebar-border" />

                <SidebarGroup>
                  <SidebarGroupLabel className="text-sidebar-foreground/70">Analytics</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          onClick={() => handleNav("analytics")}
                          isActive={view === "analytics"}
                          className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground"
                        >
                          <BarChart3 />
                          <span>Analytics</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          onClick={() => handleNav("reviews")}
                          isActive={view === "reviews"}
                          className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground"
                        >
                          <MessageSquare />
                          <span>Reviews</span>
                          {reviews.length > 0 && (
                            <span className="ml-auto bg-primary text-primary-foreground text-xs font-medium px-2 py-0.5 rounded-full">
                              {reviews.length}
                            </span>
                          )}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>

                <SidebarSeparator className="bg-sidebar-border" />

                <SidebarGroup>
                  <SidebarGroupLabel className="text-sidebar-foreground/70">Account</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          onClick={() => navigate("/profile")}
                          className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        >
                          <Settings />
                          <span>Profile Settings</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
              <SidebarFooter className="border-t border-sidebar-border p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-sidebar-foreground/70">Admin Mode</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-sm border-primary text-primary hover:bg-primary/10"
                    onClick={() => navigate("/home")}
                  >
                    Back to Home
                  </Button>
                </div>
              </SidebarFooter>
            </Sidebar>

            <div className="flex-1 w-full overflow-y-auto bg-background">
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <h1 className="text-2xl font-bold text-foreground">
                    {view === "dashboard" && "Dashboard Overview"}
                    {view === "listings" && "Manage Listings"}
                    {view === "categories" && "Categories"}
                    {view === "analytics" && "Analytics"}
                    {view === "reviews" && "Reviews"}
                    {view === "users" && "User Management"}
                  </h1>

                  <div className="flex items-center gap-4">
                    {view === "listings" && (
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                        <input
                          type="text"
                          placeholder="Search listings..."
                          className="pl-10 pr-4 py-2 rounded-lg bg-background border border-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    )}

                    {view === "users" && (
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                        <input
                          type="text"
                          placeholder="Search users..."
                          className="pl-10 pr-4 py-2 rounded-lg bg-background border border-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                          value={userSearchQuery}
                          onChange={(e) => setUserSearchQuery(e.target.value)}
                        />
                      </div>
                    )}

                    {view === "listings" && (
                      <Button onClick={openModal} className="bg-primary hover:bg-primary/90 flex items-center">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Listing
                      </Button>
                    )}

                    {view === "users" && (
                      <Button
                        onClick={() => navigate("/login")}
                        className="bg-primary hover:bg-primary/90 flex items-center"
                      >
                        <UserPlus className="mr-2 h-4 w-4" />
                        Add User
                      </Button>
                    )}
                  </div>
                </div>

                {view === "dashboard" && (
                  <>
                    {analyticsError && (
                      <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg mb-6">
                        {analyticsError}
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                      <MetricCard
                        title="Total Listings"
                        value={analytics.totalListings}
                        icon={<Store className="h-6 w-6 text-purple-400" />}
                      />
                      <MetricCard
                        title="Active Listings"
                        value={analytics.activeListings}
                        icon={<CheckCircle className="h-6 w-6 text-green-400" />}
                      />
                      <MetricCard
                        title="Pending Listings"
                        value={analytics.pendingListings}
                        icon={<AlertTriangle className="h-6 w-6 text-yellow-400"/>}
                        
                      />
                      <MetricCard
                        title="Average Rating"
                        value={(analytics.averageRating || 0).toFixed(1)}
                        icon={<Star className="h-6 w-6 text-yellow-400" />}
                        
                      />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                      <div className="lg:col-span-3 bg-card border border-border rounded-xl p-6 flex items-center justify-center min-h-[350px] min-w-0">
                        <div className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl flex flex-col items-center justify-center">
                          <h2 className="text-lg font-semibold text-card-foreground mb-6 text-center">Category Distribution</h2>
                          <div className="w-full h-auto flex items-center justify-center">
                            <ResponsiveContainer width="100%" aspect={1} minHeight={250} maxHeight={350}>
                              <RPieChart>
                                <Pie
                                  data={pieData}
                                  cx="50%"
                                  cy="50%"
                                  labelLine={false}
                                  outerRadius="80%"
                                  fill="#8884d8"
                                  dataKey="value"
                                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                >
                                  {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                                </Pie>
                                <Tooltip
                                  contentStyle={{
                                    backgroundColor: getChartColors().tooltipBg,
                                    borderColor: getChartColors().tooltipBorder,
                                    color: getChartColors().tooltipText,
                                  }}
                                />
                              </RPieChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="bg-card border border-border rounded-xl p-6">
                        <div className="flex justify-between items-center mb-6">
                          <h2 className="text-lg font-semibold text-card-foreground">Recent Listings</h2>
                          <Button variant="outline" size="sm" className="text-xs" onClick={() => handleNav("listings")}>
                            View All
                          </Button>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-border">
                                <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase">
                                  Name
                                </th>
                                <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase">
                                  Category
                                </th>
                                <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase">
                                  Location
                                </th>
                                <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase">
                                  Status
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {listings.slice(0, 5).map((listing) => (
                                <tr key={listing.id} className="border-b border-border hover:bg-accent/50">
                                  <td className="py-3 px-4 text-foreground">{listing.name}</td>
                                  <td className="py-3 px-4 text-foreground">{listing.category?.name || 'Uncategorized'}</td>
                                  <td className="py-3 px-4 text-foreground">{listing.location}</td>
                                  <td className="py-3 px-4">
                                    <span
                                      className={`px-2 py-1 text-xs rounded-full ${
                                        listing.status === "Approved"
                                          ? "bg-green-500/20 text-green-500"
                                          : listing.status === "Pending"
                                            ? "bg-yellow-500/20 text-yellow-500"
                                            : "bg-red-500/20 text-red-500"
                                      }`}
                                    >
                                      {listing.status}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="bg-card border border-border rounded-xl p-6">
                        <div className="flex justify-between items-center mb-6">
                          <h2 className="text-lg font-semibold text-card-foreground">Recent Reviews</h2>
                          <Button variant="outline" size="sm" className="text-xs" onClick={() => handleNav("reviews")}>
                            View All
                          </Button>
                        </div>
                        <div className="space-y-4">
                          {reviews.slice(0, 3).map((review) => (
                            <div key={review.id} className="border border-border rounded-lg p-4">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h3 className="font-medium text-card-foreground">{review.userName}</h3>
                                  <p className="text-sm text-muted-foreground">{review.listingName}</p>
                                </div>
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="text-sm text-card-foreground mb-2">{review.text}</p>
                              <p className="text-xs text-muted-foreground">{formatDate(review.date)}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {view === "listings" && (
                  <div className="space-y-6">
                    {loading ? (
                      <div className="flex items-center justify-center p-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                        <span className="ml-3 text-muted-foreground">Loading listings...</span>
                      </div>
                    ) : error ? (
                      <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg">
                        {error}
                      </div>
                    ) : (
                      <>
                        <div className="bg-card border border-border rounded-xl overflow-hidden">
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead>
                                <tr className="bg-accent/50">
                                  <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase">
                                    Name
                                  </th>
                                  <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase">
                                    Category
                                  </th>
                                  <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase">
                                    Location
                                  </th>
                                  <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase">
                                    Status
                                  </th>
                                  <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase">
                                    Rating
                                  </th>
                                  <th className="text-right py-3 px-4 text-muted-foreground font-medium text-xs uppercase">
                                    Actions
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {filteredListings.map((listing) => (
                                  <tr key={listing.id} className="border-t border-border hover:bg-accent/50">
                                    <td className="py-3 px-4 text-foreground">{listing.name}</td>
                                    <td className="py-3 px-4 text-foreground">{listing.category?.name || 'Uncategorized'}</td>
                                    <td className="py-3 px-4 text-foreground">{listing.location}</td>
                                    <td className="py-3 px-4">
                                      <span
                                        className={`px-2 py-1 text-xs rounded-full ${
                                          listing.status === "Approved"
                                            ? "bg-green-500/20 text-green-500"
                                            : listing.status === "Pending"
                                              ? "bg-yellow-500/20 text-yellow-500"
                                              : "bg-red-500/20 text-red-500"
                                        }`}
                                      >
                                        {listing.status}
                                      </span>
                                    </td>
                                    <td className="py-3 px-4">
                                      <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                          <Star
                                            key={i}
                                            className={`h-4 w-4 ${
                                              i < Math.floor(getAverageRatingByListing(listing.id) || 4.5)
                                                ? "text-yellow-400 fill-yellow-400"
                                                : "text-gray-300"
                                            }`}
                                          />
                                        ))}
                                        <span className="ml-2 text-sm text-muted-foreground">{getAverageRatingByListing(listing.id) || 4.5}</span>
                                      </div>
                                    </td>
                                    <td className="py-3 px-4 text-right">
                                      <div className="flex justify-end space-x-2">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="h-8 w-8 p-0"
                                          onClick={() => handleEdit(listing.id)}
                                        >
                                          <Edit className="h-4 w-4" />
                                          <span className="sr-only">Edit</span>
                                        </Button>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="h-8 w-8 p-0 border-red-500 text-red-500 hover:bg-red-500/10"
                                          onClick={() => handleDelete(listing.id)}
                                        >
                                          <Trash className="h-4 w-4" />
                                          <span className="sr-only">Delete</span>
                                        </Button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                        {totalPages > 1 && (
                          <div className="flex justify-center items-center my-4 space-x-2">
                            <Button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0}>
                              Previous
                            </Button>
                            <span className="text-sm text-muted-foreground">
                              Page {page + 1} of {totalPages}
                            </span>
                            <Button onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page === totalPages - 1}>
                              Next
                            </Button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}

                {view === "categories" && (
                  <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                    <div className="bg-card border border-border rounded-xl p-6">
                      <h2 className="text-lg font-semibold text-card-foreground mb-6">Categories</h2>
                      <form onSubmit={handleCategorySubmit} className="mb-6 space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Category Name"
                            value={categoryForm.name}
                            onChange={e => setCategoryForm(f => ({ ...f, name: e.target.value }))}
                            className="px-3 py-2 rounded-md border border-input bg-background text-foreground flex-1"
                            required
                          />
                          <input
                            type="text"
                            placeholder="Description (optional)"
                            value={categoryForm.description}
                            onChange={e => setCategoryForm(f => ({ ...f, description: e.target.value }))}
                            className="px-3 py-2 rounded-md border border-input bg-background text-foreground flex-1"
                          />
                          <Button type="submit" className="min-w-[100px]">
                            {editingCategoryId ? 'Update' : 'Add'}
                          </Button>
                          {editingCategoryId && (
                            <Button type="button" variant="outline" onClick={() => { setEditingCategoryId(null); setCategoryForm({ name: '', description: '' }); }}>
                              Cancel
                            </Button>
                          )}
                        </div>
                        {categoryError && <div className="text-red-500 text-sm mt-1">{categoryError}</div>}
                      </form>
                      <div className="space-y-4 mb-8">
                        {categories.length === 0 ? (
                          <div className="text-muted-foreground">No categories found.</div>
                        ) : categories.map((category) => (
                          <div key={category.id} className="flex flex-col">
                            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                              <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                                  <Store className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                  <h3 className="font-medium text-card-foreground">{category.name}</h3>
                                  <p className="text-sm text-muted-foreground">{categoryStats[category.name] || 0} listings</p>
                                  {category.description && <p className="text-xs text-muted-foreground mt-1">{category.description}</p>}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-xs"
                                  onClick={() => handleToggleCategoryListings(category.id)}
                                >
                                  {expandedCategoryId === category.id ? "Hide Listings" : "View Listings"}
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-xs"
                                  onClick={() => handleEditCategory(category)}
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-xs text-red-500 border-red-500 hover:bg-red-500/10"
                                  onClick={() => handleDeleteCategory(category.id)}
                                >
                                  Delete
                                </Button>
                              </div>
                            </div>
                            {/* Dropdown for listings */}
                            {expandedCategoryId === category.id && (
                              <div className="w-full mt-2 mb-4 bg-accent/30 rounded-lg p-4 border border-border">
                                {categoryLoading[category.id] ? (
                                  <div className="flex items-center justify-center p-4">
                                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
                                    <span className="ml-3 text-muted-foreground">Loading listings...</span>
                                  </div>
                                ) : (categoryListings[category.id] && categoryListings[category.id].length === 0 ? (
                                  <div className="text-muted-foreground">No listings in this category.</div>
                                ) : (
                                  <table className="w-full">
                                    <thead>
                                      <tr>
                                        <th className="text-left py-2 px-2 text-xs text-muted-foreground">Name</th>
                                        <th className="text-left py-2 px-2 text-xs text-muted-foreground">Location</th>
                                        <th className="text-left py-2 px-2 text-xs text-muted-foreground">Status</th>
                                        <th className="text-left py-2 px-2 text-xs text-muted-foreground">Rating</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {categoryListings[category.id] && categoryListings[category.id].map(listing => (
                                        <tr key={listing.id}>
                                          <td className="py-2 px-2">{listing.name}</td>
                                          <td className="py-2 px-2">{listing.location}</td>
                                          <td className="py-2 px-2">{listing.status}</td>
                                          <td className="py-2 px-2">{listing.rating}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-card-foreground mb-6">Category Distribution</h2>
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={categoryChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke={getChartColors().gridColor} />
                              <XAxis dataKey="name" tick={{ fill: getChartColors().textColor }} axisLine={{ stroke: getChartColors().gridColor }} />
                              <YAxis tick={{ fill: getChartColors().textColor }} axisLine={{ stroke: getChartColors().gridColor }} />
                              <Tooltip contentStyle={{ backgroundColor: getChartColors().tooltipBg, borderColor: getChartColors().tooltipBorder, color: getChartColors().tooltipText }} />
                              <Legend />
                              <Bar dataKey="count" fill={getChartColors().barColor} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {view === "analytics" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <MetricCard
                        title="Total Listings"
                        value={analytics.totalListings}
                        icon={<Store className="h-6 w-6 text-purple-400" />}
                        
                      />
                      <MetricCard
                        title="Total Users"
                        value={analytics.totalUsers}
                        icon={<Users className="h-6 w-6 text-blue-400" />}
                        
                      />
                      <MetricCard
                        title="Total Reviews"
                        value={reviews.length}
                        icon={<MessageSquare className="h-6 w-6 text-green-400" />}
                        
                      />
                      <MetricCard
                        title="Average Rating"
                        value={(analytics.averageRating || 0).toFixed(1)}
                        icon={<Star className="h-6 w-6 text-yellow-400" />}
                        
                      />
                    </div>
                    
                    <div className="flex justify-center items-center">
                      <div className="bg-card border border-border rounded-xl p-8 flex items-center justify-center min-h-[500px] w-full max-w-4xl">
                        <div className="w-full flex flex-col items-center justify-center">
                          <h2 className="text-xl font-semibold text-card-foreground mb-8 text-center">Category Distribution</h2>
                          <div className="w-full h-auto flex items-center justify-center">
                            <ResponsiveContainer width="100%" aspect={1} minHeight={400} maxHeight={500}>
                              <RPieChart>
                                <Pie
                                  data={pieData}
                                  cx="50%"
                                  cy="50%"
                                  labelLine={false}
                                  outerRadius="85%"
                                  fill="#8884d8"
                                  dataKey="value"
                                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                >
                                  {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                                </Pie>
                                <Tooltip
                                  contentStyle={{
                                    backgroundColor: getChartColors().tooltipBg,
                                    borderColor: getChartColors().tooltipBorder,
                                    color: getChartColors().tooltipText,
                                  }}
                                />
                              </RPieChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-card border border-border rounded-xl p-6">
                      <h2 className="text-lg font-semibold text-card-foreground mb-6">Performance Metrics</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="border border-border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-medium text-card-foreground">User Growth</h3>
                            <TrendingUp className="h-5 w-5 text-green-500" />
                          </div>
                          <p className="text-3xl font-bold text-card-foreground mb-2">+24%</p>
                          <p className="text-sm text-muted-foreground">Compared to last quarter</p>
                        </div>

                        <div className="border border-border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-medium text-card-foreground">Listing Growth</h3>
                            <TrendingUp className="h-5 w-5 text-green-500" />
                          </div>
                          <p className="text-3xl font-bold text-card-foreground mb-2">+18%</p>
                          <p className="text-sm text-muted-foreground">Compared to last quarter</p>
                        </div>

                        <div className="border border-border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-medium text-card-foreground">Review Growth</h3>
                            <TrendingUp className="h-5 w-5 text-green-500" />
                          </div>
                          <p className="text-3xl font-bold text-card-foreground mb-2">+32%</p>
                          <p className="text-sm text-muted-foreground">Compared to last quarter</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {view === "reviews" && (
                  <div className="space-y-6">
                    <div className="bg-card border border-border rounded-xl p-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                        <h2 className="text-lg font-semibold text-card-foreground mb-4 sm:mb-0">All Reviews</h2>
                        <div className="flex flex-wrap gap-2">
                          <div className="relative">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center"
                              onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                            >
                              <Filter className="h-4 w-4 mr-2" />
                              Filter
                              <ChevronDown className="h-4 w-4 ml-2" />
                            </Button>
                            {isFilterMenuOpen && (
                              <div className="absolute right-0 mt-2 w-64 bg-card border border-border rounded-lg shadow-lg z-10 p-4">
                                <div className="space-y-4">
                                  <div>
                                    <label className="block text-sm font-medium text-card-foreground mb-1">
                                      Business
                                    </label>
                                    <select
                                      className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
                                      value={reviewFilter}
                                      onChange={(e) => setReviewFilter(e.target.value)}
                                    >
                                      <option value="all">All Businesses</option>
                                      {reviewListings.map((business) => (
                                        <option key={business} value={business}>
                                          {business}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-card-foreground mb-1">
                                      Rating
                                    </label>
                                    <select
                                      className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
                                      value={ratingFilter}
                                      onChange={(e) => setRatingFilter(e.target.value)}
                                    >
                                      <option value="all">All Ratings</option>
                                      <option value="5">5 Stars</option>
                                      <option value="4">4 Stars</option>
                                      <option value="3">3 Stars</option>
                                      <option value="2">2 Stars</option>
                                      <option value="1">1 Star</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-card-foreground mb-1">Date</label>
                                    <select
                                      className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
                                      value={dateFilter}
                                      onChange={(e) => setDateFilter(e.target.value)}
                                    >
                                      <option value="all">All Time</option>
                                      <option value="today">Today</option>
                                      <option value="week">This Week</option>
                                      <option value="month">This Month</option>
                                    </select>
                                  </div>
                                  <div className="pt-2 flex justify-end">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-xs"
                                      onClick={() => {
                                        setReviewFilter("all")
                                        setRatingFilter("all")
                                        setDateFilter("all")
                                      }}
                                    >
                                      Reset Filters
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        {filteredReviews.length === 0 ? (
                          <div className="text-center py-8">
                            <p className="text-muted-foreground">No reviews match your filters.</p>
                          </div>
                        ) : (
                          filteredReviews.map((review) => (
                            <div key={review.id} className="border border-border rounded-lg p-4">
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <div className="flex items-center mb-1">
                                    <h3 className="font-medium text-card-foreground">{review.userName}</h3>
                                    <span className="mx-2 text-muted-foreground">•</span>
                                    <p className="text-sm text-muted-foreground">{formatDate(review.date)}</p>
                                  </div>
                                  <p className="text-sm text-primary mb-1">{review.listingName}</p>
                                  <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`h-4 w-4 ${
                                          i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <p className="text-sm text-card-foreground">{review.comment}</p>
                                </div>
                                <div className="flex space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    onClick={() => openResponseModal(review.id)}
                                  >
                                    <MessageSquare className="h-4 w-4" />
                                    <span className="sr-only">Respond</span>
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 w-8 p-0 border-red-500 text-red-500 hover:bg-red-500/10"
                                    onClick={() => handleDeleteReview(review.id)}
                                  >
                                    <Trash className="h-4 w-4" />
                                    <span className="sr-only">Delete</span>
                                  </Button>
                                </div>
                              </div>
                              <p className="text-card-foreground mb-4">{review.text}</p>
                              {review.response && (
                                <div className="bg-accent/50 rounded-lg p-3 mt-2">
                                  <div className="flex items-center mb-1">
                                    <h4 className="text-sm font-medium text-card-foreground">Business Response</h4>
                                    <span className="mx-2 text-muted-foreground">•</span>
                                    <p className="text-xs text-muted-foreground">
                                      {formatDate(review.responseDate || new Date())}
                                    </p>
                                  </div>
                                  <p className="text-sm text-card-foreground">{review.response}</p>
                                </div>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {view === "users" && (
                  <div className="space-y-6">
                    {userError && (
                      <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg">
                        {userError}
                      </div>
                    )}

                    <div className="bg-card border border-border rounded-xl overflow-hidden">
                      {isLoadingUsers ? (
                        <div className="flex items-center justify-center p-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                          <span className="ml-3 text-muted-foreground">Loading users...</span>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="bg-accent/50">
                                <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase">
                                  Username
                                </th>
                                <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase">
                                  Display Name
                                </th>
                                <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase">
                                  Email
                                </th>
                                <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase">
                                  Role
                                </th>
                                <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs uppercase">
                                  Created
                                </th>
                                <th className="text-right py-3 px-4 text-muted-foreground font-medium text-xs uppercase">
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredUsers.map((user) => (
                                <tr key={user.id} className="border-t border-border hover:bg-accent/50">
                                  <td className="py-3 px-4 text-foreground">{user.username}</td>
                                  <td className="py-3 px-4 text-foreground">{user.displayName || "-"}</td>
                                  <td className="py-3 px-4 text-foreground">{user.email}</td>
                                  <td className="py-3 px-4">
                                    {user.roles && user.roles.includes("ROLE_ADMIN") ? (
                                      <span className="px-2 py-1 text-xs rounded-full bg-purple-500/20 text-purple-500">
                                        Admin
                                      </span>
                                    ) : (
                                      <span className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-500">
                                        User
                                      </span>
                                    )}
                                  </td>
                                  <td className="py-3 px-4 text-foreground">
                                    {user.createdAt ? formatDate(user.createdAt) : "-"}
                                  </td>
                                  <td className="py-3 px-4 text-right">
                                    <div className="flex justify-end space-x-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 w-8 p-0"
                                        onClick={() => handleViewUser(user)}
                                      >
                                        <Users className="h-4 w-4" />
                                        <span className="sr-only">View</span>
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 w-8 p-0"
                                        onClick={() => handleEditUserRoles(user)}
                                      >
                                        <Shield className="h-4 w-4" />
                                        <span className="sr-only">Edit Roles</span>
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 w-8 p-0 border-red-500 text-red-500 hover:bg-red-500/10"
                                        onClick={() => handleDeleteUser(user.username)}
                                        disabled={user.roles && user.roles.includes("ROLE_ADMIN")}
                                      >
                                        <Trash className="h-4 w-4" />
                                        <span className="sr-only">Delete</span>
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </SidebarProvider>

        {/* Add/Edit Listing Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card rounded-xl shadow-lg max-w-2xl w-full mx-4">
              <div className="p-6 border-b border-border flex justify-between items-center"></div>
              <div className="max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-border flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-card-foreground">
                    {isEditMode ? "Edit Listing" : "Add New Listing"}
                  </h2>
                  <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-muted-foreground mb-1">
                          Business Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-2 bg-background border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="category" className="block text-sm font-medium text-muted-foreground mb-1">
                          Category
                        </label>
                        <select
                          id="category"
                          value={formData.category}
                          onChange={handleChange}
                          className="w-full px-4 py-2 bg-background border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                          required
                        >
                          <option value="">Select a category</option>
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="location" className="block text-sm font-medium text-muted-foreground mb-1">
                          Location
                        </label>
                        <input
                          type="text"
                          id="location"
                          value={formData.location}
                          onChange={handleChange}
                          className="w-full px-4 py-2 bg-background border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="status" className="block text-sm font-medium text-muted-foreground mb-1">
                          Status
                        </label>
                        <select
                          id="status"
                          value={formData.status}
                          onChange={handleChange}
                          className="w-full px-4 py-2 bg-background border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        >
                          <option value="Approved">Approved</option>
                          <option value="Pending">Pending</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="desc" className="block text-sm font-medium text-muted-foreground mb-1">
                        Description
                      </label>
                      <textarea
                        id="desc"
                        value={formData.desc}
                        onChange={handleChange}
                        rows="3"
                        className="w-full px-4 py-2 bg-background border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      ></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="address" className="block text-sm font-medium text-muted-foreground mb-1">
                          Address
                        </label>
                        <input
                          type="text"
                          id="address"
                          value={formData.address}
                          onChange={handleChange}
                          className="w-full px-4 py-2 bg-background border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-muted-foreground mb-1">
                          Phone
                        </label>
                        <input
                          type="text"
                          id="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-2 bg-background border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="hours" className="block text-sm font-medium text-muted-foreground mb-1">
                          Business Hours
                        </label>
                        <input
                          type="text"
                          id="hours"
                          value={formData.hours}
                          onChange={handleChange}
                          className="w-full px-4 py-2 bg-background border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                          placeholder="e.g. 9:00 AM - 5:00 PM"
                        />
                      </div>
                      <div>
                        <label htmlFor="rating" className="block text-sm font-medium text-muted-foreground mb-1">
                          Rating
                        </label>
                        <input
                          type="number"
                          id="rating"
                          value={formData.rating}
                          onChange={handleChange}
                          min="1"
                          max="5"
                          step="0.1"
                          className="w-full px-4 py-2 bg-background border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="imageFile" className="block text-sm font-medium text-muted-foreground mb-1">
                        Listing Image
                      </label>
                      <input
                        type="file"
                        id="imageFile"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="w-full px-4 py-2 bg-background border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                      {imagePreviewUrl && (
                        <img src={imagePreviewUrl} alt="Preview" className="mt-2 h-32 w-32 object-cover rounded-md border" />
                      )}
                      <p className="mt-1 text-xs text-muted-foreground">
                        Upload a new image or leave empty to keep the current/default image.
                      </p>
                    </div>
                  </div>

                  <div className="p-6 border-t border-border flex justify-end space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsModalOpen(false)}
                      className="border-border text-foreground hover:bg-accent"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-primary hover:bg-primary/90">
                      {isEditMode ? "Update Listing" : "Add Listing"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Response Modal */}
        {isResponseModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card rounded-xl shadow-lg max-w-md w-full mx-4">
              <div className="p-6 border-b border-border flex justify-between items-center">
                <h2 className="text-xl font-semibold text-card-foreground">Respond to Review</h2>
                <button onClick={closeResponseModal} className="text-muted-foreground hover:text-foreground">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleResponseSubmit}>
                <div className="p-6 space-y-4">
                  <div>
                    <label htmlFor="response" className="block text-sm font-medium text-muted-foreground mb-1">
                      Your Response
                    </label>
                    <textarea
                      id="response"
                      value={responseForm.text}
                      onChange={handleResponseChange}
                      rows="4"
                      className="w-full px-4 py-2 bg-background border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      required
                      placeholder="Type your response to this review..."
                    ></textarea>
                  </div>
                </div>

                <div className="p-6 border-t border-border flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={closeResponseModal}
                    className="border-border text-foreground hover:bg-accent"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-primary hover:bg-primary/90">
                    Submit Response
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View User Modal */}
        {isUserModalOpen && selectedUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card rounded-xl shadow-lg max-w-md w-full mx-4">
              <div className="p-6 border-b border-border flex justify-between items-center">
                <h2 className="text-xl font-semibold text-card-foreground">User Details</h2>
                <button
                  onClick={() => setIsUserModalOpen(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6">
                <div className="flex justify-center mb-6">
                  <div className="h-24 w-24 rounded-full bg-accent flex items-center justify-center">
                    <img
                      src={selectedUser.profilePicture || "/images/defaultUserPicture.png"}
                      alt={selectedUser.username}
                      className="h-24 w-24 rounded-full object-cover"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Username</p>
                    <p className="font-medium text-card-foreground">{selectedUser.username}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Display Name</p>
                    <p className="font-medium text-card-foreground">{selectedUser.displayName || "-"}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium text-card-foreground">{selectedUser.email}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Role</p>
                    <div className="flex items-center mt-1">
                      {selectedUser.roles && selectedUser.roles.includes("ROLE_ADMIN") ? (
                        <span className="px-2 py-1 text-xs rounded-full bg-purple-500/20 text-purple-500">Admin</span>
                      ) : (
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-500">User</span>
                      )}
                    </div>
                  </div>

                  {selectedUser.location && (
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-medium text-card-foreground">{selectedUser.location}</p>
                    </div>
                  )}

                  {selectedUser.bio && (
                    <div>
                      <p className="text-sm text-muted-foreground">Bio</p>
                      <p className="font-medium text-card-foreground">{selectedUser.bio}</p>
                    </div>
                  )}

                  {selectedUser.website && (
                    <div>
                      <p className="text-sm text-muted-foreground">Website</p>
                      <a
                        href={selectedUser.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-primary hover:underline"
                      >
                        {selectedUser.website}
                      </a>
                    </div>
                  )}

                  {selectedUser.createdAt && (
                    <div>
                      <p className="text-sm text-muted-foreground">Member Since</p>
                      <p className="font-medium text-card-foreground">{formatDate(selectedUser.createdAt)}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 border-t border-border flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setIsUserModalOpen(false)}
                  className="border-border text-foreground hover:bg-accent"
                >
                  Close
                </Button>
                <Button
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => {
                    setIsUserModalOpen(false)
                    handleEditUserRoles(selectedUser)
                  }}
                >
                  Edit Roles
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Edit User Roles Modal */}
        {isRoleModalOpen && selectedUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card rounded-xl shadow-lg max-w-md w-full mx-4">
              <div className="p-6 border-b border-border flex justify-between items-center">
                <h2 className="text-xl font-semibold text-card-foreground">Edit User Roles</h2>
                <button
                  onClick={() => setIsRoleModalOpen(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateRoles}>
                <div className="p-6 space-y-4">
                  <div className="flex items-center mb-2">
                    <p className="font-medium text-card-foreground">User: {selectedUser.username}</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isAdmin"
                        name="isAdmin"
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        defaultChecked={selectedUser.roles && selectedUser.roles.includes("ROLE_ADMIN")}
                      />
                      <label htmlFor="isAdmin" className="ml-2 block text-sm text-card-foreground">
                        Administrator Role
                      </label>
                    </div>

                    <div className="bg-accent/50 rounded-lg p-4 mt-4">
                      <div className="flex items-center mb-2">
                        <Shield className="h-5 w-5 text-yellow-500 mr-2" />
                        <h3 className="font-medium text-card-foreground">Role Permissions</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Administrators have the following additional permissions:
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-6 list-disc">
                        <li>Manage all users (view, edit roles, delete)</li>
                        <li>Access to all dashboard features</li>
                        <li>Manage business listings and reviews</li>
                        <li>View analytics and reports</li>
                        <li>System configuration</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t border-border flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsRoleModalOpen(false)}
                    className="border-border text-foreground hover:bg-accent"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-primary hover:bg-primary/90">
                    Update Roles
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    )
  }

  return content
}

// Metric Card Component
const MetricCard = ({ title, value, icon, trend }) => {
    return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-muted-foreground text-sm">{title}</p>
          <p className="text-3xl font-bold text-card-foreground mt-2">{value}</p>
          {trend && <p className="text-xs text-green-500 mt-1">{trend}</p>}
        </div>
        <div className="bg-primary/10 p-3 rounded-lg">{icon}</div>
      </div>
    </div>
  )
}

// Add handler for file input


export default Dashboard

"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
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
  PieChart,
  TrendingUp,
  Calendar,
  Filter,
  ChevronDown,
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

const Dashboard = () => {
  const navigate = useNavigate()
  const { listings, metrics, addListing, updateListing, deleteListing, getCategoryCounts } = useListings()
  const { reviews, addResponse, deleteReview } = useReviews()

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
  })
  const [isEditMode, setIsEditMode] = useState(false)
  const [editId, setEditId] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [responseForm, setResponseForm] = useState({ reviewId: null, text: "" })
  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false)

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

  // Add this useEffect to populate review listings
  useEffect(() => {
    // Get unique business names from listings
    const uniqueBusinesses = [...new Set(reviews.map((review) => review.listingName))]
    setReviewListings(uniqueBusinesses)
  }, [reviews])

  const handleNav = (section) => setView(section)

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Prepare complete listing data
    const listingData = {
      ...formData,
      // Set default values for any missing fields
      address: formData.address || `${formData.location} Address`,
      phone: formData.phone || "+1 (555) 123-4567",
      hours: formData.hours || "9:00 AM - 5:00 PM",
    }

    if (isEditMode) {
      updateListing(editId, listingData)
    } else {
      addListing(listingData)
    }

    // Reset form
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
    })
    setIsEditMode(false)
    setEditId(null)
    setIsModalOpen(false)
  }

  const handleEdit = (id) => {
    const listing = listings.find((l) => l.id === id)
    setFormData({
      name: listing.name,
      category: listing.category,
      location: listing.location,
      status: listing.status,
      desc: listing.desc || "",
      rating: listing.rating || 4.5,
      address: listing.address || "",
      phone: listing.phone || "",
      hours: listing.hours || "",
      image: listing.image || "/images/restaurant-image.webp",
    })
    setIsEditMode(true)
    setEditId(id)
    setIsModalOpen(true)
  }

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      deleteListing(id)
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
      image: "/images/restaurant-image.webp",
    })
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
  }

  const handleResponseChange = (e) => {
    setResponseForm((prev) => ({ ...prev, text: e.target.value }))
  }

  const handleDeleteReview = (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      deleteReview(reviewId)
    }
  }

  const filteredListings = listings.filter(
    (listing) =>
      listing.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.location.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Filter reviews based on selected filters
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
          // Check if the review is from today
          return reviewDate.toDateString() === now.toDateString()
        case "week":
          // Check if the review is from the last 7 days
          const weekAgo = new Date(now.setDate(now.getDate() - 7))
          return reviewDate >= weekAgo
        case "month":
          // Check if the review is from the last 30 days
          const monthAgo = new Date(now.setDate(now.getDate() - 30))
          return reviewDate >= monthAgo
        default:
          return true
      }
    }

    return true
  })

  // Admin authentication
  const handleAdminInputChange = (e) => {
    const { id, value } = e.target
    setAdminCredentials((prev) => ({ ...prev, [id]: value }))
  }

  const handleAdminSubmit = (e) => {
    e.preventDefault()
    setAdminError("")

    // Check admin credentials (hardcoded for demo)
    if (adminCredentials.username === "admin" && adminCredentials.password === "adminpassword") {
      setIsAdmin(true)
      localStorage.setItem("isAdmin", "true")
      setIsAdminModalOpen(false)
    } else {
      setAdminError("Invalid admin credentials")
    }
  }

  // Get category counts for the categories view and charts
  const categoryCounts = getCategoryCounts()
  const categories = Object.keys(categoryCounts)

  // Prepare data for charts
  const categoryChartData = categories.map((category) => ({
    name: category,
    count: categoryCounts[category],
  }))

  const COLORS = ["#8b5cf6", "#6366f1", "#ec4899", "#f43f5e", "#10b981", "#14b8a6", "#f59e0b", "#6b7280"]

  const pieData = categories.map((category) => ({
    name: category,
    value: categoryCounts[category],
  }))

  // Monthly growth data (mock data for demo)
  const monthlyData = [
    { name: "Jan", listings: 12 },
    { name: "Feb", listings: 19 },
    { name: "Mar", listings: 25 },
    { name: "Apr", listings: 32 },
    { name: "May", listings: 40 },
    { name: "Jun", listings: 45 },
    { name: "Jul", listings: 52 },
    { name: "Aug", listings: 58 },
    { name: "Sep", listings: 65 },
    { name: "Oct", listings: 70 },
    { name: "Nov", listings: 78 },
    { name: "Dec", listings: metrics.total },
  ]

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
                    <Button onClick={openModal} className="bg-primary hover:bg-primary/90 flex items-center">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Listing
                    </Button>
                  </div>
                </div>

                {view === "dashboard" && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                      <MetricCard
                        title="Total Listings"
                        value={metrics.total}
                        icon={<Store className="h-6 w-6 text-purple-400" />}
                        trend="+5% from last month"
                      />
                      <MetricCard
                        title="New Listings"
                        value={metrics.new}
                        icon={<Plus className="h-6 w-6 text-green-400" />}
                        trend="+2 this week"
                      />
                      <MetricCard
                        title="Active Users"
                        value={metrics.active}
                        icon={<Users className="h-6 w-6 text-blue-400" />}
                        trend="+12% from last month"
                      />
                      <MetricCard
                        title="Reviews"
                        value={reviews.length}
                        icon={<MessageSquare className="h-6 w-6 text-amber-400" />}
                        trend="Growing engagement"
                      />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                      <div className="lg:col-span-2 bg-card rounded-xl shadow-sm border border-border p-6">
                        <h2 className="text-lg font-semibold mb-4 text-white">Category-wise Listings</h2>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={categoryChartData}>
                              <CartesianGrid strokeDasharray="3 3" stroke={getChartColors().gridColor} />
                              <XAxis dataKey="name" stroke={getChartColors().textColor} />
                              <YAxis stroke={getChartColors().textColor} />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: getChartColors().tooltipBg,
                                  borderColor: getChartColors().tooltipBorder,
                                }}
                                labelStyle={{ color: getChartColors().tooltipText }}
                              />
                              <Legend />
                              <Bar dataKey="count" fill={getChartColors().barColor} name="Listings" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                        <h2 className="text-lg font-semibold mb-4 text-white">Listing Distribution</h2>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <RPieChart>
                              <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              >
                                {pieData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip
                                contentStyle={{ backgroundColor: "#333", borderColor: "#555" }}
                                labelStyle={{ color: "#fff" }}
                              />
                            </RPieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>

                    <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                      <div className="p-6 border-b border-border">
                        <h2 className="text-lg font-semibold text-card-foreground">Recent Listings</h2>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full dashboard-table">
                          <thead>
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                Business Name
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                Category
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                Location
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {listings.slice(-3).map((listing) => (
                              <tr key={listing.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-card-foreground">
                                  {listing.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-card-foreground">
                                  {listing.category}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-card-foreground">
                                  {listing.location}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span
                                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                      listing.status === "Approved" ? "status-approved" : "status-pending"
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
                  </>
                )}

                {view === "listings" && (
                  <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                    <div className="p-6 border-b border-border">
                      <h2 className="text-lg font-semibold text-card-foreground">All Listings</h2>
                    </div>
                    {filteredListings.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full dashboard-table">
                          <thead>
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                Business Name
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                Category
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                Location
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                Status
                              </th>
                              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {filteredListings.map((listing) => (
                              <tr key={listing.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-card-foreground">
                                  {listing.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-card-foreground">
                                  {listing.category}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-card-foreground">
                                  {listing.location}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span
                                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                      listing.status === "Approved" ? "status-approved" : "status-pending"
                                    }`}
                                  >
                                    {listing.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEdit(listing.id)}
                                    className="text-primary hover:text-primary/80 hover:bg-primary/10 mr-2"
                                  >
                                    <Edit className="h-4 w-4" />
                                    <span className="sr-only">Edit</span>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDelete(listing.id)}
                                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                  >
                                    <Trash className="h-4 w-4" />
                                    <span className="sr-only">Delete</span>
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="p-6 text-center text-muted-foreground">
                        No listings found matching your search criteria.
                      </div>
                    )}
                  </div>
                )}

                {view === "categories" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category) => (
                      <div
                        key={category}
                        className="bg-white/5 rounded-xl shadow-sm border border-purple-500/20 p-6 text-center"
                      >
                        <div className="mb-4">
                          <Store className="h-12 w-12 mx-auto text-purple-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">{category}</h3>
                        <p className="text-3xl font-bold text-purple-400 mb-1">{categoryCounts[category]}</p>
                        <p className="text-sm text-gray-400">
                          {categoryCounts[category] === 1 ? "Listing" : "Listings"}
                        </p>
                      </div>
                    ))}
                    <div className="category-box bg-black/20 rounded-xl border border-dashed border-purple-500/30 p-6 flex flex-col items-center justify-center">
                      <Plus className="h-12 w-12 text-gray-500 mb-4" />
                      <p className="text-muted-foreground mb-4">Add New Category</p>
                      <Button variant="outline" className="border-purple-500 text-primary hover:bg-primary/10">
                        Create Category
                      </Button>
                    </div>
                  </div>
                )}

                {view === "analytics" && (
                  <>
                    <div className="bg-card rounded-xl shadow-sm border border-border p-6 mb-8">
                      <h2 className="text-lg font-semibold mb-6 text-white">Listings Growth Over Time</h2>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke={getChartColors().gridColor} />
                            <XAxis dataKey="name" stroke={getChartColors().textColor} />
                            <YAxis stroke={getChartColors().textColor} />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: getChartColors().tooltipBg,
                                borderColor: getChartColors().tooltipBorder,
                              }}
                              labelStyle={{ color: getChartColors().tooltipText }}
                            />
                            <Legend />
                            <Line
                              type="monotone"
                              dataKey="listings"
                              stroke={getChartColors().lineColor}
                              strokeWidth={2}
                              activeDot={{ r: 8 }}
                              name="Total Listings"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                      <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                        <div className="flex items-center justify-between mb-6">
                          <h2 className="text-lg font-semibold text-white">Category Distribution</h2>
                          <div className="flex items-center space-x-2">
                            <PieChart className="h-5 w-5 text-purple-400" />
                            <span className="text-sm text-gray-300">Pie Chart</span>
                          </div>
                        </div>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <RPieChart>
                              <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              >
                                {pieData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip
                                contentStyle={{ backgroundColor: "#333", borderColor: "#555" }}
                                labelStyle={{ color: "#fff" }}
                              />
                            </RPieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                        <div className="flex items-center justify-between mb-6">
                          <h2 className="text-lg font-semibold text-white">User Activity</h2>
                          <div className="flex items-center space-x-2">
                            <TrendingUp className="h-5 w-5 text-green-400" />
                            <span className="text-sm text-gray-300">Growing</span>
                          </div>
                        </div>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={[
                                { name: "Mon", visits: 120 },
                                { name: "Tue", visits: 150 },
                                { name: "Wed", visits: 180 },
                                { name: "Thu", visits: 210 },
                                { name: "Fri", visits: 250 },
                                { name: "Sat", visits: 300 },
                                { name: "Sun", visits: 280 },
                              ]}
                            >
                              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                              <XAxis dataKey="name" stroke="#aaa" />
                              <YAxis stroke="#aaa" />
                              <Tooltip
                                contentStyle={{ backgroundColor: "#333", borderColor: "#555" }}
                                labelStyle={{ color: "#fff" }}
                              />
                              <Legend />
                              <Bar dataKey="visits" fill="#10b981" name="User Visits" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>

                    <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                      <h2 className="text-lg font-semibold mb-4 text-white dark:text-white light:text-foreground">
                        Performance Metrics
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="analytics-box bg-black/20 rounded-lg p-4 border border-purple-500/20">
                          <h3 className="text-sm font-medium text-gray-300 mb-2">Average Rating</h3>
                          <div className="flex items-center">
                            <Star className="h-5 w-5 text-yellow-400 mr-2" />
                            <span className="text-2xl font-bold text-card-foreground">4.7</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">+0.2 from last month</p>
                        </div>
                        <div className="analytics-box bg-black/20 rounded-lg p-4 border border-purple-500/20">
                          <h3 className="text-sm font-medium text-gray-300 mb-2">Conversion Rate</h3>
                          <div className="flex items-center">
                            <TrendingUp className="h-5 w-5 text-green-400 mr-2" />
                            <span className="text-2xl font-bold text-card-foreground">12.8%</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">+2.3% from last month</p>
                        </div>
                        <div className="analytics-box bg-black/20 rounded-lg p-4 border border-purple-500/20">
                          <h3 className="text-sm font-medium text-gray-300 mb-2">User Retention</h3>
                          <div className="flex items-center">
                            <Users className="h-5 w-5 text-blue-400 mr-2" />
                            <span className="text-2xl font-bold text-card-foreground">85%</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">+5% from last month</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {view === "reviews" && (
                  <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                    <div className="p-6 border-b border-border">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <h2 className="text-lg font-semibold text-card-foreground">Customer Reviews</h2>
                        <div className="relative">
                          <Button
                            variant="outline"
                            className="flex items-center gap-2"
                            onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                          >
                            <Filter className="h-4 w-4" />
                            <span>Filter Reviews</span>
                            <ChevronDown className="h-4 w-4" />
                          </Button>

                          {isFilterMenuOpen && (
                            <div className="absolute right-0 mt-2 w-64 bg-card rounded-lg shadow-lg border border-border z-10 p-4">
                              <h3 className="text-sm font-medium mb-3 text-card-foreground">Filter Options</h3>

                              <div className="space-y-4">
                                <div>
                                  <label className="text-sm text-muted-foreground block mb-1">Business</label>
                                  <select
                                    value={reviewFilter}
                                    onChange={(e) => setReviewFilter(e.target.value)}
                                    className="w-full bg-background border border-input rounded-md text-foreground text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
                                  >
                                    <option value="all">All Businesses</option>
                                    {reviewListings.map((business, index) => (
                                      <option key={index} value={business}>
                                        {business}
                                      </option>
                                    ))}
                                  </select>
                                </div>

                                <div>
                                  <label className="text-sm text-muted-foreground block mb-1">Rating</label>
                                  <select
                                    value={ratingFilter}
                                    onChange={(e) => setRatingFilter(e.target.value)}
                                    className="w-full bg-background border border-input rounded-md text-foreground text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
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
                                  <label className="text-sm text-muted-foreground block mb-1">Time Period</label>
                                  <select
                                    value={dateFilter}
                                    onChange={(e) => setDateFilter(e.target.value)}
                                    className="w-full bg-background border border-input rounded-md text-foreground text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
                                  >
                                    <option value="all">All Time</option>
                                    <option value="today">Today</option>
                                    <option value="week">Last 7 Days</option>
                                    <option value="month">Last 30 Days</option>
                                  </select>
                                </div>

                                <div className="pt-2 flex justify-end">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="mr-2"
                                    onClick={() => {
                                      setReviewFilter("all")
                                      setRatingFilter("all")
                                      setDateFilter("all")
                                    }}
                                  >
                                    Reset
                                  </Button>
                                  <Button
                                    size="sm"
                                    className="bg-primary hover:bg-primary/90"
                                    onClick={() => setIsFilterMenuOpen(false)}
                                  >
                                    Apply
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="text-lg font-medium text-card-foreground">
                            {reviewFilter === "all" ? "All Reviews" : `Reviews for ${reviewFilter}`}
                            {ratingFilter !== "all" && ` - ${ratingFilter} Stars`}
                            {dateFilter !== "all" &&
                              ` - ${
                                dateFilter === "today"
                                  ? "Today"
                                  : dateFilter === "week"
                                    ? "Last 7 Days"
                                    : "Last 30 Days"
                              }`}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Showing {filteredReviews.length} {filteredReviews.length === 1 ? "review" : "reviews"}
                          </p>
                        </div>
                        <Button className="bg-primary hover:bg-primary/90">Export Reviews</Button>
                      </div>

                      <div className="space-y-6">
                        {filteredReviews.length > 0 ? (
                          filteredReviews.map((review) => (
                            <ReviewCard
                              key={review.id}
                              review={review}
                              onReply={() => openResponseModal(review.id)}
                              onDelete={() => handleDeleteReview(review.id)}
                              formatDate={formatDate}
                            />
                          ))
                        ) : (
                          <div className="text-center py-12 bg-background border border-border rounded-lg">
                            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                            <p className="text-muted-foreground">No reviews found matching your criteria.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </SidebarProvider>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-card rounded-xl shadow-lg max-w-md w-full mx-4 border border-border">
              <div className="p-6 border-b border-border">
                <h2 className="text-xl font-semibold text-card-foreground">
                  {isEditMode ? "Edit Listing" : "Add New Listing"}
                </h2>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="p-6 space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-muted-foreground mb-1">
                      Business Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
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
                      className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                      required
                    >
                      <option value="">Select category</option>
                      <option value="Restaurants">Restaurants</option>
                      <option value="Shopping">Shopping</option>
                      <option value="Health & Beauty">Health & Beauty</option>
                      <option value="Automotive">Automotive</option>
                      <option value="Education">Education</option>
                      <option value="Accommodation">Accommodation</option>
                      <option value="Entertainment">Entertainment</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="desc" className="block text-sm font-medium text-muted-foreground mb-1">
                      Description
                    </label>
                    <textarea
                      id="desc"
                      value={formData.desc}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                      rows="2"
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-muted-foreground mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        id="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="rating" className="block text-sm font-medium text-muted-foreground mb-1">
                        Rating (1-5)
                      </label>
                      <input
                        type="number"
                        id="rating"
                        min="1"
                        max="5"
                        step="0.1"
                        value={formData.rating}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-muted-foreground mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                      placeholder="Full address"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-muted-foreground mb-1">
                        Phone
                      </label>
                      <input
                        type="text"
                        id="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>

                    <div>
                      <label htmlFor="hours" className="block text-sm font-medium text-muted-foreground mb-1">
                        Hours
                      </label>
                      <input
                        type="text"
                        id="hours"
                        value={formData.hours}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                        placeholder="9:00 AM - 5:00 PM"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-muted-foreground mb-1">
                      Status
                    </label>
                    <select
                      id="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                      required
                    >
                      <option value="Approved">Approved</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>
                </div>

                <div className="p-6 border-t border-border flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-input text-foreground hover:bg-accent"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-primary hover:bg-primary/90">
                    {isEditMode ? "Save Changes" : "Add Listing"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Response Modal */}
        {isResponseModalOpen && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-card rounded-xl shadow-lg max-w-md w-full mx-4 border border-border">
              <div className="p-6 border-b border-border">
                <h2 className="text-xl font-semibold text-card-foreground">Respond to Review</h2>
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
                      className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                      rows="4"
                      placeholder="Thank you for your feedback..."
                      required
                    ></textarea>
                  </div>
                </div>

                <div className="p-6 border-t border-border flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-input text-foreground hover:bg-accent"
                    onClick={closeResponseModal}
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
      </div>
    )
  }

  return content
}

function ReviewCard({ review, onReply, onDelete, formatDate }) {
  return (
    <div className="bg-background border border-border rounded-lg p-4">
      <div className="flex justify-between items-start mb-2">
        <div>
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

      <p className="text-card-foreground my-3">{review.comment}</p>

      <div className="flex items-center text-sm text-muted-foreground">
        <span>Review for:</span>
        <span className="font-medium ml-1 text-primary">{review.listingName}</span>
        <span className="mx-1">•</span>
        <span>{review.businessType}</span>
      </div>

      {review.hasResponse && (
        <div className="mt-3 pl-4 border-l-2 border-primary/30">
          <p className="text-sm font-medium text-card-foreground">Business Response:</p>
          <p className="text-sm text-muted-foreground mt-1">{review.response}</p>
        </div>
      )}

      <div className="mt-3 flex space-x-2">
        {!review.hasResponse && (
          <Button variant="outline" size="sm" className="text-xs" onClick={onReply}>
            Reply
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          className="text-xs text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={onDelete}
        >
          Delete
        </Button>
      </div>
    </div>
  )
}

function MetricCard({ title, value, icon, trend }) {
  return (
    <div className="bg-card rounded-xl shadow-sm border border-border p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-primary/20 rounded-lg">{icon}</div>
      </div>
      <h3 className="text-sm font-medium text-muted-foreground mb-1">{title}</h3>
      <p className="text-2xl font-bold text-card-foreground mb-1">{value}</p>
      <p className="text-xs text-muted-foreground">{trend}</p>
    </div>
  )
}

export default Dashboard

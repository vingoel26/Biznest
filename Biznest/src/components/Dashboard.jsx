import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [listings, setListings] = useState([
    {
      id: 1,
      businessName: 'Coffee Shop',
      category: 'Cafes',
      location: 'Downtown',
      status: 'Approved'
    },
    {
      id: 2,
      businessName: 'Bookstore',
      category: 'Retail',
      location: 'Midtown',
      status: 'Pending'
    }
  ]);
  
  const [nextId, setNextId] = useState(3);
  const [metrics, setMetrics] = useState({
    totalListings: 2,
    newListings: 0,
    activeUsers: 3456,
    pendingApprovals: 1
  });
  
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);
  const [currentOldStatus, setCurrentOldStatus] = useState('');
  
  const [formData, setFormData] = useState({
    businessName: '',
    category: '',
    location: '',
    status: 'Approved'
  });

  useEffect(() => {
    const pendingCount = listings.filter(listing => listing.status === 'Pending').length;
    setMetrics(prev => ({
      ...prev,
      pendingApprovals: pendingCount,
      totalListings: listings.length
    }));
  }, [listings]);

  const getCategories = () => {
    const categoryCounts = {};
    listings.forEach(listing => {
      const category = listing.category;
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });
    
    const existingCategories = ['Cafes', 'Retail', 'Restaurants', 'Services'];
    const result = [...existingCategories];
    
    return result.map(category => ({
      name: category,
      count: categoryCounts[category] || 0
    }));
  };

  const handleNavigate = (tab, e) => {
    e.preventDefault();
    setActiveTab(tab);
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setCurrentEditId(null);
    setFormData({
      businessName: '',
      category: '',
      location: '',
      status: 'Approved'
    });
    setModalVisible(true);
  };

  const openEditModal = (id) => {
    const listing = listings.find(item => item.id === id);
    if (listing) {
      setIsEditMode(true);
      setCurrentEditId(id);
      setCurrentOldStatus(listing.status);
      setFormData({
        businessName: listing.businessName,
        category: listing.category,
        location: listing.location,
        status: listing.status
      });
      setModalVisible(true);
    }
  };

  const deleteListing = (id) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      const listing = listings.find(item => item.id === id);
      if (listing) {
        const isNewListing = id >= 3;
        
        setListings(prevListings => prevListings.filter(item => item.id !== id));
        
        setMetrics(prev => ({
          ...prev,
          totalListings: prev.totalListings - 1,
          newListings: isNewListing ? prev.newListings - 1 : prev.newListings,
          pendingApprovals: listing.status === 'Pending' ? prev.pendingApprovals - 1 : prev.pendingApprovals
        }));
      }
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    if (isEditMode) {
      setListings(prevListings => {
        return prevListings.map(listing => {
          if (listing.id === currentEditId) {
            return { ...listing, ...formData };
          }
          return listing;
        });
      });
      
      if (currentOldStatus !== formData.status) {
        setMetrics(prev => ({
          ...prev,
          pendingApprovals: 
            currentOldStatus === 'Pending' && formData.status !== 'Pending' ? prev.pendingApprovals - 1 :
            currentOldStatus !== 'Pending' && formData.status === 'Pending' ? prev.pendingApprovals + 1 :
            prev.pendingApprovals
        }));
      }
    } else {
      const newListing = {
        ...formData,
        id: nextId
      };
      
      setListings(prev => [...prev, newListing]);
      setNextId(nextId + 1);
      
      setMetrics(prev => ({
        ...prev,
        totalListings: prev.totalListings + 1,
        newListings: prev.newListings + 1,
        pendingApprovals: formData.status === 'Pending' ? prev.pendingApprovals + 1 : prev.pendingApprovals
      }));
    }
    
    setModalVisible(false);
  };

  const getRecentListings = () => {
    return [...listings].slice(-2).reverse();
  };

  return (
    <div className="app-container">
      <div className="main-layout">
        <aside className="sidebar">
          <nav className="side-nav">
            <a 
              className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`} 
              href="#dashboard" 
              onClick={(e) => handleNavigate('dashboard', e)}
            >
              Dashboard
            </a>
            <a 
              className={`nav-link ${activeTab === 'listings' ? 'active' : ''}`} 
              href="#listings" 
              onClick={(e) => handleNavigate('listings', e)}
            >
              Listings
            </a>
            <a 
              className={`nav-link ${activeTab === 'categories' ? 'active' : ''}`} 
              href="#categories" 
              onClick={(e) => handleNavigate('categories', e)}
            >
              Categories
            </a>
            <a className="nav-link" href="#analytics">Analytics</a>
            <a className="nav-link" href="#reviews">Reviews</a>
            <a className="nav-link" href="#settings">Settings</a>
          </nav>
        </aside>

        <main className="content">
          <div className="header-actions">
            <button className="btn primary" onClick={openAddModal}>Add Listing</button>
          </div>

          {activeTab === 'dashboard' && (
            <div className="dashboard-content">
              <div className="metrics-grid">
                <div className="metric-card">
                  <div className="card-body">
                    <h5 className="card-title">Total Listings</h5>
                    <p className="card-value">{metrics.totalListings}</p>
                  </div>
                </div>
                
                <div className="metric-card">
                  <div className="card-body">
                    <h5 className="card-title">New Listings</h5>
                    <p className="card-value">{metrics.newListings}</p>
                  </div>
                </div>
                
                <div className="metric-card">
                  <div className="card-body">
                    <h5 className="card-title">Active Users</h5>
                    <p className="card-value">{metrics.activeUsers}</p>
                  </div>
                </div>
                
                <div className="metric-card">
                  <div className="card-body">
                    <h5 className="card-title">Pending Approvals</h5>
                    <p className="card-value">{metrics.pendingApprovals}</p>
                  </div>
                </div>
              </div>

              <div className="charts-grid">
                <div className="chart-card wide">
                  <div className="card-body">
                    <h5 className="card-title">Category-wise Listings</h5>
                    <div className="chart-placeholder">Bar Chart Placeholder</div>
                  </div>
                </div>
                
                <div className="chart-card">
                  <div className="card-body">
                    <h5 className="card-title">Review Sentiment</h5>
                    <div className="chart-placeholder">Pie Chart Placeholder</div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Recent Listings</h5>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Business Name</th>
                        <th>Category</th>
                        <th>Location</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getRecentListings().map(listing => (
                        <tr key={listing.id} data-id={listing.id}>
                          <td>{listing.businessName}</td>
                          <td>{listing.category}</td>
                          <td>{listing.location}</td>
                          <td>{listing.status}</td>
                          <td className="actions">
                            <button className="btn-small outline" onClick={() => openEditModal(listing.id)}>Edit</button>
                            <button className="btn-small outline danger" onClick={() => deleteListing(listing.id)}>Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'listings' && (
            <div className="listings-content">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">All Listings</h5>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Business Name</th>
                        <th>Category</th>
                        <th>Location</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {listings.map(listing => (
                        <tr key={listing.id} data-id={listing.id}>
                          <td>{listing.businessName}</td>
                          <td>{listing.category}</td>
                          <td>{listing.location}</td>
                          <td>{listing.status}</td>
                          <td className="actions">
                            <button className="btn-small outline" onClick={() => openEditModal(listing.id)}>Edit</button>
                            <button className="btn-small outline danger" onClick={() => deleteListing(listing.id)}>Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="categories-content">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Business Categories</h5>
                  <div className="categories-grid">
                    {getCategories().map((category, index) => (
                      <div key={index} className="category-card">
                        <div className="card-body">
                          <h5 className="card-title">{category.name}</h5>
                          <p className="card-value">{category.count}</p>
                          <small className="text-muted">
                            {category.count === 1 ? 'Listing' : 'Listings'}
                          </small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {modalVisible && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h5 className="modal-title">{isEditMode ? 'Edit Listing' : 'Add New Listing'}</h5>
              <button className="close-btn" onClick={() => setModalVisible(false)}>×</button>
            </div>
            <div className="modal-body">
              <form id="listingForm" onSubmit={handleFormSubmit}>
                <div className="form-group">
                  <label htmlFor="businessName">Business Name</label>
                  <input
                    type="text"
                    id="businessName"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    required
                  >
                    <option value="">Select category</option>
                    <option value="Cafes">Cafes</option>
                    <option value="Retail">Retail</option>
                    <option value="Restaurants">Restaurants</option>
                    <option value="Services">Services</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="location">Location</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="status">Status</label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleFormChange}
                    required
                  >
                    <option value="Approved">Approved</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn outline" onClick={() => setModalVisible(false)}>Cancel</button>
                  <button type="submit" className="btn primary">Save Listing</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
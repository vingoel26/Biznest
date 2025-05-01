import React, { useRef, useEffect, useState } from "react";
import "./HomePage.css";
import logoImg from "./images/logo (2).png";
import defaultUserPicture from "./images/defaultUserPicture.png";
import api from '../services/api'; // Import the api service

const HomePage = () => {
  const dropdownRef = useRef(null);
  const displayPictureRef = useRef(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [userData, setUserData] = useState('Loading user data...');
  const username = localStorage.getItem('username') || 'User'; 

  // Toggle dropdown visibility
  const handleDisplayPictureClick = () => {
    setIsDropdownVisible((prev) => !prev);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        displayPictureRef.current &&
        !displayPictureRef.current.contains(event.target)
      ) {
        setIsDropdownVisible(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Fetch protected data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Use the axios instance which includes the token
        const response = await api.get('/api/user/me'); 
        setUserData(response.data); // The backend sends plain text
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Error handling (like 401) might be handled by the axios interceptor
        // Set a generic message here if needed, or rely on interceptor redirect
        setUserData('Failed to load user data. You might be logged out.');
      }
    };

    fetchUserData();
  }, []); // Empty dependency array ensures this runs only once

  const handleLogout = () => {
      localStorage.removeItem('username'); 
      localStorage.removeItem('jwtToken'); // Remove token on logout
      window.location.href = '/login'; 
  }

  return (
    <div>
      <header>
        
          <img id="logoimg" src={logoImg} alt="BizNest Logo" />
        
        <nav>
          <ul>
            <li><a className="nav-button" href="/WDA-assignment/sign-up page/signuppage.html">Signup</a></li>
            <li><a className="nav-button" href="/WDA-assignment/about us/aboutus.html">About</a></li>
            <li><a className="nav-button" href="/WDA-assignment/new-contact-us/contact.html">Contact</a></li>
            <li className="ind"><a className="ind" href="/WDA-assignment/index/index.html">Index</a></li>
          </ul>
          <div id="displayPicture" ref={displayPictureRef} onClick={handleDisplayPictureClick}>
            <img src={defaultUserPicture} alt="Profile" id="profilePicture" />
            <div
              id="userDropdown"
              className="user-dropdown"
              ref={dropdownRef}
              style={{ display: isDropdownVisible ? "block" : "none" }}
            >
              <p><strong>Name:</strong> {username}</p>
              <p><small><i>Raw Data: {typeof userData === 'string' ? userData : JSON.stringify(userData)}</i></small></p>
            </div>
          </div>
        </nav>
      </header>

      <main>
        <section className="search">
          <input type="text" placeholder="Search for services or products..." />
          <button id="search-button">Search</button>
        </section>

        <section className="categories">
          <h2>Categories</h2>
          <div className="category-list">
            {[
              "Restaurants",
              "Shopping",
              "Health & Beauty",
              "Automotive",
              "Home Services",
              "Entertainment",
            ].map((category, index) => (
              <div className="category-item" id={category.replace(/\s/g, "")} key={index}>
                <div className="category-image"></div>
                <div className="category-name">{category}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="featured">
          <h2>Featured Listings</h2>
          {[
            { name: "Tunday Kebabi", desc: "Best Kebabs in town!" },
            { name: "Pheonix Palassio", desc: "Your one-stop shop for everything!" },
            { name: "IIIT Lucknow", desc: "The world is at IIIT Lucknow, where are you?" },
            { name: "Saroj Hostel", desc: "Best hostel in the whole town!" },
          ].map((listing, index) => (
            <div className="listing" key={index}>
              <h3>{listing.name}</h3>
              <p>{listing.desc}</p>
            </div>
          ))}
        </section>
      </main>

      <footer>
        <div className="footer-content">
          <div className="footer-section about">
            <h3>About Us</h3>
            <p>
              BizNest connects customers with local businesses, making it easy to find
              the best services in your area.
            </p>
          </div>
          <div className="footer-section links">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="/WDA-assignment/sign-up page/signuppage.html">Signup</a></li>
              <li><a href="/WDA-assignment/about us/aboutus.html">About</a></li>
              <li><a href="/WDA-assignment/new-contact-us/contact.html">Contact</a></li>
              <li><a href="/WDA-assignment/index/index.html">Index</a></li>
            </ul>
          </div>
          <div className="footer-section social">
            <h3>Follow Us</h3>
            <a className="nav-button" href="#">Facebook</a>
            <a className="nav-button" href="#">Twitter</a>
            <a className="nav-button" href="#">Instagram</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 BizNest. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
import React, { useRef, useEffect, useState } from "react";
import "./HomePage.css";
import logoImg from "./images/logo (2).png";
import defaultUserPicture from "./images/defaultUserPicture.png";

const HomePage = () => {
  const dropdownRef = useRef(null);
  const displayPictureRef = useRef(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

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
              <p><strong>Name:</strong> John Doe</p>
              <p><strong>Email:</strong> john.doe@example.com</p>
              <p><strong>Role:</strong> User</p>
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

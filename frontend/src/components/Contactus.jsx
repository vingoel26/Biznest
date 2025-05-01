import React, { useState } from 'react';
import './contactus.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you would typically send the data to a server
    alert('Message sent! We will get back to you soon.');
    setFormData({ fullName: '', email: '', message: '' });
  };

  return (
    <div className="contact-page">
      <header className="header">
        
        <nav className="nav">
        <div className="logo-container">
        <img src="/logo.jpg" alt="Biznest Logo" className="logo" />
        <h1>Biznest</h1>
          </div>
        
          <ul>
            <li><a href="/signup">Signup</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/contact" className="active">Contact</a></li>
            <li><a href="/index" className="index-btn">Index</a></li>
          </ul>
        </nav>
      </header>

      <section className="hero">
        <h1>Get in Touch</h1>
        <p>Have questions about Biznest? Our team is here to help. Reach out to us using any of the methods below.</p>
      </section>

      <section className="contact-methods">
        <div className="contact-card">
          <div className="icon-circle">
            <i className="phone-icon"></i>
          </div>
          <h2>Call Us</h2>
          <p>Speak directly with our support team</p>
          <a href="tel:+15551234567" className="contact-info">+1 (555) 123-4567</a>
        </div>

        <div className="contact-card">
          <div className="icon-circle">
            <i className="email-icon"></i>
          </div>
          <h2>Email Us</h2>
          <p>Send us your questions or feedback</p>
          <a href="mailto:contact@biznest.com" className="contact-info">contact@biznest.com</a>
        </div>

        <div className="contact-card">
          <div className="icon-circle">
            <i className="location-icon"></i>
          </div>
          <h2>Visit Us</h2>
          <p>Come to our headquarters</p>
          <address className="contact-info">123 Business Ave, Tech Park</address>
        </div>
      </section>

      <section className="contact-form-container">
        <div className="sidebar">
          <h2>Contact Options</h2>
          <ul>
            <li className="active">
              <a href="#general">General Inquiry</a>
            </li>
            <li>
              <a href="#business">Business Listing</a>
            </li>
          </ul>
        </div>

        <div className="form-section">
          <h2>General Inquiry</h2>
          <p>Have a question about Biznest? We're here to help.</p>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
              ></textarea>
            </div>
            <button type="submit" className="submit-btn">Send Message</button>
          </form>
        </div>
      </section>

      <footer className="footer">
        <p>&copy; 2025 Biznest. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ContactPage;
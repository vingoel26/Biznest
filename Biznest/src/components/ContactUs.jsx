import React, { useState } from 'react';
import '../styles/ContactUs.css';

const contacts = [
  {
    id: 'ac',
    name: 'Aditya Chandak',
    phone: '9236469868',
    email: 'aditya.chandak234@gmail.com',
  },
  {
    id: 'vg',
    name: 'Vinayak Goel',
    phone: '9336250306',
    email: 'vinayakgoel012@gmail.com',
  },
  {
    id: 'st',
    name: 'Samay Toradmal',
    phone: '7709244965',
    email: 'samaytoradmal@gmail.com',
  },
  {
    id: 'ds',
    name: 'Divyanshu Singh',
    phone: '8006666963',
    email: 'divyyanshusingh@gmail.com',
  },
  {
    id: 'pk',
    name: 'Piyush Khattar',
    phone: '7676910082',
    email: 'piyushkhattar14@gmail.com',
  },
  {
    id: 'mt',
    name: 'Mohd. Taha Rafi',
    phone: '9795144507',
    email: 'taharafi05@gmail.com',
  },
  {
    id: 'vs',
    name: 'Vaidik Saksena',
    phone: '9696273387',
    email: 'mdanasaliusmani@gmail.com',
  },
  {
    id: 'ap',
    name: 'Anjali Pai',
    phone: '7619234859',
    email: 'anjalisugandhapai@gmail.com',
  },
  {
    id: 'ka',
    name: 'Khushi Arya',
    phone: '9569280470',
    email: 'khushia0705@gmail.com',
  },
  {
    id: 'dn',
    name: 'Diksha Narayan',
    phone: '9454342431',
    email: 'dikshanarayan316@gmail.com',
  },
];

const ContactUs = () => {
  const [showAllPhones, setShowAllPhones] = useState(false);
  const [showAllEmails, setShowAllEmails] = useState(false);

  return (
    <div className="contact-page">
      <div className="contact-header">
        <h1>Contact Us</h1>
        <h2>GET IN TOUCH WITH US</h2>
        <p>
          At Chance, your experience matters. Whether you're facing an issue, have feedback on gameplay, 
          or want to explore partnership opportunities — our team is here to help.
        </p>
      </div>

      <div className="contact-info">
        <div className="info-section">
          <h3>Our Location</h3>
          <p>IITL Lucknow</p>
        </div>

        <div 
          className="info-section expandable-section" 
          onClick={() => setShowAllPhones(!showAllPhones)}
        >
          <div className="section-header">
            <h3>Phone Numbers</h3>
            <span className="toggle-icon">
              {showAllPhones ? '▼' : '▶'}
            </span>
          </div>
          <div className="main-contact">Click Here</div>
          {showAllPhones && (
            <div className="additional-contacts">
              {contacts.map(contact => (
                <div key={`phone-${contact.id}`} className="contact-entry">
                  <span className="contact-name">{contact.name}:</span>
                  <a href={`tel:+91${contact.phone}`}>{contact.phone}</a>
                </div>
              ))}
            </div>
          )}
        </div>

        <div 
          className="info-section expandable-section" 
          onClick={() => setShowAllEmails(!showAllEmails)}
        >
          <div className="section-header">
            <h3>Email Addresses</h3>
            <span className="toggle-icon">
              {showAllEmails ? '▼' : '▶'}
            </span>
          </div>
          <div className="main-contact">Click Here</div>
          {showAllEmails && (
            <div className="additional-contacts">
              {contacts.map(contact => (
                <div key={`email-${contact.id}`} className="contact-entry">
                  <span className="contact-name">{contact.name}:</span>
                  <a href={`mailto:${contact.email}`}>{contact.email}</a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
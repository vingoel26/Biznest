import React from 'react';
import '../styles/AboutUs.css';
import vinayak from '../images/vinayak.JPG';
import vaidik from '../images/vaidik.jpg';
import taha from '../images/taha.jpg';
import divyanshu from '../images/divyanshu.jpg';
import anjali from '../images/anjali.jpg';
import khushi from '../images/khushi.jpg';
import diksha from '../images/diksha.jpg';
import piyush from '../images/piyush.jpg';
import samay from '../images/samay.jpg';
import aditya from '../images/aditya.jpg';

const teamMembers = [
  { name: 'Vinayak Goel', role: 'Worked on backend', img: vinayak },
  { name: 'Vaidik Saxena', role: 'Worked on backend', img: vaidik },
  { name: 'Mohd. Taha Rafi', role: 'Worked on backend', img: taha },
  { name: 'Divyanshu Singh', role: 'Worked on backend', img: divyanshu },
  { name: 'Anjali Pai', role: 'Made Sign-Up page', img: anjali },
  { name: 'Khushi Arya', role: 'Made Contact-Us page', img: khushi},
  { name: 'Diksha Narayan', role: 'Made About-Us page', img: diksha },
  { name: 'Piyush Khattar', role: 'Made Sign-Up page', img: piyush },
  { name: 'Samay Toradmal', role: ' Worked on Dashboard', img: samay },
  { name: 'Aditya Chandak', role: 'Worked on backend', img: aditya }
];

const AboutUs = () => {
  return (
    <div>
      <header className="header">
        <div className="header-content">
          <h1>Eternal Coders Portfolio</h1>
          <p><em>Crafting New Opportunities</em></p>
        </div>
        <div className="wave"></div>
      </header>

      <section className="grid-section">
        <div className="container">
          <h2>Technical Skills</h2>
          <div className="skills-grid">
            <div className="skill-card">
              <h3>Frontend Development</h3>
              <p>Newbie in HTML5, CSS3, and modern web design principles. Creating responsive and intuitive user interfaces.</p>
            </div>
            <div className="skill-card">
              <h3>UI/UX Design</h3>
              <p>Newbie in creating user-centered designs with a focus on accessibility and modern design trends.</p>
            </div>
            <div className="skill-card">
              <h3>Responsive Design</h3>
              <p>Building websites that work flawlessly across all devices and screen sizes.</p>
            </div>
            <div className="skill-card">
              <h3>Web Performance</h3>
              <p>Optimizing websites for speed and performance while maintaining visual appeal.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid-section dark">
        <div className="container">
          <h2>Project Team</h2>
          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <div className="team-member" key={index}>
                <img src={member.img} alt={member.name} />
                <div className="team-info">
                  <h3>{member.name}</h3>
                  <p>{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;

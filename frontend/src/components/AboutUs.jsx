import React, { useEffect } from "react";
import "./AboutUS.css";

const AboutUs = () => {
  useEffect(() => {
    const skillCards = document.querySelectorAll(".skill-card");
    skillCards.forEach((card) => {
      card.addEventListener("mouseover", () => {
        card.style.transform = "scale(1.05)";
        card.style.backgroundColor = "#2c2c2c";
        card.querySelector("h3").style.color = "#ff00ff";
      });
      card.addEventListener("mouseout", () => {
        card.style.transform = "scale(1)";
        card.style.backgroundColor = "#1b1b1b";
        card.querySelector("h3").style.color = "";
      });
    });

    const teamMembers = document.querySelectorAll(".team-member");
    teamMembers.forEach((member) => {
      member.addEventListener("click", () => {
        const name = member.querySelector("h3").textContent;
        alert(`Name: ${name}\n\nClick OK to close.`);
      });
    });

    const header = document.querySelector(".header");
    const scrollHandler = () => {
      header.style.opacity = window.scrollY > 50 ? "0.9" : "1";
    };
    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, []);

  const skills = [
    {
      title: "Frontend Development",
      description:
        "Newbie in HTML5, CSS3, and modern web design principles. Creating responsive and intuitive user interfaces.",
    },
    {
      title: "UI/UX Design",
      description:
        "Newbie in creating user-centered designs with a focus on accessibility and modern design trends.",
    },
    {
      title: "Responsive Design",
      description:
        "Building websites that work flawlessly across all devices and screen sizes.",
    },
    {
      title: "Web Performance",
      description:
        "Optimizing websites for speed and performance while maintaining visual appeal.",
    },
  ];

  const team = [
    { name: "Anjali Pai", desc: "Made index page", img: "/images/anjali.jpg" },
    { name: "Vinayak Goel", desc: "Made Login and Sign-Up page", img: "/images/vinayak.JPG" },
    { name: "Vaidik Saxena", desc: "Made About Us Page", img: "/images/vaidik.jpg" },
    { name: "Mohd. Taha Rafi", desc: "Made About Us page", img: "/images/taha.jpg" },
    { name: "Divyanshu Singh", desc: "Made Home page", img: "/images/divyanshu.jpg" },
    { name: "Khushi Arya", desc: "Made Index page", img: "/images/khushi.jpg" },
    { name: "Diksha Narayan", desc: "Made Contact-Us page", img: "/images/diksha.jpg" },
    { name: "Piyush Khattar", desc: "Made Sign-Up page", img: "/images/piyush.jpg" },
    { name: "Samay Toradmal", desc: "Home page, Design of all pages", img: "/images/samay.jpg" },
    { name: "Aditya Chandak", desc: "Made Contact-Us page", img: "/images/aditya.jpg" },
  ];

  return (
    <div className="page-wrapper">
      <header className="header">
        <div className="header-content">
          <h1 className="main-title">Eternal Coders Portfolio</h1>
          <p className="subtitle">Crafting New Opportunities</p>
        </div>
        <div className="wave"></div>
      </header>

      <section className="section-wrapper">
        <h2 className="section-title">Technical Skills</h2>
        <div className="grid">
          {skills.map((skill, index) => (
            <div className="skill-card" key={index}>
              <h3>{skill.title}</h3>
              <p>{skill.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-wrapper">
        <h2 className="section-title">Project Team</h2>
        <div className="grid">
          {team.map((member, index) => (
            <div className="team-member" key={index}>
              <img src={member.img} alt={member.name} />
              <div className="team-info">
                <h3>{member.name}</h3>
                <p>{member.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AboutUs;

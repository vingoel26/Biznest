"use client"

import { useState } from "react"
import { motion } from "framer-motion"

const AboutPage = () => {
  const [activeTab, setActiveTab] = useState("mission")

  const skills = [
    {
      title: "Frontend Development",
      description: "Creating responsive and intuitive user interfaces with modern web technologies.",
      icon: "",
    },
    {
      title: "UI/UX Design",
      description: "Crafting user-centered designs with a focus on accessibility and modern design trends.",
      icon: "",
    },
    {
      title: "Responsive Design",
      description: "Building websites that work flawlessly across all devices and screen sizes.",
      icon: "",
    },
    {
      title: "Web Performance",
      description: "Optimizing websites for speed and performance while maintaining visual appeal.",
      icon: "",
    },
  ]

  const team = [
    { name: "Vinayak Goel", desc: "", img: "/images/vinayak.jpg" },
    { name: "Anjali Pai", desc: "", img: "/images/anjali.jpg" },
    { name: "Vaidik Saxena", desc: "", img: "/images/vaidik.jpg" },
    { name: "Mohd. Taha Rafi", desc: "", img: "/images/taha.jpg" },
    { name: "Divyanshu Singh", desc: "", img: "/images/divyanshu.jpg" },
    { name: "Khushi Arya", desc: "", img: "/images/khushi.jpg" },
    { name: "Diksha Narayan", desc: "", img: "/images/diksha.jpg" },
    { name: "Piyush Khattar", desc: "", img: "/images/piyush.jpg" },
    { name: "Samay Toradmal", desc: "", img: "/images/samay.jpg" },
    { name: "Aditya Chandak", desc: "", img: "/images/aditya.jpg" },
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="bg-background text-foreground min-h-screen w-full">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">About BizNest</h1>
          <p className="text-xl text-primary-foreground/80 max-w-3xl mx-auto">
            Crafting New Opportunities and Connecting Communities
          </p>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-16 wave-divider overflow-hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
            className="w-full h-full"
            preserveAspectRatio="none"
          >
            <path
              fill="currentColor"
              fillOpacity="1"
              className="text-background"
              d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,128C672,128,768,160,864,176C960,192,1056,192,1152,170.7C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="flex flex-wrap justify-center mb-8 border-b border-purple-500/30">
            <TabButton active={activeTab === "mission"} onClick={() => setActiveTab("mission")}>
              Our Mission
            </TabButton>
            <TabButton active={activeTab === "vision"} onClick={() => setActiveTab("vision")}>
              Our Vision
            </TabButton>
            <TabButton active={activeTab === "values"} onClick={() => setActiveTab("values")}>
              Our Values
            </TabButton>
            <TabButton active={activeTab === "story"} onClick={() => setActiveTab("story")}>
              Our Story
            </TabButton>
          </div>

          <div className="max-w-3xl mx-auto text-foreground">
            {activeTab === "mission" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <h2 className="text-2xl font-bold mb-4 text-primary">Our Mission</h2>
                <p className="text-foreground mb-4">
                  At BizNest, our mission is to connect local communities with the businesses that serve them. We
                  believe in creating a platform that empowers small businesses to thrive while helping customers
                  discover the best services in their area.
                </p>
                <p className="text-foreground">
                  We're dedicated to fostering economic growth at the local level by providing businesses with the
                  digital tools they need to reach more customers and by giving consumers a trusted resource for finding
                  quality services.
                </p>
              </motion.div>
            )}

            {activeTab === "vision" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <h2 className="text-2xl font-bold mb-4 text-primary">Our Vision</h2>
                <p className="text-foreground mb-4">
                  We envision a world where every local business has the opportunity to thrive in the digital economy.
                  BizNest aims to be the bridge that connects communities with the businesses that make them unique.
                </p>
                <p className="text-foreground">
                  Our vision is to create the most comprehensive and user-friendly platform for local business
                  discovery, where consumers can find trusted recommendations and businesses can showcase their unique
                  offerings.
                </p>
              </motion.div>
            )}

            {activeTab === "values" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <h2 className="text-2xl font-bold mb-4 text-primary">Our Values</h2>
                <ul className="text-foreground space-y-4">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>
                      <strong className="font-bold">Community First:</strong> We prioritize the needs of local
                      communities and the businesses that serve them.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>
                      <strong className="font-bold">Transparency:</strong> We believe in honest reviews and authentic
                      connections between businesses and customers.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>
                      <strong className="font-bold">Innovation:</strong> We continuously improve our platform to better
                      serve both businesses and consumers.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>
                      <strong className="font-bold">Inclusivity:</strong> We strive to create a platform that's
                      accessible and beneficial to businesses of all sizes.
                    </span>
                  </li>
                </ul>
              </motion.div>
            )}

            {activeTab === "story" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <h2 className="text-2xl font-bold mb-4 text-primary">Our Story</h2>
                <p className="text-foreground mb-4">
                  BizNest began as a student project with a simple goal: to help people discover the best local
                  businesses in their area. What started as a small idea has grown into a platform that connects
                  thousands of businesses with their communities.
                </p>
                <p className="text-foreground">
                  Founded by a team of passionate developers and designers, BizNest was built on the belief that local
                  businesses are the backbone of our communities. Today, we continue to grow and evolve, always guided
                  by our mission to support local economies and help businesses thrive.
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Technical Skills</h2>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            {skills.map((skill, index) => (
              <motion.div
                key={index}
                className="bg-card border border-border rounded-xl p-6 transition-all hover:bg-accent hover:text-accent-foreground hover:transform hover:-translate-y-2"
                variants={item}
              >
                <div className="text-3xl mb-4">{skill.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-primary">{skill.title}</h3>
                <p className="text-foreground">{skill.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Project Team</h2>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
          >
            {team.map((member, index) => (
              <motion.div
                key={index}
                className="group relative overflow-hidden rounded-xl aspect-[3/4]"
                variants={item}
              >
                <img
                  src={member.img || "/placeholder.svg"}
                  alt={member.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                  <h3 className="text-xl font-semibold text-white">{member.name}</h3>
                  <p className="text-gray-300 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {member.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  )
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 font-medium transition-colors ${
        active ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  )
}

export default AboutPage

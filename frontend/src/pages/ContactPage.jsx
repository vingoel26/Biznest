"use client"

import { useState } from "react"
import { Mail, Phone, MapPin, Send, MessageSquare, User, AtSign } from "lucide-react"
import { Button } from "@/components/ui/button"

const ContactPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    message: "",
  })
  const [activeTab, setActiveTab] = useState("general")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch("http://localhost:8080/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, type: activeTab }),
      })
      if (response.ok) {
        alert("Message sent! We will get back to you soon.")
        setFormData({ fullName: "", email: "", message: "" })
      } else {
        alert("Failed to send message. Please try again later.")
      }
    } catch (error) {
      alert("Error sending message.")
    }
  }

  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">Get in Touch</h1>
          <p className="text-xl text-primary-foreground/80 max-w-3xl mx-auto">
            Have questions about BizNest? Our team is here to help. Reach out to us using any of the methods below.
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

      {/* Contact Methods */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <ContactCard
              icon={<Phone className="h-8 w-8 text-primary" />}
              title="Call Us"
              description="Speak directly with our support team"
              contact="+91 93362 50306"
              href="tel:+919336250306"
            />

            <ContactCard
              icon={<Mail className="h-8 w-8 text-primary" />}
              title="Email Us"
              description="Send us your questions or feedback"
              contact="contact@biznest.com"
              href="mailto:contact@biznest.com"
            />

            <ContactCard
              icon={<MapPin className="h-8 w-8 text-primary" />}
              title="Visit Us"
              description="Come to our headquarters"
              contact="IIIT Lucknow"
              href="#"
            />
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted">
        <div className="container mx-auto">
          <div className="max-w-5xl mx-auto bg-card rounded-xl overflow-hidden border border-border">
            <div className="flex flex-col md:flex-row">
              {/* Sidebar */}
              <div className="bg-primary p-8 md:w-64">
                <h2 className="text-xl font-semibold mb-6 text-primary-foreground">Contact Options</h2>
                <ul className="space-y-2">
                  <li>
                    <button
                      onClick={() => setActiveTab("general")}
                      className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${
                        activeTab === "general"
                          ? "bg-primary-foreground/20 text-primary-foreground"
                          : "text-primary-foreground/80 hover:bg-primary-foreground/10"
                      }`}
                    >
                      <MessageSquare className="mr-2 h-5 w-5" />
                      General Inquiry
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab("business")}
                      className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${
                        activeTab === "business"
                          ? "bg-primary-foreground/20 text-primary-foreground"
                          : "text-primary-foreground/80 hover:bg-primary-foreground/10"
                      }`}
                    >
                      <User className="mr-2 h-5 w-5" />
                      Business Listing
                    </button>
                  </li>
                </ul>
              </div>

              {/* Form */}
              <div className="p-8 flex-1">
                <h2 className="text-2xl font-semibold mb-2 text-card-foreground">
                  {activeTab === "general" ? "General Inquiry" : "Business Listing"}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {activeTab === "general"
                    ? "Have a question about BizNest? We're here to help."
                    : "Want to list your business on BizNest? Fill out the form below."}
                </p>

                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-card-foreground mb-1">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                        <input
                          type="text"
                          id="fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 bg-background border border-input rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                          placeholder="Your name"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-card-foreground mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 bg-background border border-input rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                          placeholder="your.email@example.com"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="message" className="block text-sm font-medium text-card-foreground mb-1">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="5"
                      className="w-full px-4 py-3 bg-background border border-input rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="How can we help you?"
                      required
                    ></textarea>
                  </div>

                  <Button type="submit" className="bg-primary hover:bg-primary/90 flex items-center">
                    Send Message
                    <Send className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

function ContactCard({ icon, title, description, contact, href }) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 text-center transition-transform hover:transform hover:-translate-y-2">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-card-foreground">{title}</h3>
      <p className="text-muted-foreground mb-4">{description}</p>
      <a href={href} className="text-primary hover:text-primary/80 font-medium transition-colors">
        {contact}
      </a>
    </div>
  )
}

export default ContactPage

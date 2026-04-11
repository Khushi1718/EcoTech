import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Leaf, BarChart3, Users, Zap, ChevronDown, LogIn, Activity, TrendingUp, Sparkles } from "lucide-react";
import Navbar from "../components/Navbar";
import API from "../api/axios";

export default function HomePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [openFAQ, setOpenFAQ] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [contactStatus, setContactStatus] = useState({ loading: false, success: false, error: null });
  const [activeStep, setActiveStep] = useState(0);
  const [carouselScroll, setCarouselScroll] = useState(0);
  const [autoScroll, setAutoScroll] = useState(true);

  // Check auth status
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location]);

  // Handle hash scrolling
  useEffect(() => {
    const hash = location.hash;
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [location.hash]);

  // Protected navigation handler
  const handleProtectedNavigation = (path) => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      navigate(path);
    }
  };

  // Handle contact form submission
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactStatus({ loading: true, success: false, error: null });

    try {
      const response = await API.post("/api/contact", contactForm);

      if (response.status === 200 || response.status === 201) {
        setContactStatus({ loading: false, success: true, error: null });
        setContactForm({ name: "", email: "", message: "" });
        // Clear success message after 5 seconds
        setTimeout(() => {
          setContactStatus({ loading: false, success: false, error: null });
        }, 5000);
      } else {
        const errorMsg = response.data?.message || "Error sending message. Please try again.";
        setContactStatus({
          loading: false,
          success: false,
          error: errorMsg,
        });
      }
    } catch (error) {
      console.error("Contact form error:", error);
      
      // Extract error message from axios error
      let errorMessage = "Error sending message. Please check your connection and try again.";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 400) {
        errorMessage = "Please fill in all required fields correctly.";
      } else if (error.response?.status === 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setContactStatus({
        loading: false,
        success: false,
        error: errorMessage,
      });
    }
  };

  // Auto-scroll carousel
  useEffect(() => {
    if (!autoScroll) return;
    const interval = setInterval(() => {
      setCarouselScroll((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, [autoScroll]);

  return (
    <div className="min-h-screen bg-white">
      {/* ========== NAVBAR ========== */}
      <Navbar />

      {/* ========== HERO SECTION ========== */}
      <section id="home" className="pt-32 pb-20 px-6 bg-gradient-to-br from-green-50 via-white to-green-50">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block mb-4 px-4 py-2 bg-green-100 rounded-full">
              <p className="text-sm font-semibold text-green-700">Sustainable Living Simplified</p>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 leading-tight mb-6">
              Track Your Impact.<br />
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Build a Better Future</span>
            </h1>
            <p className="text-lg text-gray-600 mb-10 leading-relaxed max-w-lg">
              Monitor your daily habits, measure your carbon footprint, and connect with a vibrant community dedicated to positive environmental change.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => handleProtectedNavigation("/daily")}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 text-lg shadow-lg hover:shadow-xl hover:scale-105"
              >
                Start Tracking
              </button>
              <button
                onClick={() => handleProtectedNavigation("/community")}
                className="border-2 border-green-600 text-green-600 hover:bg-green-50 px-8 py-4 rounded-xl font-semibold transition-all duration-300 text-lg hover:shadow-lg hover:scale-105"
              >
                Join Community
              </button>
            </div>
          </div>
          <div className="hidden md:flex items-center justify-center">
            <div className="relative w-full h-96">
              {/* Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-100 via-emerald-50 to-green-100 rounded-3xl blur-xl opacity-70"></div>
              
              {/* Icon Container */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full blur-2xl opacity-40"></div>
                    <Leaf size={140} className="text-green-600 relative" />
                  </div>
                  <p className="text-gray-700 font-semibold mt-6 text-lg">Your Eco Journey Starts Here</p>
                  <p className="text-gray-500 text-sm mt-2">Join thousands making a difference</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
       {/* ========== ABOUT US SECTION ========== */}
      <section id="about" className="py-16 px-6 bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12 group">
            <div className="inline-block">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition duration-300">About EcoTrack</h2>
            </div>
            <div className="w-16 h-1 bg-gradient-to-r from-green-600 to-emerald-600 mx-auto mb-6 group-hover:w-24 transition-all duration-300"></div>
            <p className="text-sm text-green-600 font-semibold tracking-wide">Our Story & Mission</p>
          </div>
          <div className="space-y-5 text-base md:text-lg text-gray-700 leading-relaxed">
            <p className="hover:text-green-700 hover:translate-x-1 transition duration-300 bg-white bg-opacity-50 p-4 rounded-lg border-l-4 border-green-500">
              <span className="font-semibold text-green-600">We started EcoTrack</span> because we believed that small actions, when multiplied by millions of people, create massive environmental change. Today, our community can track eco-friendly actions and motivate reducing carbon footprints across the globe.
            </p>
            <p className="hover:text-green-700 hover:translate-x-1 transition duration-300 bg-white bg-opacity-50 p-4 rounded-lg border-l-4 border-emerald-500">
              <span className="font-semibold text-emerald-600">Our mission is simple:</span> empower every individual with data-driven insights to make sustainable choices. We're building a world where eco-consciousness is the norm, not the exception.
            </p>
          </div>
        </div>
      </section>

      {/* ========== FEATURES SECTION ========== */}
      <section id="features" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Why Choose EcoTrack?
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: Leaf,
                title: "Daily Tracker",
                desc: "Track electricity, transport, food waste, and plastic usage daily",
              },
              {
                icon: BarChart3,
                title: "Weekly Insights",
                desc: "Analyze your habits with smart summaries and charts",
              },
              {
                icon: Users,
                title: "Community",
                desc: "Share progress, learn, and grow with like-minded people",
              },
              {
                icon: Zap,
                title: "Smart Tips",
                desc: "Get personalized eco suggestions to reduce your footprint",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                <div className="bg-green-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6 hover:bg-green-200 transition">
                  <feature.icon size={32} className="text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== HOW IT WORKS - TIMELINE ========== */}
      <section className="py-24 px-6 bg-gradient-to-br from-white via-green-50 to-emerald-50 relative overflow-hidden">
        {/* Floating background elements */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-green-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-200 rounded-full blur-3xl opacity-15 animate-pulse" style={{ animationDelay: "1s" }}></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 tracking-tight">How It Works</h2>
            <p className="text-gray-600 text-lg">Three simple steps to transform your eco-journey</p>
          </div>

          {/* Timeline Container */}
          <div className="flex justify-center items-center gap-8 md:gap-16">
            {[
              { step: 1, icon: LogIn, title: "Sign Up / Login", desc: "Create your account and get started", color: "from-blue-500 to-blue-600" },
              { step: 2, icon: Activity, title: "Add Your Daily Data", desc: "Log your daily activities and habits", color: "from-green-500 to-emerald-600" },
              { step: 3, icon: TrendingUp, title: "Get Insights & Improve", desc: "View analytics and receive suggestions", color: "from-purple-500 to-pink-600" },
            ].map((item, idx) => (
              <div key={item.step} className="flex items-start gap-6 md:gap-8 flex-1 max-w-sm">
                <div className="flex flex-col items-center w-full">
                  <button
                    onClick={() => setActiveStep(item.step - 1)}
                    onMouseEnter={() => setActiveStep(item.step - 1)}
                    className={`relative mb-6 transition-all duration-300 ${
                      activeStep === item.step - 1 
                        ? "scale-125 drop-shadow-2xl" 
                        : "scale-100 hover:scale-110"
                    }`}
                  >
                    {/* Glow effect */}
                    {activeStep === item.step - 1 && (
                      <div className={`absolute inset-0 w-20 h-20 bg-gradient-to-r ${item.color} rounded-full blur-xl opacity-60 animate-pulse`}></div>
                    )}
                    
                    {/* Node */}
                    <div className={`relative w-20 h-20 rounded-full flex items-center justify-center cursor-pointer border-4 ${
                      activeStep === item.step - 1
                        ? `bg-gradient-to-r ${item.color} border-white shadow-2xl`
                        : "bg-white border-gray-300 hover:border-green-500 shadow-lg"
                    } transition-all duration-300`}>
                      <item.icon size={32} className={activeStep === item.step - 1 ? "text-white" : "text-gray-600"} />
                    </div>
                  </button>

                  {/* Connecting line */}
                  {idx < 2 && (
                    <div className="hidden md:block absolute top-16 left-[60%] w-20 h-1 bg-gradient-to-r from-green-400 to-emerald-400 shadow-lg"></div>
                  )}

                  {/* Content */}
                  <div className={`text-center transition-all duration-300 ${activeStep === item.step - 1 ? "opacity-100 scale-105" : "opacity-75"}`}>
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mt-4 mb-2">{item.title}</h3>
                    <p className={`text-sm md:text-base ${activeStep === item.step - 1 ? "text-green-600 font-medium" : "text-gray-600"}`}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== COMMUNITY CAROUSEL - GLASSMORPHIC ========== */}
      <section className="py-24 px-6 bg-gradient-to-br from-emerald-50 via-white to-green-50 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute top-20 right-20 w-80 h-80 bg-green-300 rounded-full blur-3xl opacity-10 animate-bounce"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-emerald-300 rounded-full blur-3xl opacity-10" style={{ animation: "bounce 4s infinite 1s" }}></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 tracking-tight">Join Our Community</h2>
            <p className="text-gray-600 text-lg">See what our eco-warriors are achieving</p>
          </div>

          {/* Carousel Container */}
          <div 
            className="relative"
            onMouseEnter={() => setAutoScroll(false)}
            onMouseLeave={() => setAutoScroll(true)}
          >
            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              {[
                {
                  author: "Aarav Sharma",
                  initials: "AS",
                  title: "Cut plastic usage by 50% this month!",
                  impact: "Saved 15 kg CO₂",
                  badges: ["🌱 Eco Hero", "♻️ Sustainable"],
                  gradient: "from-blue-400 to-cyan-500",
                },
                {
                  author: "Priya Verma",
                  initials: "PV",
                  title: "Switched to public transport - feeling great!",
                  impact: "Saved 32 kg CO₂",
                  badges: ["🚴 Active User", "🌍 Global"],
                  gradient: "from-green-400 to-emerald-500",
                },
                {
                  author: "Rohan Gupta",
                  initials: "RG",
                  title: "Started composting kitchen waste",
                  impact: "Saved 8 kg CO₂",
                  badges: ["🌱 Eco Hero", "♻️ Sustainable"],
                  gradient: "from-purple-400 to-pink-500",
                },
              ].map((post, idx) => (
                <div
                  key={idx}
                  className={`group relative transition-all duration-500 transform ${
                    carouselScroll === idx ? "md:scale-105 md:z-20" : "md:scale-95 md:opacity-70"
                  }`}
                >
                  {/* Glassmorphic card */}
                  <div className="relative backdrop-blur-xl bg-white/30 border border-white/40 rounded-3xl p-8 hover:bg-white/50 hover:border-white/60 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-2 overflow-hidden">
                    {/* Gradient background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${post.gradient} opacity-5 rounded-3xl`}></div>

                    {/* Content */}
                    <div className="relative z-10">
                      {/* Profile initials */}
                      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${post.gradient} text-white font-bold text-xl mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        {post.initials}
                      </div>

                      {/* Name */}
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{post.author}</h3>

                      {/* Activity */}
                      <p className="text-gray-700 text-sm md:text-base mb-4 leading-relaxed">{post.title}</p>

                      {/* Impact badge */}
                      <div className="mb-4">
                        <span className="inline-block bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                          {post.impact}
                        </span>
                      </div>

                      {/* Floating badges */}
                      <div className="flex flex-wrap gap-2">
                        {post.badges.map((badge, bidx) => (
                          <div
                            key={bidx}
                            className="relative inline-block text-xs text-gray-700 bg-white/60 px-3 py-1 rounded-full border border-white/40 backdrop-blur-sm group-hover:bg-white/80 transition-all duration-300 animate-pulse"
                            style={{ animationDelay: `${bidx * 200}ms` }}
                          >
                            {badge}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Auto-scroll indicator */}
            <div className="flex justify-center mt-8 gap-2">
              {[0, 1, 2].map((dot) => (
                <button
                  key={dot}
                  onClick={() => {
                    setCarouselScroll(dot);
                    setAutoScroll(false);
                  }}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    carouselScroll === dot 
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 w-8" 
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Explore button */}
          <div className="text-center mt-12">
            <button
              onClick={() => handleProtectedNavigation("/community")}
              className="group relative inline-block px-10 py-4 font-semibold text-lg rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 group-hover:from-green-700 group-hover:to-emerald-700 transition-all duration-300"></div>
              <span className="relative text-white flex items-center gap-2 group-hover:scale-105 transition-transform duration-300">
                Explore Community <Sparkles size={20} className="animate-pulse" />
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* ========== FAQ SECTION ========== */}
      <section id="faq" className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "What is EcoTrack?",
                a: "EcoTrack is a sustainability tracker that helps you monitor your carbon footprint, understand your environmental impact, and build sustainable habits.",
              },
              {
                q: "How is carbon footprint calculated?",
                a: "We calculate based on your daily activities: electricity (0.82 kg CO₂/kWh), transport (0.21 kg CO₂/km), food waste (2.5 kg CO₂/kg), and plastic (6 kg CO₂/kg).",
              },
              {
                q: "Is my data secure?",
                a: "Yes! Your data is encrypted and stored securely. We never share your information with third parties.",
              },
              {
                q: "Can I track weekly reports?",
                a: "Absolutely! Our weekly tracker shows your total carbon impact, best day, improvement percentage, and a timeline of your eco achievements.",
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFAQ(openFAQ === idx ? null : idx)}
                  className="w-full px-6 py-4 flex justify-between items-center hover:bg-green-50 transition"
                >
                  <span className="text-lg font-semibold text-gray-900 text-left">{faq.q}</span>
                  <ChevronDown
                    size={24}
                    className={`text-green-600 transition ${openFAQ === idx ? "rotate-180" : ""}`}
                  />
                </button>
                {openFAQ === idx && (
                  <div className="px-6 py-4 bg-green-50 border-t border-green-100">
                    <p className="text-gray-700 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CONTACT SECTION ========== */}
      <section id="contact" className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Get in Touch</h2>
          <form
            onSubmit={handleContactSubmit}
            className="bg-gray-50 p-8 rounded-2xl shadow-lg border border-gray-200"
          >
            {contactStatus.success && (
              <div className="mb-6 p-4 bg-green-100 border border-green-500 text-green-700 rounded-lg">
                ✓ Message sent successfully! We'll get back to you soon.
              </div>
            )}
            {contactStatus.error && (
              <div className="mb-6 p-4 bg-red-100 border border-red-500 text-red-700 rounded-lg">
                ✗ {contactStatus.error}
              </div>
            )}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <input
                type="text"
                placeholder="Your Name"
                value={contactForm.name}
                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                required
              />
              <input
                type="email"
                placeholder="Your Email"
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                required
              />
            </div>
            <textarea
              placeholder="Your Message (10-1000 characters)"
              rows="5"
              value={contactForm.message}
              onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 mb-6"
              required
            ></textarea>
            <button
              type="submit"
              disabled={contactStatus.loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 text-lg hover:shadow-lg hover:scale-105 cursor-pointer"
            >
              {contactStatus.loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4 text-2xl font-bold">
                <Leaf size={24} className="text-green-400" />
                EcoTrack
              </div>
              <p className="text-gray-400 leading-relaxed">
                Monitor your environmental impact, reduce carbon footprint, and build a sustainable future together.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-lg">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <button onClick={() => navigate("/")} className="hover:text-green-400 transition">
                    Home
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate("/daily")} className="hover:text-green-400 transition">
                    Daily Tracker
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate("/weekly")} className="hover:text-green-400 transition">
                    Weekly Tracker
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate("/community")} className="hover:text-green-400 transition">
                    Community
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-lg">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#faq" className="hover:text-green-400 transition hover:scale-105 inline-block">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-green-400 transition hover:scale-105 inline-block">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#about" className="hover:text-green-400 transition hover:scale-105 inline-block">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#features" className="hover:text-green-400 transition hover:scale-105 inline-block">
                    Features
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-lg">Contact</h4>
              <p className="text-gray-400">Email: ecotrack@gmail.com</p>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="text-center text-gray-400">
              <p>© 2026 EcoTrack. All rights reserved. | Built with 💚 for a sustainable future.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

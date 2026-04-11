import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Leaf, BarChart3, Users, Zap, ChevronDown, LogOut } from "lucide-react";

export default function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [openFAQ, setOpenFAQ] = useState(null);

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ========== NAVBAR ========== */}
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 text-2xl font-bold text-green-600">
            <Leaf size={28} />
            EcoTrack
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#home" className="text-gray-700 hover:text-green-600 transition">
              Home
            </a>
            <button
              onClick={() => navigate("/daily")}
              className="text-gray-700 hover:text-green-600 transition"
            >
              Daily Tracker
            </button>
            <button
              onClick={() => navigate("/weekly")}
              className="text-gray-700 hover:text-green-600 transition"
            >
              Weekly Tracker
            </button>
            <button
              onClick={() => navigate("/community")}
              className="text-gray-700 hover:text-green-600 transition"
            >
              Community
            </button>
            <a href="#faq" className="text-gray-700 hover:text-green-600 transition">
              FAQ
            </a>
            <a href="#contact" className="text-gray-700 hover:text-green-600 transition">
              Contact
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>

          <div className="md:hidden">
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-3 py-2 rounded text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

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
                onClick={() => navigate("/daily")}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 rounded-xl font-semibold transition text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Start Tracking
              </button>
              <button
                onClick={() => navigate("/community")}
                className="border-2 border-green-600 text-green-600 hover:bg-green-50 px-8 py-4 rounded-xl font-semibold transition text-lg hover:shadow-lg hover:scale-105"
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

      {/* ========== FEATURES SECTION ========== */}
      <section className="py-20 px-6 bg-white">
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

      {/* ========== HOW IT WORKS ========== */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: 1, title: "Sign Up / Login", desc: "Create your account and get started" },
              { step: 2, title: "Add Your Daily Data", desc: "Log your daily activities and habits" },
              { step: 3, title: "Get Insights & Improve", desc: "View analytics and receive suggestions" },
            ].map((item) => (
              <div key={item.step} className="bg-white p-8 rounded-2xl shadow-lg text-center">
                <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== COMMUNITY PREVIEW ========== */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Join Our Community
          </h2>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              {
                author: "Aarav Sharma",
                title: "Cut plastic usage by 50% this month!",
                impact: "Saved 15 kg CO₂",
              },
              {
                author: "Priya Verma",
                title: "Switched to public transport - feeling great!",
                impact: "Saved 32 kg CO₂",
              },
              {
                author: "Rohan Gupta",
                title: "Started composting kitchen waste",
                impact: "Saved 8 kg CO₂",
              },
            ].map((post, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-green-50 to-white p-6 rounded-2xl border border-green-100 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-600 rounded-full text-white flex items-center justify-center font-bold">
                    {post.author.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{post.author}</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">{post.title}</p>
                <div className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold inline-block">
                  {post.impact}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <button
              onClick={() => navigate("/community")}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-semibold transition text-lg hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Explore Community
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
            onSubmit={(e) => {
              e.preventDefault();
              alert("Thank you for reaching out! We'll get back to you soon.");
              e.target.reset();
            }}
            className="bg-gray-50 p-8 rounded-2xl shadow-lg border border-gray-200"
          >
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <input
                type="text"
                placeholder="Your Name"
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                required
              />
              <input
                type="email"
                placeholder="Your Email"
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                required
              />
            </div>
            <textarea
              placeholder="Your Message"
              rows="5"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 mb-6"
              required
            ></textarea>
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-semibold transition text-lg"
            >
              Send Message
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
                  <button onClick={() => navigate("/home")} className="hover:text-green-400 transition hover:scale-105">
                    About Us
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate("/home")} className="hover:text-green-400 transition hover:scale-105">
                    Features
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-lg">Contact</h4>
              <p className="text-gray-400 mb-2">Email: ecotrack@google.com</p>
              <p className="text-gray-400">Phone: +1 (555) 123-4567</p>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="text-center text-gray-400">
              <p>© 2024 EcoTrack. All rights reserved. | Built with 💚 for a sustainable future.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

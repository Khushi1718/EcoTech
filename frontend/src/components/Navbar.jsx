import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, LogOut, Leaf } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check auth status
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location]);

  // Track scroll for navbar shrink effect - FIXED WITH USEEFFECT
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavigate = (href) => {
    if (href.startsWith("#")) {
      // For FAQ and Contact, navigate to home with hash
      if (location.pathname !== "/home" && location.pathname !== "/") {
        navigate(`/home${href}`);
      } else {
        // Already on home, just scroll
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    } else {
      // Route navigation
      navigate(href);
      setIsOpen(false);
    }
  };

  const handleLogout = () => {
    // Clear token from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Navigate to login page
    navigate("/login");
  };

  const navLinks = [
    { label: "Home", href: "/home" },
    { label: "Daily Tracker", href: "/daily" },
    { label: "Weekly Tracker", href: "/weekly" },
    { label: "Community", href: "/community" },
    { label: "FAQ", href: "#faq" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-lg py-2" : "bg-white shadow-md py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-2xl text-green-600 hover:text-green-700 transition"
          >
            <Leaf size={28} />
            EcoTrack
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavigate(link.href)}
                className="text-gray-600 hover:text-green-600 transition font-medium text-sm cursor-pointer bg-none border-none hover:scale-105"
              >
                {link.label}
              </button>
            ))}
            {isLoggedIn ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition font-medium text-sm"
              >
                <LogOut size={16} />
                Logout
              </motion.button>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate("/login")}
                  className="text-gray-600 hover:text-green-600 font-medium text-sm hover:scale-105 transition"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition hover:scale-105"
                >
                  Signup
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-600 hover:text-green-600"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden mt-4 space-y-3 pb-4 border-t pt-4"
          >
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavigate(link.href)}
                className="block w-full text-left text-gray-600 hover:text-green-600 transition font-medium cursor-pointer bg-none border-none"
              >
                {link.label}
              </button>
            ))}
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={handleLogout}
              className="flex items-center gap-2 w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition font-medium"
            >
              <LogOut size={16} />
              Logout
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
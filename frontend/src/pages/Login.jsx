
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
// import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Leaf } from "lucide-react";


export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  // const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!identifier.trim() || !password.trim()) {
      alert("Please enter all fields");
      return;
    }

    try {
      console.log("🔄 Attempting login with:", { identifier });
      const response = await axios.post("/api/auth/login", {
        identifier,
        password,
      });

      console.log("✅ Login successful! Response:", response.data);
      const { token, user } = response.data;
      
      console.log("💾 Saving token to localStorage:", token);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      
      console.log("📝 Token in localStorage:", localStorage.getItem("token"));
      console.log("🚀 Navigating to home");
      navigate("/");
    } catch (error) {
        // : any
      console.error("❌ Login error:", error?.response?.data || error.message);
      alert(error?.response?.data?.error || "Login failed");
    }
  };
  const [showPassword, setShowPassword] = useState(false);


  return (
      <div className="h-screen w-screen bg-white flex items-center justify-center m-0 p-0">

    <div className="w-full h-full flex flex-col md:flex-row overflow-hidden">
      
     

<div className="md:w-[58%] bg-gradient-to-br from-green-50 to-white text-gray-900 flex flex-col items-center justify-center relative p-10 md:p-12">
          
          {/* Logo & Branding */}
         <div className="flex flex-col items-center justify-center">
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
    className="flex items-center gap-3 mb-12"
  >
    <Leaf size={48} className="text-green-600" />
    <span className="text-4xl font-bold text-green-600">EcoTech</span>
  </motion.div>
</div>


          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="z-10 space-y-4 md:space-y-5 max-w-md text-center"
          >
            <div className="z-10 space-y-4 md:space-y-5 max-w-md text-center">
  <h1 className="text-5xl md:text-5xl font-extrabold tracking-tight text-gray-900">
    Welcome Back
  </h1>
  <h2 className="text-xl font-semibold text-green-600">
    Track Your Impact
  </h2>
  <p className="text-base text-gray-600 leading-relaxed">
    Continue your sustainability journey. Log in to track your daily activities and progress towards a greener future.
  </p>
</div>

            
          </motion.div>
        </div>

      {/* Right Panel - Login Form */}

      <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
         className="md:w-[52%] flex items-center justify-center p-8 bg-white shadow-xl relative z-10">

          <div className="w-full max-w-md space-y-6">

            {/* Heading */}
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign in</h2>
              <p className="text-gray-600 text-sm">Enter your credentials to continue</p>
            </div>

            {/* FORM */}
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
              {/* Username */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Username or email
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="username@example.com"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 bg-gray-50 hover:bg-white"
                />
              </div>

              {/* Password */}
              <div>
  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
    Password
  </label>
  <div className="relative">
    <input
      type={showPassword ? "text" : "password"}
      id="password"
      name="password"
      placeholder="••••••••"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 bg-gray-50 hover:bg-white"
    />
    <div
      className="absolute right-3 top-2.5 text-gray-500 cursor-pointer"
      onClick={() => setShowPassword(!showPassword)}
    >
      {/* {showPassword ? <EyeOff size={20} /> : <Eye size={20} />} */}
    </div>
  </div>
  <div className="text-right mt-2">
    <a href="#" className="text-sm text-green-600 hover:text-green-800 transition duration-200">
      Forgot password?
    </a>
  </div>
</div>


              {/* Demo Credentials */}
              <div className="flex flex-wrap justify-center gap-2 mt-2 mb-2">
                <button
                  type="button"
                  onClick={() => { setIdentifier('admin@demo.com'); setPassword('admin123'); }}
                  className="px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-100 rounded-full hover:bg-emerald-200 transition-colors border border-emerald-200 shadow-sm"
                >
                  Admin Demo
                </button>
                <button
                  type="button"
                  onClick={() => { setIdentifier('employee@demo.com'); setPassword('emp123'); }}
                  className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors border border-blue-200 shadow-sm"
                >
                  Employee Demo
                </button>
                <button
                  type="button"
                  onClick={() => { setIdentifier('superadmin@demo.com'); setPassword('super123'); }}
                  className="px-3 py-1.5 text-xs font-medium text-purple-700 bg-purple-100 rounded-full hover:bg-purple-200 transition-colors border border-purple-200 shadow-sm"
                >
                  Superadmin Demo
                </button>
              </div>

              {/* Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-700 to-emerald-800 text-white py-3 rounded-md font-semibold text-lg hover:from-green-800 hover:to-emerald-900 transition duration-300 transform hover:scale-105 shadow-lg"
              >
                Sign In
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-4 text-gray-500 text-sm">or</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            {/* Signup link */}
            <p className="text-center text-sm text-gray-600 mt-6">
              Don't have an account?{" "}
              {/* <a href="#" className="text-green-600 hover:text-green-800 font-semibold transition duration-200">
                Create an Account
              </a> */}
              <Link to="/signup" className="text-green-600 hover:text-green-800 font-semibold transition duration-200">
                Create an Account
              </Link>
            </p>
          </div>
        </motion.div>
      </div>

    </div>
  
  );
}

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";


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
      const response = await axios.post("/api/login", {
        identifier,
        password,
      });

      const { token, user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      login(token, user);
      navigate("/");
    } catch (error) {
        // : any
      console.error("Login error:", error?.response?.data || error.message);
      alert(error?.response?.data?.error || "Login failed");
    }
  };
  const [showPassword, setShowPassword] = useState(false);


  return (
  
      <div className="h-screen w-screen bg-[#5b8b5a] flex items-center justify-center m-0 p-0">

    <div className="w-full h-full flex flex-col md:flex-row overflow-hidden">
      
     

<div className="md:w-[58%] bg-[#5b8b5a] text-white flex flex-col items-center justify-center relative p-10 md:p-12">
          
          {/* Image */}
         <div className="flex justify-start">
  <motion.img
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
    src="/assets/3315779.jpg"
    alt="AI-Powered Sustainable Future"
    className="w-[68%] max-w-md mb-8 object-contain drop-shadow-lg"
  />
</div>



          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="z-10 text-center space-y-3 md:space-y-4"
          >
            <div className="z-10 text-left space-y-3 md:space-y-4 max-w-md">
  <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white">
    EcoTech
  </h1>
  <h2 className="text-2xl font-semibold text-white">
    Redefining Sustainability
  </h2>
  <p className="text-md text-white opacity-90 leading-relaxed">
   EcoTech combines AI and environmental data to help people understand their carbon footprint, reduce waste, and build sustainable daily habits.
  </p>
</div>

            
          </motion.div>
        </div>

      {/* Right Panel - Login Form */}

      <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
         className="md:w-[52%] flex items-center justify-center p-8 bg-[#dff0d3] rounded-l-[120px] shadow-xl relative z-10">

          <div className="w-full max-w-md space-y-6">

            {/* Heading */}
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Sign in to your account</h2>
              <p className="text-gray-600 text-sm">Welcome back! Please enter your credentials.</p>
            </div>

            {/* FORM */}
            <form className="space-y-4">
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
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
      placeholder="********"
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
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
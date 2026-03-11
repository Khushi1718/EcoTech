import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

export default function Signup() {
  const [name, setName] = useState("");
  // const [employeeId, setEmployeeId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password.trim()) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const response = await axios.post("/api/signup", {
        name,
        email,
        password,
      });

      alert("Signup successful. Please login to continue.");
      navigate("/login");
    } catch (error) {
      console.error("Signup error:", error?.response?.data || error.message);
      alert(error?.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div className="h-screen w-screen bg-[#5b8b5a] flex items-center justify-center m-0 p-0">

      <div className="w-full h-full flex flex-col md:flex-row overflow-hidden">

        {/* LEFT PANEL */}
        <div className="md:w-[58%] bg-[#5b8b5a] text-white flex flex-col items-center justify-center relative p-10 md:p-12">

          <div className="flex justify-start">
            <motion.img
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              src="/assets/3315779.jpg"
              alt="EcoTech"
              className="w-[68%] max-w-md mb-8 object-contain drop-shadow-lg"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-left space-y-4 max-w-md"
          >
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
              EcoTech
            </h1>

            <h2 className="text-2xl font-semibold">
              Redefining Sustainability
            </h2>

            <p className="text-md opacity-90 leading-relaxed">
              EcoTech combines AI and environmental data to help people understand their carbon footprint, reduce waste, and build sustainable daily habits.
            </p>
          </motion.div>
        </div>


        {/* RIGHT PANEL */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="md:w-[52%] flex items-center justify-center p-8 bg-[#dff0d3] rounded-l-[120px] shadow-xl relative z-10"
        >

          <div className="w-full max-w-md space-y-6">

            {/* Heading */}
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Create your account
              </h2>
              <p className="text-gray-600 text-sm">
                Get started with EcoTech
              </p>
            </div>

            {/* FORM */}
            <form onSubmit={handleSignup} className="space-y-4">

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>

              

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>

              {/* Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-700 to-emerald-800 text-white py-3 rounded-md font-semibold text-lg hover:from-green-800 hover:to-emerald-900 transition duration-300 transform hover:scale-105 shadow-lg"
              >
                Sign Up
              </button>
            </form>

            {/* Login link */}
            <p className="text-center text-sm text-gray-600 mt-6">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-green-600 hover:text-green-800 font-semibold"
              >
                Log In
              </button>
            </p>

          </div>
        </motion.div>

      </div>
    </div>
  );
}

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { motion } from "framer-motion";

// export default function Signup() {
//   const [name, setName] = useState("");
//   const [employeeId, setEmployeeId] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleSignup = async () => {
//     if (!name.trim() || !email.trim() || !employeeId.trim() || !password.trim()) {
//       alert("Please fill in all fields");
//       return;
//     }

//     try {
//       const response = await axios.post("http://localhost:5000/api/signup", {
//         name,
//         email,
//         employee_id: employeeId,
//         password,
//       });

//       alert("Signup successful. Please login to continue.");
//       navigate("/login");
//     } catch (error) { 
//         // : any
//       console.error("Signup error:", error?.response?.data || error.message);
//       alert(error?.response?.data?.error || "Signup failed");
//     }
//   };

//   return (
//       <div className="min-h-screen flex">
//         {/* Left Branding Panel */}
//         <div className="hidden md:flex w-1/2 bg-gradient-to-br from-green-700 to-emerald-800 text-white items-center justify-center px-12">
//           <div className="space-y-6">
//             <h1 className="text-5xl font-extrabold tracking-tight leading-tight">Join EcoTech</h1>
//             <p className="text-lg max-w-md">
//               EcoTech combines AI and environmental data to help people understand their carbon footprint, reduce waste, and build sustainable daily habits.
//             </p>
//           </div>
//         </div>
    
//         {/* Right Signup Form */}
//         <div className="w-full md:w-1/2 flex items-center justify-center bg-white px-8">
//           <motion.div
//             key="signup"
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -30 }}
//             transition={{ duration: 1 }}
//             className="max-w-md w-full"
//           >
//             <div className="space-y-8">
//               <div>
//                 <h2 className="text-3xl font-bold text-gray-800 text-center">Create your account</h2>
//                 <p className="text-sm text-gray-500 text-center mt-2">
//                   Get started with the platform
//                 </p>
//               </div>
    
//               <div className="space-y-5">
//                 <input
//                   type="text"
//                   placeholder="Full Name"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none shadow-sm transition"
//                 />
//                 {/* <input
//                   type="text"
//                   placeholder="Employee ID"
//                   value={employeeId}
//                   onChange={(e) => setEmployeeId(e.target.value.toUpperCase())}
//                   className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none shadow-sm transition"
//                 /> */}
//                 <input
//                   type="email"
//                   placeholder="Email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none shadow-sm transition"
//                 />
//                 <input
//                   type="password"
//                   placeholder="Password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none shadow-sm transition"
//                 />
//                 <button
//                   onClick={handleSignup}
//                   className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-xl shadow-md transition"
//                 >
//                   Sign Up
//                 </button>
//               </div>
    
//               <div className="text-center text-sm text-gray-500">
//                 Already have an account?{" "}
//                 <button
//                   onClick={() => navigate("/login")}
//                   className="text-green-600 hover:underline font-medium"
//                 >
//                   Log In
//                 </button>
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       </div>
//     );
    
 
// }
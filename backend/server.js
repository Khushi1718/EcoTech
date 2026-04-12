// // const express = require("express");
// // const cors = require("cors");
// // const dotenv = require("dotenv");
// // const connectDB = require("./config/db");

// // dotenv.config();

// // const app = express();
// // const PORT = process.env.PORT || 5001;

// // app.use(cors({
// //   origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
// //   methods: ["GET", "POST", "PUT", "DELETE"],
// //   allowedHeaders: ["Content-Type", "Authorization"],
// // }));

// // app.use(express.json());

// // connectDB();

// // app.use("/api", require("./routes/authRoutes"));

// // app.listen(PORT, () => {
// //   console.log(`Server running on port ${PORT}`);
// // });

// const express = require("express");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const connectDB = require("./config/db");

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5001;

// // CORS configuration (frontend connection)
// app.use(cors({
//   origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   allowedHeaders: ["Content-Type", "Authorization"],
// }));

// // Middleware
// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ limit: "10mb", extended: true }));

// // Database connection
// connectDB();

// // ROUTES

// // Authentication routes (login/signup)
// app.use("/api/auth", require("./routes/authRoutes"));

// // Community post routes
// // create post, get posts, like post
// app.use("/api/posts", require("./routes/postRoutes"));

// // SERVER

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// CORS
// app.use(cors());
app.use(cors({
  origin: "https://eco-tech-8a1a.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

app.options("*", cors()); // 🔥 VERY IMPORTANT
// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// DB
connectDB();

// ================= ROUTES =================

// Auth
app.use("/api/auth", require("./routes/authRoutes"));

// Community
app.use("/api/posts", require("./routes/postRoutes"));

// Contact
app.use("/api/contact", require("./routes/contactRoutes"));

// NEW: Daily Tracker
app.use("/api/daily", require("./routes/daily"));

// NEW: Weekly Tracker
app.use("/api/weekly", require("./routes/weekly"));

// Health check (important for production)
app.get("/", (req, res) => {
  res.send("EcoTech API Running 🚀");
});

// ================= SERVER =================

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
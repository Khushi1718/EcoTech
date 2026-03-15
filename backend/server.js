// const express = require("express");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const connectDB = require("./config/db");

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5001;

// app.use(cors({
//   origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   allowedHeaders: ["Content-Type", "Authorization"],
// }));

// app.use(express.json());

// connectDB();

// app.use("/api", require("./routes/authRoutes"));

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

// CORS configuration (frontend connection)
app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Database connection
connectDB();

// ROUTES

// Authentication routes (login/signup)
app.use("/api/auth", require("./routes/authRoutes"));

// Community post routes
// create post, get posts, like post
app.use("/api/posts", require("./routes/postRoutes"));

// SERVER

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

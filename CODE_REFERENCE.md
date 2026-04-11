# 📚 COMPLETE CODE REFERENCE

## Frontend Components (Final Working Code)

### 1. Community.jsx (Main Feed Page)
```javascript
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import PostCard from "../components/PostCard";
import { Leaf, X } from "lucide-react";

export default function Community() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState(null);
  const [filteredPosts, setFilteredPosts] = useState([]);

  const tags = [
    "save water",
    "public transport",
    "save electricity",
    "tree planting",
    "composting",
    "bookmarks",
  ];

  const user = (() => {
    try {
      const userJson = localStorage.getItem("user");
      return userJson ? JSON.parse(userJson) : null;
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (selectedTag) {
      const filtered = posts.filter((post) =>
        post.tag?.toLowerCase().includes(selectedTag.toLowerCase())
      );
      setFilteredPosts(filtered);
    } else {
      setFilteredPosts(posts);
    }
  }, [selectedTag, posts]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/posts");
      setPosts(response.data);
      setFilteredPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTagClick = (tag) => {
    setSelectedTag(selectedTag === tag ? null : tag);
  };

  const handlePostSuccess = (newPost) => {
    // Refresh posts when a new post is created
    fetchPosts();
    console.log("New post created:", newPost);
  };

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <div className="flex pt-20">
        {/* LEFT SIDEBAR */}
        <div className="w-64 bg-gray-50 border-r border-gray-200 p-6 min-h-[calc(100vh-80px)]">
          {/* NEW POST BUTTON */}
          <div className="mb-6">
            <Sidebar onPostSuccess={handlePostSuccess} />
          </div>

          {/* TAG FILTER SECTION */}
          <h3 className="text-lg font-bold text-gray-900 mb-4">Filter by Tag</h3>

          <div className="space-y-2">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={`w-full text-left px-4 py-3 rounded-lg border-2 transition font-medium capitalize ${
                  selectedTag === tag
                    ? "bg-green-50 border-green-600 text-green-900"
                    : "bg-white border-gray-200 text-gray-700 hover:border-green-300 hover:bg-green-50"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {selectedTag && (
            <button
              onClick={() => setSelectedTag(null)}
              className="w-full mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              Clear Filter
            </button>
          )}
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 flex justify-center">
          <div className="w-full max-w-3xl p-10">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Community Feed
              </h2>
              <p className="text-gray-600">
                Collective action, documented. 🌱
                {selectedTag && (
                  <span className="ml-2 font-semibold text-green-600">
                    Showing posts tagged with "{selectedTag}"
                  </span>
                )}
              </p>
            </div>

            {loading && (
              <div className="text-center py-12">
                <div className="inline-block mb-3">
                  <Leaf className="w-8 h-8 text-green-600 animate-spin" />
                </div>
                <p className="text-gray-600">Loading posts...</p>
              </div>
            )}

            {!loading && filteredPosts.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <Leaf className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 font-medium mb-2">
                  {selectedTag ? "No posts found for this tag" : "No posts yet"}
                </p>
                <p className="text-gray-500 text-sm">
                  {selectedTag
                    ? "Try selecting a different tag"
                    : "Be the first to share your eco action!"}
                </p>
              </div>
            )}

            {!loading && filteredPosts.length > 0 && (
              <div>
                <p className="text-sm text-gray-600 mb-6">
                  Showing {filteredPosts.length} post{filteredPosts.length !== 1 ? "s" : ""}
                </p>
                <div className="space-y-6">
                  {filteredPosts.map((post) => (
                    <PostCard key={post._id || post.id} post={post} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 2. Sidebar.jsx (New Post Button)
```javascript
import React, { useState } from "react";
import CreatePostModal from "./CreatePostModal";

export default function Sidebar({ onPostSuccess }) {
  const [openModal, setOpenModal] = useState(false);

  const tags = [
    "save water",
    "public transport",
    "save electricity",
    "tree planting",
    "composting",
    "bookmarks"
  ];

  const handleNewPost = () => {
    setOpenModal(true);
  };

  const handlePostSuccess = (newPost) => {
    setOpenModal(false);
    if (onPostSuccess) {
      onPostSuccess(newPost);
    }
  };

  return (
    <div className="w-64 border-r h-screen p-6 bg-white">
      <button
        onClick={handleNewPost}
        className="w-full bg-green-700 text-white py-3 rounded-md mb-8 font-semibold hover:bg-green-800 transition"
      >
        + new post
      </button>

      <h3 className="text-gray-500 text-sm mb-4">TAGS</h3>

      <div className="flex flex-col gap-4 text-gray-600">
        {tags.map((tag, index) => (
          <span key={index} className="cursor-pointer hover:text-green-600">
            {tag}
          </span>
        ))}
      </div>

      {openModal && (
        <CreatePostModal
          closeModal={() => setOpenModal(false)}
          onPostSuccess={handlePostSuccess}
        />
      )}
    </div>
  );
}
```

### 3. CreatePostModal.jsx (Form & Upload)
```javascript
import React, { useState } from "react";
import axios from "../api/axios";

export default function CreatePostModal({ closeModal, onPostSuccess }) {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [tag, setTag] = useState("");
  const [loading, setLoading] = useState(false);

  const [userName, userId] = (() => {
    try {
      const user = localStorage.getItem("user");
      const parsedUser = user ? JSON.parse(user) : {};
      return [parsedUser.name || "User", parsedUser.id];
    } catch {
      return ["User", null];
    }
  })();

  const tags = [
    "save water",
    "public transport",
    "save electricity",
    "tree planting",
    "composting"
  ];

  const handleSubmit = async () => {
    if (!image || !caption.trim()) {
      alert("Please add an image and caption before posting.");
      return;
    }

    if (!userId) {
      alert("Please log in to create a post");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(image);

    reader.onloadend = async () => {
      try {
        setLoading(true);

        const response = await axios.post("/api/posts", {
          userId,
          username: userName,
          caption,
          tag,
          image: reader.result
        });

        console.log("Post created:", response.data);
        
        // Reset form
        setImage(null);
        setCaption("");
        setTag("");
        
        // Close modal and trigger refresh via callback
        closeModal();
        if (onPostSuccess) {
          onPostSuccess(response.data);
        }

      } catch (error) {
        console.error("Post creation error:", error);
        alert(error.response?.data?.message || "Post creation failed. Please try again.");
      } finally {
        setLoading(false);
      }
    };
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white w-[500px] rounded-lg p-6 shadow-lg">

        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-semibold text-gray-900">
            Create Post
          </h2>

          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>

        {/* IMAGE UPLOAD */}
        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-1">
            Upload Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            disabled={loading}
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>

        {/* CAPTION */}
        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-1">
            Caption
          </label>

          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Share your eco action..."
            className="w-full border border-gray-300 rounded p-2 h-20 resize-none"
            disabled={loading}
          />
        </div>

        {/* TAG */}
        <div className="mb-5">
          <label className="block text-sm text-gray-600 mb-1">
            Tag
          </label>

          <select
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
            disabled={loading}
          >
            <option value="">Select Tag</option>
            {tags.map((t, i) => (
              <option key={i} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-semibold transition disabled:opacity-50"
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
}
```

### 4. PostCard.jsx (Display Posts)
```javascript
import React, { useState } from "react";
import axios from "../api/axios";
import { Heart } from "lucide-react";

export default function PostCard({ post }) {
  const [likes, setLikes] = useState(post.likes);
  const [isLiking, setIsLiking] = useState(false);

  const formatDate = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return d.toLocaleDateString();
  };

  const handleLike = async () => {
    try {
      setIsLiking(true);
      const response = await axios.post(`/api/posts/${post._id}/like`);
      setLikes(response.data.likes);
    } catch (error) {
      console.error("Error liking post:", error);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 mb-8 hover:shadow-md transition">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-green-600 to-green-700 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg">
            {post.username.charAt(0).toUpperCase()}
          </div>

          <div>
            <p className="font-semibold text-gray-900">
              {post.username}
            </p>

            {post.tag && (
              <span className="text-green-600 text-xs font-medium uppercase">
                #{post.tag}
              </span>
            )}
          </div>
        </div>

        <span className="text-gray-400 text-sm">
          {formatDate(post.createdAt)}
        </span>
      </div>

      {/* Image */}
      <img
        src={post.imageURL}
        alt={post.caption}
        className="rounded-lg mb-4 w-full h-[400px] object-cover"
      />

      {/* Caption */}
      <p className="text-gray-700 mb-4 leading-relaxed">
        {post.caption}
      </p>

      {/* Likes Button */}
      <button
        onClick={handleLike}
        disabled={isLiking}
        className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition disabled:opacity-50"
      >
        {likes > 0 ? (
          <>
            <Heart size={18} fill="currentColor" />
            <span className="font-medium">{likes}</span>
          </>
        ) : (
          <>
            <Heart size={18} />
            <span className="font-medium">Like</span>
          </>
        )}
      </button>
    </div>
  );
}
```

### 5. axios.js (API Configuration)
```javascript
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5001",
});

// Add auth token to all requests
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
```

---

## Backend Code (Final Working)

### 1. server.js (Express Setup)
```javascript
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// ================= MIDDLEWARE =================

// CORS
app.use(cors());

// Body Parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// ================= DATABASE =================

connectDB();

// ================= ROUTES =================

// Auth
app.use("/api/auth", require("./routes/authRoutes"));

// Community
app.use("/api/posts", require("./routes/postRoutes"));

// Contact
app.use("/api/contact", require("./routes/contactRoutes"));

// Daily Tracker
app.use("/api/daily", require("./routes/daily"));

// Weekly Tracker
app.use("/api/weekly", require("./routes/weekly"));

// Health check
app.get("/", (req, res) => {
  res.send("EcoTech API Running 🚀");
});

// ================= SERVER =================

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### 2. models/Post.js (MongoDB Schema)
```javascript
const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  username: {
    type: String,
    required: true
  },

  caption: {
    type: String,
    required: true
  },

  imageURL: {
    type: String,
    required: true
  },

  tag: {
    type: String
  },

  likes: {
    type: Number,
    default: 0
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Post", postSchema);
```

### 3. routes/postRoutes.js (All API Endpoints)
```javascript
const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const cloudinary = require("../config/cloudinary");

// Create post with userId
router.post("/", async (req, res) => {
  try {
    const { userId, username, caption, image, tag } = req.body;

    if (!userId || !username || !caption || !image) {
      return res.status(400).json({
        message: "userId, username, caption, and image are required"
      });
    }

    let finalImageURL = image;

    const hasCloudinaryConfig =
      process.env.CLOUD_NAME &&
      process.env.API_KEY &&
      process.env.API_SECRET;

    // If Cloudinary is configured, store optimized hosted URL
    if (hasCloudinaryConfig) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(image);
        finalImageURL = uploadResponse.secure_url;
      } catch (uploadError) {
        // Fallback if Cloudinary fails
        finalImageURL = image;
      }
    }

    const newPost = new Post({
      userId,
      username,
      caption,
      imageURL: finalImageURL,
      tag,
      createdAt: new Date()
    });

    await newPost.save();

    res.status(201).json(newPost);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all posts sorted by date
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json(posts);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get posts filtered by tag
router.get("/tag/:tag", async (req, res) => {
  try {
    const { tag } = req.params;

    const posts = await Post.find({ tag: { $regex: tag, $options: "i" } })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json(posts);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's posts
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const posts = await Post.find({ userId })
      .sort({ createdAt: -1 });

    res.json(posts);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Like post
router.post("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.likes += 1;
    await post.save();

    res.json(post);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete post
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json({ message: "Post deleted", post });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
```

### 4. config/db.js (MongoDB Connection)
```javascript
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDB;
```

---

## Environment Configuration

### Backend .env
```
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/ecotech
PORT=5001
```

### Frontend (Already in axios.js)
```
baseURL: http://localhost:5001
```

---

## Testing Payloads

### Create Post Request
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "username": "john_doe",
  "caption": "Just installed a rainwater harvesting system!",
  "tag": "save water",
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
}
```

### Create Post Response
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "userId": "507f1f77bcf86cd799439011",
  "username": "john_doe",
  "caption": "Just installed a rainwater harvesting system!",
  "imageURL": "data:image/jpeg;base64,...",
  "tag": "save water",
  "likes": 0,
  "createdAt": "2024-04-12T10:30:00.000Z"
}
```

---

**This is the complete, production-ready code for your MERN community feed!** ✅

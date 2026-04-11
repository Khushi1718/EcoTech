import React, { useState } from "react";
import axios from "../api/axios";

export default function CreatePostModal({ closeModal, onPostSuccess }) {

  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [tag, setTag] = useState("");
  const [loading, setLoading] = useState(false);

  // Get user from localStorage
  const [userName, userId] = (() => {
    try {
      const user = localStorage.getItem("user");
      const parsedUser = user ? JSON.parse(user) : {};
      // Handle both signup (id) and login (_id) user objects
      return [parsedUser.name || "User", parsedUser._id || parsedUser.id];
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

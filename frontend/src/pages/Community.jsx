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

  // Get user from localStorage
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

  // Filter posts when selected tag changes
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
    // Optional: Show success notification
    console.log("New post created:", newPost);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* NAVBAR */}
      <Navbar />

      <div className="flex pt-20">
        {/* LEFT SIDEBAR - TAGS + NEW POST BUTTON */}
        <div className="w-64 bg-gray-50 border-r border-gray-200 p-6 flex flex-col items-start gap-0">
          {/* NEW POST BUTTON */}
          <div className="mb-2 w-full">
            <Sidebar onPostSuccess={handlePostSuccess} />
          </div>

          {/* TAG FILTER SECTION */}
          <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Filter by Tag</h3>

          <div className="space-y-2 w-full">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={`w-full text-left px-3 py-2 rounded-lg border border-2 transition font-medium capitalize text-sm ${
                  selectedTag === tag
                    ? "bg-green-100 border-green-500 text-green-700 shadow-sm"
                    : "bg-white border-gray-300 text-gray-600 hover:border-green-400 hover:bg-green-50"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* CLEAR FILTER BUTTON */}
          {selectedTag && (
            <button
              onClick={() => setSelectedTag(null)}
              className="w-full mt-4 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition font-medium flex items-center justify-center gap-2 text-sm border border-red-200"
            >
              <X className="w-4 h-4" />
              Clear Filter
            </button>
          )}
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 flex justify-center">
          {/* CENTERED CONTENT CONTAINER */}
          <div className="w-full max-w-3xl p-10">
            {/* PAGE TITLE */}
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

            {/* LOADING STATE */}
            {loading && (
              <div className="text-center py-12">
                <div className="inline-block mb-3">
                  <Leaf className="w-8 h-8 text-green-600 animate-spin" />
                </div>
                <p className="text-gray-600">Loading posts...</p>
              </div>
            )}

            {/* EMPTY STATE */}
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

            {/* POSTS SECTION */}
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
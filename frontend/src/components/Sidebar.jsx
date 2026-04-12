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

    // Open the modal when button is clicked
    setOpenModal(true);

    // FUTURE OPTION
    // navigate("/create-post")

  };

  const handlePostSuccess = (newPost) => {
    setOpenModal(false);
    // Call parent callback to refresh posts
    if (onPostSuccess) {
      onPostSuccess(newPost);
    }
  };

  return (
    <div className="w-64 border-r p-6 bg-white">

      {/* New Post Button */}

      <button
        onClick={handleNewPost}
        className="w-full bg-green-700 text-white py-3 rounded-md mb-8 font-semibold hover:bg-green-800 transition"
      >
        + new post
      </button>

      {/* Tags */}

    


      {/* MODAL COMPONENT */}

      {openModal && (
        <CreatePostModal
          closeModal={() => setOpenModal(false)}
          onPostSuccess={handlePostSuccess}
        />
      )}

    </div>
  );
}

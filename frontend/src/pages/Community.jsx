import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import PostCard from "../components/PostCard";

export default function Community() {

  // STATE FOR POSTS
  // Later posts will come from backend (MongoDB)
  const [posts, setPosts] = useState([]);

  // FETCH POSTS FROM BACKEND
  useEffect(() => {

    // FUTURE BACKEND CONNECTION
    // API Example: GET /api/posts

    /*
    fetch("http://localhost:5000/api/posts")
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => console.log(err));
    */
    fetch("http://localhost:5001/api/posts")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch posts");
        }

        return res.json();
      })
      .then(data => {
        setPosts(data);
      })
      .catch(err => console.log(err));

  }, []);

  return (

    <div className="bg-gray-100 min-h-screen">

      {/* NAVBAR */}
      <Navbar />

      <div className="flex">

        {/* LEFT SIDEBAR */}
        {/* Contains tags + new post button */}
        <Sidebar />

        {/* MAIN FEED AREA */}
        <div className="flex-1 flex justify-center">

          {/* CENTERED CONTENT CONTAINER */}
          <div className="w-full max-w-3xl p-10">

            {/* PAGE TITLE */}
            <h2 className="text-2xl font-semibold mb-2">
              Community Feed
            </h2>

            <p className="text-gray-500 mb-8">
              collective action, documented.
            </p>

            {/* POSTS SECTION */}
            {/* Later this will render all posts from MongoDB */}

            {posts.map((post) => (
              <PostCard key={post._id || post.id} post={post} />
            ))}


            {/* FUTURE FEATURES */}

            {/* 
            Future Backend Flow:

            User creates post
                ↓
            Image uploaded to Cloudinary
                ↓
            Cloudinary returns image URL
                ↓
            Save data in MongoDB

            {
              userId,
              username,
              imageURL,
              caption,
              tag,
              likes,
              createdAt
            }

            Then frontend fetches posts using:
            GET /api/posts
            */}

          </div>

        </div>

      </div>

    </div>
  );
}
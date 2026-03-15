// import React from "react";

// export default function PostCard() {

//   // ⚡ LATER THIS DATA WILL COME FROM BACKEND API
//   // Example API: GET /posts

//   const post = {
//     username: "maria",
//     tag: "SAVE WATER",
//     time: "2h ago",
//     image:
//       "https://images.unsplash.com/photo-1599059813005-11265ba4b4ce",
//     caption:
//       "Installed a rainwater collection barrel in the backyard. Already saving 200 liters per week for the garden.",
//     likes: 42
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-sm p-5 mb-8">

//       {/* Header */}

//       <div className="flex justify-between items-center mb-4">

//         <div className="flex items-center gap-3">

//           <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center">
//             M
//           </div>

//           <div>

//             <p className="font-semibold text-gray-800">
//               {post.username}
//             </p>

//             <span className="text-green-600 text-sm font-medium">
//               {post.tag}
//             </span>

//           </div>

//         </div>

//         <span className="text-gray-400 text-sm">
//           {post.time}
//         </span>

//       </div>

//       {/* Image */}

//       <img
//         src={post.image}
//         className="rounded-md mb-4 w-full h-[350px] object-cover"
//       />

//       {/* Caption */}

//       <p className="text-gray-700 mb-4">
//         {post.caption}
//       </p>

//       {/* Likes */}

//       <div className="text-gray-500 flex items-center gap-2">
//         ❤️ {post.likes}
//       </div>

//     </div>
//   );
// }
import React, { useState } from "react";

export default function PostCard({ post }) {

  const [likes, setLikes] = useState(post.likes);

  const handleLike = async () => {

    try {

      const res = await fetch(
        `http://localhost:5001/api/posts/${post._id}/like`,
        {
          method: "POST"
        }
      );

      const data = await res.json();

      setLikes(data.likes);

    } catch (error) {
      console.log(error);
    }

  };

  return (

    <div className="bg-white rounded-lg shadow-sm p-5 mb-8">

      {/* Header */}

      <div className="flex justify-between items-center mb-4">

        <div className="flex items-center gap-3">

          <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center">
            {post.username[0]}
          </div>

          <div>

            <p className="font-semibold text-gray-800">
              {post.username}
            </p>

            <span className="text-green-600 text-sm font-medium">
              {post.tag}
            </span>

          </div>

        </div>

      </div>

      {/* Image */}

      <img
        src={post.imageURL}
        className="rounded-md mb-4 w-full h-[350px] object-cover"
      />

      {/* Caption */}

      <p className="text-gray-700 mb-4">
        {post.caption}
      </p>

      {/* Likes */}

      <button
        onClick={handleLike}
        className="text-gray-500 flex items-center gap-2"
      >
        ❤️ {likes}
      </button>

    </div>
  );
}

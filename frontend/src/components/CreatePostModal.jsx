// import React, { useState } from "react";

// export default function CreatePostModal({ closeModal }) {

//   const [image, setImage] = useState(null);
//   const [caption, setCaption] = useState("");
//   const [tag, setTag] = useState("");

//   const tags = [
//     "save water",
//     "public transport",
//     "save electricity",
//     "tree planting",
//     "composting"
//   ];

//   const handleSubmit = async () => {

//     // FUTURE BACKEND FLOW

//     /*
//     1️⃣ Upload image to Cloudinary

//     const formData = new FormData();
//     formData.append("file", image);

//     const cloudinaryResponse = await fetch(CLOUDINARY_URL, {
//       method: "POST",
//       body: formData
//     });

//     const data = await cloudinaryResponse.json();
//     const imageURL = data.secure_url;

//     2️⃣ Send post data to backend

//     fetch("http://localhost:5000/api/posts", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({
//         caption,
//         tag,
//         imageURL
//       })
//     })
//     */

//     console.log({
//       image,
//       caption,
//       tag
//     });

//     closeModal();
//   };

//   return (

//     <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">

//       <div className="bg-white w-[500px] rounded-lg p-6">

//         {/* HEADER */}

//         <div className="flex justify-between items-center mb-5">

//           <h2 className="text-lg font-semibold">
//             Create Post
//           </h2>

//           <button
//             onClick={closeModal}
//             className="text-gray-500"
//           >
//             ✕
//           </button>

//         </div>

//         {/* IMAGE UPLOAD */}

//         <div className="mb-4">

//           <label className="block text-sm text-gray-600 mb-1">
//             Upload Image
//           </label>

//           <input
//             type="file"
//             onChange={(e) => setImage(e.target.files[0])}
//           />

//         </div>

//         {/* CAPTION */}

//         <div className="mb-4">

//           <label className="block text-sm text-gray-600 mb-1">
//             Caption
//           </label>

//           <textarea
//             value={caption}
//             onChange={(e) => setCaption(e.target.value)}
//             placeholder="Share your eco action..."
//             className="w-full border rounded p-2"
//           />

//         </div>

//         {/* TAG */}

//         <div className="mb-5">

//           <label className="block text-sm text-gray-600 mb-1">
//             Tag
//           </label>

//           <select
//             value={tag}
//             onChange={(e) => setTag(e.target.value)}
//             className="w-full border rounded p-2"
//           >

//             <option value="">
//               Select Tag
//             </option>

//             {tags.map((t, i) => (
//               <option key={i} value={t}>
//                 {t}
//               </option>
//             ))}

//           </select>

//         </div>

//         {/* POST BUTTON */}

//         <button
//           onClick={handleSubmit}
//           className="w-full bg-green-700 text-white py-2 rounded"
//         >
//           Post
//         </button>

//       </div>

//     </div>
//   );
// }
import React, { useState } from "react";

export default function CreatePostModal({ closeModal }) {

  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [tag, setTag] = useState("");

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

  const reader = new FileReader();

  reader.readAsDataURL(image);

  reader.onloadend = async () => {

    try {

    const res = await fetch("http://localhost:5001/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: "User",
        caption,
        tag,
        image: reader.result
      })
    });

    if (!res.ok) {
      throw new Error("Failed to create post");
    }

    const data = await res.json();

    console.log(data);

    closeModal();
    window.location.reload();

    } catch (error) {
      console.error(error);
      alert("Post creation failed. Please check backend server and try again.");
    }

  };

};
  return (

    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">

      <div className="bg-white w-[500px] rounded-lg p-6">

        <div className="flex justify-between items-center mb-5">

          <h2 className="text-lg font-semibold">
            Create Post
          </h2>

          <button
            onClick={closeModal}
            className="text-gray-500"
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
            onChange={(e) => setImage(e.target.files[0])}
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
            className="w-full border rounded p-2"
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
            className="w-full border rounded p-2"
          >

            <option value="">
              Select Tag
            </option>

            {tags.map((t, i) => (
              <option key={i} value={t}>
                {t}
              </option>
            ))}

          </select>

        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-green-700 text-white py-2 rounded"
        >
          Post
        </button>

      </div>

    </div>
  );
}

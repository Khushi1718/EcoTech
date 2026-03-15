// const express = require("express");
// const router = express.Router();
// const Post = require("../models/Post");

// // create post
// router.post("/", async (req, res) => {

//   try {

//     const { username, caption, imageURL, tag } = req.body;

//     const newPost = new Post({
//       username,
//       caption,
//       imageURL,
//       tag
//     });

//     await newPost.save();

//     res.json(newPost);

//   } catch (error) {
//     res.status(500).json(error);
//   }

// });

// // get all posts
// router.get("/", async (req, res) => {

//   try {

//     const posts = await Post.find().sort({ createdAt: -1 });

//     res.json(posts);

//   } catch (error) {

//     res.status(500).json(error);

//   }

// });

// // like post
// router.post("/:id/like", async (req, res) => {

//   try {

//     const post = await Post.findById(req.params.id);

//     post.likes += 1;

//     await post.save();

//     res.json(post);

//   } catch (error) {

//     res.status(500).json(error);

//   }

// });

// module.exports = router;
const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const cloudinary = require("../config/cloudinary");

router.post("/", async (req, res) => {

  try {

    const { username, caption, image, tag } = req.body;

    if (!username || !caption || !image) {
      return res.status(400).json({
        message: "username, caption, and image are required"
      });
    }

    let finalImageURL = image;

    const hasCloudinaryConfig =
      process.env.CLOUD_NAME &&
      process.env.API_KEY &&
      process.env.API_SECRET;

    // If Cloudinary is configured, store optimized hosted URL.
    if (hasCloudinaryConfig) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(image);
        finalImageURL = uploadResponse.secure_url;
      } catch (uploadError) {
        // Fallback so post creation still works if Cloudinary is misconfigured.
        finalImageURL = image;
      }
    }

    const newPost = new Post({
      username,
      caption,
      imageURL: finalImageURL,
      tag
    });

    await newPost.save();

    res.status(201).json(newPost);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

});

router.get("/", async (req, res) => {

  try {

    const posts = await Post.find().sort({ createdAt: -1 });

    res.json(posts);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

});

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

module.exports = router;
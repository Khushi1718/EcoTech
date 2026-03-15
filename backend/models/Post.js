const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  
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

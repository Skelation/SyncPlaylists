const mongoose = require("mongoose");


const songSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    artist: {
      type: String,
      required: true,
    },
  });

  const collaboratorSchema = new mongoose.Schema({
    name: {
      type: String,
      required: false,
    },
    id: {
      type: String,
      required: false,
    },
  });
  
  const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    songs: [songSchema],
    date: {
        type: Date,
        default: Date.now,
    },
    author: String,
    collaborators: [collaboratorSchema],
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
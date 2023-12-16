const router = require("express").Router();
const { log } = require("console");
const Post = require('../models/post-model')
const User = require('../models/user-model')


const authCheck = (req,res,next)=>{
     
     console.log(req.originalUrl)
     
     if(!req.isAuthenticated()){
          req.session.returnTo = req.originalUrl;
           res.redirect('/auth/login')    
     }else{
          next();
     }
}

router.get("/",authCheck,async(req,res)=>{
     let postFound = await Post.find({author:req.user._id});
     res.render("profile",{user:req.user,posts:postFound});
});

router.get("/post",authCheck,(req,res)=>{
     res.render("post",{user:req.user});
});


router.post("/post", authCheck, async (req, res) => {
     const { title, songName, artistName, content } = req.body;
   
     // Convert the arrays of song names and artist names into an array of song objects
     const songs = [];
     for (let i = 0; i < songName.length; i++) {
       songs.push({
         name: songName[i],
         artist: artistName[i],
       });
     }
   
     const newPost = new Post({
       title,
       songs,
       content,
       author: req.user._id,
     });
   
     try {
       await newPost.save();
       res.status(200).redirect("/profile");
     } catch (err) {
       req.flash("error_msg", "Error submitting the form.");
       res.redirect("/profile/post");
     }
   });

   router.get("/account",authCheck,(req,res)=>{
    res.render("account",{user:req.user});
  });

   router.get("/editprofile",authCheck,(req,res)=>{
    res.render("editprofile",{user:req.user});
   });

   router.get("/playlist/:id", authCheck, async (req, res) => {
    try {
      const playlistId = req.params.id;
      const playlist = await Post.findById(playlistId);
      if (!playlist) {
        return res.status(404).send("Playlist not found");
      }
      res.render("playlist", { user: req.user, playlist });
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  });

  router.get("/edit/:id", authCheck, async (req, res) => {
    try {
      const playlistId = req.params.id;
      const playlist = await Post.findById(playlistId);
      if (!playlist) {
        return res.status(404).send("Playlist not found");
      }
      res.render("edit", { user: req.user, playlist });
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  });

  router.post("/edit/:playlistId/delete/:songIndex", authCheck, async (req, res) => {
    const { playlistId, songIndex } = req.params;
  
    try {
      // Find the playlist by ID
      const playlist = await Post.findById(playlistId);
  
      // Remove the song at the specified index
      playlist.songs.splice(songIndex, 1);
  
      // Save the updated playlist
      await playlist.save();
  
      // Redirect back to the edit page
      res.redirect(`/profile/edit/${playlistId}`);
    } catch (err) {
      console.error(err);
      req.flash("error_msg", "Error deleting the song.");
      res.redirect(`/profile/edit/${playlistId}`);
    }
  });

  router.post("/editprofile", authCheck, async (req, res) => {
    const { name, gender } = req.body;

    try {
      // Find the user by ID
      const user = await User.findById(req.user._id);

      // Update the user's name and gender
      user.name = name;
      user.gender = gender;

      // Save the updated user
      await user.save();

      // Redirect back to the profile page
      res.redirect("/profile");
    } catch (err) {
      console.error(err);
      req.flash("error_msg", "Error updating the profile.");
      res.redirect("/profile");
    }
  });

  router.post("/edit/:playlistId/add-song", authCheck, async (req, res) => {
    const { playlistId } = req.params;
    const { songName, artistName } = req.body;
  
    try {
      // Find the playlist by ID
      const playlist = await Post.findById(playlistId);
  
      // Add the new song to the playlist
      playlist.songs.push({ name: songName, artist: artistName });
  
      // Save the updated playlist
      await playlist.save();
  
      // Redirect back to the edit page
      res.redirect(`/profile/edit/${playlistId}`);
    } catch (err) {
      console.error(err);
      req.flash("error_msg", "Error adding the song.");
      res.redirect(`/profile/edit/${playlistId}`);
    }
  });

  // In your profile-route.js or a dedicated routes file
router.get("/edit/:playlistId/delete/:songIndex", authCheck, async (req, res) => {
  const { playlistId, songIndex } = req.params;

  try {
    // Find the playlist by ID
    const playlist = await Post.findById(playlistId);

    // Remove the song at the specified index
    playlist.songs.splice(songIndex, 1);

    // Save the updated playlist
    await playlist.save();

    // Redirect back to the edit page
    res.redirect(`/profile/edit/${playlistId}`);
  } catch (err) {
    console.error(err);
    req.flash("error_msg", "Error deleting the song.");
    res.redirect(`/profile/edit/${playlistId}`);
  }
});

router.post("/edit/:playlistId", authCheck, async (req, res) => {
  const { playlistId } = req.params;
  const { newTitle } = req.body;

  try {
    // Find the playlist by ID
    const playlist = await Post.findById(playlistId);

    // Update the playlist title
    playlist.title = newTitle;

    // Save the updated playlist
    await playlist.save();

    // Redirect back to the edit page
    res.redirect(`/profile/edit/${playlistId}`);
  } catch (err) {
    console.error(err);
    req.flash("error_msg", "Error updating the title.");
    res.redirect(`/profile/edit/${playlistId}`);
  }
});

router.get(`/edit/:playlistId/delete`, authCheck, async (req, res) => {
  const { playlistId } = req.params;

  try {
    const playlist = await Post.findById(playlistId);
    console.log(playlist);
    await Post.findByIdAndDelete(playlistId);
    req.flash("success_msg", "Playlist deleted successfully.");
    res.redirect('/profile')

  } catch (err) {
    req.flash("error_msg", "Error deleting the playlist.");
    res.redirect(`/profile/edit/${playlistId}`);
  }
});

module.exports = router;
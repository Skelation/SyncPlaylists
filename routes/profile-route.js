const router = require("express").Router();
const { log } = require("console");
const Post = require('../models/post-model')


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

module.exports = router;
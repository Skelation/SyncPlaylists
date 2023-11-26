const router = require("express").Router();
const passport = require("passport");
const bcrypt = require("bcrypt")
const User = require("../models/user-model")
router.get("/login",(req,res)=>{
      res.render("login",{user:req.name})
});

router.get("/logout",(req,res)=>{
      req.logOut();
      res.redirect("/");
})

router.get("/signup",(req,res)=>{
      res.render("signup",{user:req.user})
})

router.post("/login", passport.authenticate("local",{
      failureRedirect:"/auth/login",
      failureFlash:"Wrong email or password"}),
      (req,res)=>{
            if(req.session.returnTo){
                  let newPath = req.session.returnTo;
                  req.session.returnTo ="";
                  res.redirect(newPath)
            }else{
                  res.redirect("/profile")
            }
      })

router.post("/signup",async(req,res)=>{
      console.log(req.body);
       ;
       let {email,name,password} = req.body;
      const emailExist = await User.findOne({email});
     //check if the data is already in db
     if(emailExist){
        req.flash("error_msg","Email has already been registered");
        res.redirect("/auth/signup");
     }
     let hash = await bcrypt.hash(password,10);
     password = hash;
     let newUser = new User({name,email,password})
     try{
       await newUser.save();
       req.flash("success_msg","Registration succeds. You can login now.");
       res.redirect("/auth/login");
      } catch(err){
            req.flash("error_msg",err.errors.name.properties.message);
            res.redirect("/auth/signup")
     }
      
})

router.get("/google",
     passport.authenticate("google",{
        scope:["profile","email"],
        prompt:"select_account"

     })
);



router.get("/google/redirect",passport.authenticate("google"),(req,res)=>{
      if(req.session.returnTo){
            let newPath = req.session.returnTo;
            req.session.returnTo ="";
            res.redirect(newPath)
      }else{
            res.redirect("/profile")
      }
})

router.get("/github",
passport.authenticate("github",{
      scope:["profile"],
}))

router.get("/github/redirect",passport.authenticate("github",{failureRedirect:'/login'}),(req,res)=>{
      if(req.session.returnTo){
            let newPath = req.session.returnTo;
            req.session.returnTo = "";
            res.redirect(newPath)
      }else{
      res.redirect("/profile");
      }
})

module.exports = router;
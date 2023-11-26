const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const User = require("../models/user-model")
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt")
const GithubStrategy = require("passport-github2");

passport.serializeUser((user,done)=>{
  console.log("Serializing user now");
  done(null,user._id);
})
passport.deserializeUser((_id,done)=>{
    console.log("Deserializing user now");
    User.findById({_id}).then(user=>{
        console.log("Found User")
        done(null,user);
    })
})

passport.use(
  new LocalStrategy((username,password,done)=>{
    console.log(username,password);
      User.findOne({email:username}).then(async(user) =>{
      if(!user){
         return done(null,false);
      }
      await bcrypt.compare(password, user.password, function(err, result){
        if(err){
          return done(null, false)
        }
           if(!result){
             return done(null, false);
           }else{
             return done(null, user)
           }
      });
        
    }).catch((err)=>{
         console.log(err);
         return done(null, false)
    })
  })
);

passport.use(
  new GoogleStrategy({
    clientID: "877648253534-lll7jmdkvju12gjim86hg18e2fbbm7f9.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL:"/auth/google/redirect"
  },
  (acceseToken,refreshToken,profile,done)=>{
      console.log(profile)
      User.findOne({googleID:profile.id}).then((foundUser)=>{
          
          if(foundUser){
            console.log("User already exist");
          done(null,foundUser)
          }else{
             new User({
                 name: profile.displayName,
                 googleID: profile.id,
                 thumbnail: profile.photos[0].value,
                 email:profile.emails[0].value
             })
             .save()
             .then((newUser)=>{
                console.log("New user created.");
                done(null,newUser);
             });
             
          }
      })
  })
  
);

passport.use(new GithubStrategy({
      clientID:"211a65af03008d6d05c0",
      clientSecret:"8379d73b9f8484adebe4205c67c7eaea54f822ca",
      callbackURL:"/auth/github/redirect"
},(accessToken,refreshToken,profile,done)=>{
     console.log(profile);
     User.findOne({githubID:profile.id}).then((foundUser)=>{
         if(foundUser){
             console.log("User exsit")
             done(null,foundUser);
         }else{
            new User({
                name:profile.displayName,
                githubID:profile.id,
                thumbnail:profile.photos[0].value,
                githubUrl:profile.profileUrl,
            }).save().
            then((newUser)=>{
                 console.log("newUserCreate");
                 done(null,newUser)
            })
         }
     })
}))
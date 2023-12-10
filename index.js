const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv= require('dotenv');
dotenv.config();
require("./config/passport");
const authRoute = require("../SyncPlaylists/routes/auth-route")
const profileRoute = require("../SyncPlaylists/routes/profile-route")
const session = require('express-session');
const flash = require('connect-flash')
const passport = require('passport');
app.use(express.static(__dirname + '/'));


app.use(session({ secret: process.env.SECRET }));


mongoose.connect(process.env.MONGO_URL,
{useNewUrlParser:true,
   useUnifiedTopology:true }
).then(
    ()=>{
        console.log("Connect to mongodb Atlas");
    }
).catch(
    (err)=>{
        console.log(err);
    }
);

//middleware
app.set("view engine","ejs");
app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(session({
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
}))


app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    next();
})
app.use("/auth",authRoute)
app.use("/profile",profileRoute)

app.get('/',(req,res)=>{
    
    res.render("index",{user:req.user});
})

app.listen(8080,()=>{
     console.log("success to connect port 8080" )
})
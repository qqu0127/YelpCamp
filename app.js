var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");

var Campground = require("./models/campground"),
    User       = require("./models/user"),
    Comment    = require("./models/comment");

var commentsRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");
    
mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUnintialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser()); 

// requiring routes
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

app.use("/", indexRoutes);
app.use("/campgrounds/:id/comments", commentsRoutes);
app.use("/campgrounds", campgroundRoutes);



//Seed();
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp server is on.");
});




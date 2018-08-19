var express = require("express");
var router = express.Router({mergeParams: true});
var passport = require("passport");
var User = require("../models/user");

// AUTH ROUTES

// SHOW - root page
router.get("/", function(req, res){
    //res.render("landing");
    res.redirect("/campgrounds");
});

// SHOW - sign up
router.get("/register", function(req, res){
    res.render("register");
});

// CREATE - handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");   
         }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds");
        });
    });
});

// SHOW - show login form
router.get("/login", function(req, res){
    res.render("login");
});

// CREATE - handle login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds", 
        failureRedirect: "/login"
    }), 
    function(req, res){
    });

// SHOW - logout route
router.get("/logout", function(req, res){
   req.logout();
   res.redirect("/campgrounds");
});

module.exports = router;
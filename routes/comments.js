var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground.js");
var Comment = require("../models/comment");

// COMMENTS ROUTES

// NEW - comment new
router.get("/new", isLoggedIn, function(req, res){
    //find by camp.ID
    Campground.findById(req.params.id, function(err, found){
        if(err)
            console.log(err);
        else
            res.render("comments/new", {campground: found}); 
    });
});
// CREATE - comment create
router.post("/", isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, foundCamp){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");   
        }
        else{
            Comment.create(req.body.comment, function(err, comment){
                if(err)
                    console.log(err);
                else{
                    foundCamp.comments.push(comment);
                    foundCamp.save();
                    res.redirect("/campgrounds/" + foundCamp._id);
                    
                }
            })
        }
    })
});
// middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated())
        return next();
    else
        res.redirect("/login");
};
module.exports = router;

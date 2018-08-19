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
                    //add username and ID to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    foundCamp.comments.push(comment);
                    foundCamp.save();
                    console.log(comment);
                    res.redirect("/campgrounds/" + foundCamp._id);
                    
                }
            })
        }
    })
});

// EDIT - edit comment
router.get("/:comment_id/edit", function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            console.log(err);
            res.redirect("back");
        }
        else{
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    });
});

// UPDATE - update comment
router.put("/:comment_id", function(req, res){
    
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            console.log(err);
            res.redirect("back");
        }
        else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DELETE - remove comment
router.delete("/:comment_id", function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            console.log(err);
            res.redirect("back");
        }
        else{
            res.render("/campgrounds/" + req.params.id);
        }
    });
});

// MIDDLEWARE
function isLoggedIn(req, res, next){
    if(req.isAuthenticated())
        return next();
    else
        res.redirect("/login");
};
module.exports = router;

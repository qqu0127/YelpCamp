var middlewareObj = {};
var Campground = require("../models/campground.js");
var Comment = require("../models/comment");

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err)
                res.redirect("/campgrounds");
            else{
                //check if user own this post
                if(foundCampground && foundCampground.author.id.equals(req.user._id))
                    next();
                else{
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    }
    else{
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err)
                res.redirect("back");
            else{
                //check if user own this comment
                if(foundComment && foundComment.author.id.equals(req.user._id))
                    next();
                else{
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    }
    else{
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated())
        return next();
    else{
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("/login");
    }
};

module.exports = middlewareObj;
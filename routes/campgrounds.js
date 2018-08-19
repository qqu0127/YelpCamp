var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground.js");

// INDEX - show all campgrounds in a page
router.get("/", function(req, res){
    //access database and show all campgrounds
    Campground.find({}, function(err, allCamp){
        if(err)
            console.log(err);
        else
            res.render("campgrounds/index.ejs", {campgrounds: allCamp});
    });
});

// NEW - show create campground page
router.get("/new", isLoggedIn, function(req, res){
    res.render("campgrounds/new.ejs");
});

// SHOW - show more info about the campground
router.get("/:id", function(req, res){
    //TODO
    //find the campground with given ID and render the show page.
    Campground.findById(req.params.id).populate("comments").exec(function(err, found){
        if(err)
            console.log(err);
        else{
            console.log(found);
            res.render("campgrounds/show", {campground: found});
        }
    });
});

// CREATE - create campground with given info, store to DB and redirect to SHOW
router.post("/", isLoggedIn, function(req, res){
    //create a new camp and save to MongoDB
    var name = req.body.name;
    var url = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    Campground.create({name: name, image: url, description: desc, author: author}, function(err, camp){
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/campgrounds");
        }
    });
});

// EDIT - edit campground route
router.get("/:id/edit", checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err)
            console.log(err);
        else
            res.render("campgrounds/edit", {campground: foundCampground});
    });
});

// UPDATE - update campground
router.put("/:id", checkCampgroundOwnership, function(req, res){
    //find and update
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err)
            res.redirect("/campgrounds");
        else
            res.redirect("/campgrounds/" + req.params.id);
        
    })
    
})

// DESTROY - delete campground
router.delete("/:id", checkCampgroundOwnership, function(req, res){
    //find and remove
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }
        else
            res.redirect("/campgrounds");
    });
});

// MIDDLEWARE

//check if user is logged in
function isLoggedIn(req, res, next){
    if(req.isAuthenticated())
        return next();
    else
        res.redirect("/login");
};

//check ownership
function checkCampgroundOwnership(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err)
                res.redirect("/campgrounds");
            else{
                //check if user own this post
                if(foundCampground && foundCampground.author.id.equals(req.user._id))
                    next();
                else
                    res.redirect("back");
            }
        });
    }
    else{
        res.redirect("back");
    }
}
module.exports = router;
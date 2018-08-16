var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground"),
    User       = require("./models/user"),
    Comment    = require("./models/comment"),
    Seed       = require("./seeds");

mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp server is on.");
});
app.get("/", function(req, res){
    res.render("landing");
});

//INDEX - show all campgrounds in a page
app.get("/campgrounds", function(req, res){
    //access database and show all campgrounds
    Campground.find({}, function(err, allCamp){
        if(err)
            console.log(err);
        else
            res.render("campgrounds/index.ejs", {campgrounds: allCamp});
    });
});

app.get("/campgrounds/new", function(req, res){
    res.render("campgrounds/new.ejs");
    
});

//SHOW - show more info about the campground
app.get("/campgrounds/:id", function(req, res){
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
//CREATE - create campground with given info, store to DB and redirect to SHOW
app.post("/campgrounds", function(req, res){
    //create a new camp and save to MongoDB
    var name = req.body.name;
    var url = req.body.image;
    var desc = req.body.description;
    //var item = {name: name, image: url};
    Campground.create({name: name, image: url, description: desc}, function(err, camp){
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/campgrounds");
        }
    });
});

// COMMENTS ROUTES

app.get("/campgrounds/:id/comments/new", function(req, res){
    //find by camp.ID
    Campground.findById(req.params.id, function(err, found){
        if(err)
            console.log(err);
        else
            res.render("comments/new", {campground: found}); 
    });
});

app.post("/campgrounds/:id/comments", function(req, res){
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
})
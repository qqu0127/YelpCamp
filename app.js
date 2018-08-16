var app = require("express")();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground"),
    User       = require("./models/user"),
    Comment    = require("./models/comment"),
    Seed       = require("./seeds");

mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp server is on.");
});
app.get("/", function(req, res){
    res.render("landing");
});

app.get("/campgrounds", function(req, res){
    //access database and show all campgrounds
    Campground.find({}, function(err, allCamp){
        if(err)
            console.log(err);
        else
            res.render("index", {campgrounds: allCamp});
    });
});

app.get("/campgrounds/new", function(req, res){
    res.render("new.ejs");
    
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
            res.render("show", {campground: found});
        }
    });
    
});
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
    //cmp.push(item);
    
});
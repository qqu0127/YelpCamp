var app = require("express")();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true});

//placeholder fake data 
var cmp = [
    {name: "Salmon Creek", image: "https://recreation-acm.activefederal.com/assetfactory.aspx?did=7460"},
    {name: "Granite Hill", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQFfqSyzNCa9DdWrI4yEoCEceqxBJ7U-pa5wKH48Bv4vETx48W"},
    {name: "Mountain Goat's Rest", image: "http://www.westernlehigh.org/wp-content/uploads/2016/02/campingoutside.png"},
    {name: "Salmon Creek", image: "https://recreation-acm.activefederal.com/assetfactory.aspx?did=7460"},
    {name: "Granite Hill", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQFfqSyzNCa9DdWrI4yEoCEceqxBJ7U-pa5wKH48Bv4vETx48W"},
    {name: "Mountain Goat's Rest", image: "http://www.westernlehigh.org/wp-content/uploads/2016/02/campingoutside.png"},
    {name: "Salmon Creek", image: "https://recreation-acm.activefederal.com/assetfactory.aspx?did=7460"},
    {name: "Granite Hill", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQFfqSyzNCa9DdWrI4yEoCEceqxBJ7U-pa5wKH48Bv4vETx48W"},
    {name: "Mountain Goat's Rest", image: "http://www.westernlehigh.org/wp-content/uploads/2016/02/campingoutside.png"},
    {name: "Salmon Creek", image: "https://recreation-acm.activefederal.com/assetfactory.aspx?did=7460"},
    {name: "Granite Hill", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQFfqSyzNCa9DdWrI4yEoCEceqxBJ7U-pa5wKH48Bv4vETx48W"},
    {name: "Mountain Goat's Rest", image: "http://www.westernlehigh.org/wp-content/uploads/2016/02/campingoutside.png"},
    {name: "Salmon Creek", image: "https://recreation-acm.activefederal.com/assetfactory.aspx?did=7460"},
    {name: "Granite Hill", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQFfqSyzNCa9DdWrI4yEoCEceqxBJ7U-pa5wKH48Bv4vETx48W"},
    {name: "Mountain Goat's Rest", image: "http://www.westernlehigh.org/wp-content/uploads/2016/02/campingoutside.png"}
];

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

//schema setup
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});
var Campground = mongoose.model("Campground", campgroundSchema);
/*
Campground.create(
    {
        name: "Granite Hill", 
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQFfqSyzNCa9DdWrI4yEoCEceqxBJ7U-pa5wKH48Bv4vETx48W",
        description: "This campground is nice."
        
    }, 
    function(err, camp){
        if(err)
            console.log("error");
        else{
            console.log("Newly added campground");
            console.log(camp);
        }
    });
    */
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
    
    //res.render("campgrounds", {campgrounds: cmp});
});

app.get("/campgrounds/new", function(req, res){
    res.render("new.ejs");
    
});

//SHOW - show more info about the campground
app.get("/campgrounds/:id", function(req, res){
    //TODO
    //find the campground with given ID and render the show page.
    Campground.findById(req.params.id, function(err, found){
        if(err)
            console.log(err);
        else{
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
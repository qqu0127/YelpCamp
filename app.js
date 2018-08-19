var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");

var Campground = require("./models/campground"),
    User       = require("./models/user"),
    Comment    = require("./models/comment"),
    Seed       = require("./seeds");

mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUnintialized: false
}));

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser()); 

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp server is on.");
});
app.get("/", function(req, res){
    //res.render("landing");
    res.redirect("/campgrounds");
});

//INDEX - show all campgrounds in a page
app.get("/campgrounds", function(req, res){
    //access database and show all campgrounds
    Campground.find({}, function(err, allCamp){
        if(err)
            console.log(err);
        else
            res.render("campgrounds/index.ejs", {campgrounds: allCamp, currentUser: req.user});
    });
});

app.get("/campgrounds/new", isLoggedIn, function(req, res){
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

app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
    //find by camp.ID
    Campground.findById(req.params.id, function(err, found){
        if(err)
            console.log(err);
        else
            res.render("comments/new", {campground: found}); 
    });
});

app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
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

// AUTH ROUTES

app.get("/register", function(req, res){
    res.render("register");
});
// handle sign up logic
app.post("/register", function(req, res){
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

// show login form

app.get("/login", function(req, res){
    res.render("login");
});

// handle login logic

app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds", 
        failureRedirect: "/login"
    }), 
    function(req, res){
    });
    
app.get("/logout", function(req, res){
   req.logout();
   res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated())
        return next();
    else
        res.redirect("/login");
};
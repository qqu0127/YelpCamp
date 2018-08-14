var app = require("express")();
var bodyParser = require("body-parser");

//placeholder fake data 
var cmp = [
    {name: "Salmon Creek", image: "https://recreation-acm.activefederal.com/assetfactory.aspx?did=7460"},
    {name: "Granite Hill", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQFfqSyzNCa9DdWrI4yEoCEceqxBJ7U-pa5wKH48Bv4vETx48W"},
    {name: "Mountain Goat's Rest", image: "http://www.westernlehigh.org/wp-content/uploads/2016/02/campingoutside.png"}
];

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp server is on.");
});
app.get("/", function(req, res){
    res.render("landing");
});

app.get("/campgrounds", function(req, res){
    
    res.render("campgrounds", {campgrounds: cmp});
});

app.get("/campgrounds/new", function(req, res){
    res.render("new.ejs");
    
})

app.post("/campgrounds", function(req, res){
    //get data from form and add to campgrounds array data
    var name = req.body.name;
    var url = req.body.image;
    var item = {name: name, image: url};
    cmp.push(item);
    res.redirect("/campgrounds");
});
var app = require("express")();
app.set("view engine", "ejs");
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp server is on.");
});
app.get("/", function(req, res){
    res.render("landing");
});

app.get("/campgrounds", function(req, res){
    var cmp = [
        {name: "Salmon Creek", image: ""},
        {name: "Granite Hill", image: ""},
        {name: "Mountain Goat's Rest", image: ""}
        ];
    res.render("campgrounds");
})
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
        {name: "Salmon Creek", image: "https://recreation-acm.activefederal.com/assetfactory.aspx?did=7460"},
        {name: "Granite Hill", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQFfqSyzNCa9DdWrI4yEoCEceqxBJ7U-pa5wKH48Bv4vETx48W"},
        {name: "Mountain Goat's Rest", image: "http://www.westernlehigh.org/wp-content/uploads/2016/02/campingoutside.png"}
        ];
    res.render("campgrounds", {campgrounds: cmp});
})
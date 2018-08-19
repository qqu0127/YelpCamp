var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment    = require("./models/comment");
var data = [
    {   
        name: "Salmon Creek", 
        image: "https://recreation-acm.activefederal.com/assetfactory.aspx?did=7460",
        description: "test"
    },
    {
        name: "Yosemite", 
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQFfqSyzNCa9DdWrI4yEoCEceqxBJ7U-pa5wKH48Bv4vETx48W",
        description: "test666"
    },
    {
        name: "Mountain Goat's Rest", 
        image: "http://www.westernlehigh.org/wp-content/uploads/2016/02/campingoutside.png",
        description: "5678"
    },
    {
        name: "Salmon Creek", 
        image: "https://recreation-acm.activefederal.com/assetfactory.aspx?did=7460",
        description: "66666"
    }
];

function seedDB(){
    Campground.remove({}, function(err){
        if(err)
            console.log(err);
        else{
            console.log("removed.");
            data.forEach(function(seed){
            Campground.create(seed, function(err, campground){
                if(err)
                    console.log(err);
                else{
                    console.log("Added a campground");
                    Comment.create(
                        {
                            text: "This place is great",
                            author: "dev"
                        }, function(err, comment){
                            if(err)
                                console.log(err);
                            else{
                                campground.comments.push(comment);
                                campground.save();
                                console.log("created a new comment");
                            }
                        });
                }
            });
        });
        }
    });
    
}
module.exports = seedDB;
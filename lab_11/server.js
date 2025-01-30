var express = require("express");
var knockknock = require("knock-knock-jokes")
var app = express();

app.use(express.static("public"))

app.get("/", function(req, res){
    res.send("Hello world! by express");
});

app.get("/test", function(req, res){
    res.send("this is route 2");
});

app.get("/joke", function (req, res) {

    var randomJoke = knockknock()
    res.send(randomJoke);
})

app.get("/add", function(req, res) {
    var x = req.query.x;
    var y = req.query.y;
    res.send("X + Y = "+(parseInt(x)+parseInt(y)));
})

app.get("/getform", function(req, res) {
    var name = req.query.name;
    var quest = req.query.quest;
        res.send("Hi "+name+" I am sure you will "+quest);
});

app.listen(8080);
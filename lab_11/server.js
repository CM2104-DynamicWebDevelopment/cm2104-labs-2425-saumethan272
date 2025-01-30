var express = require("epress");
var app = express();

app.get("/", function(req, res){
    res.send("Hello world! by express");
});

app.listen(8080);
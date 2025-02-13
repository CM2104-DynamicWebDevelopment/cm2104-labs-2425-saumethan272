const MongoClient = require('mongodb-legacy').MongoClient;
const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);
const dbname = 'star_wars_quotes';

//code to link to the express module
const express = require('express');
const app = express();

//code to define the public 
app.use(express.static("public"))

var db;

//run the connect method.
connectDB();

async function connectDB() {
    // Use connect method to connect to the server
    await client.connect();
    console.log('Connected successfully to server');
    db = client.db(dbname);
    //everything is good lets start
    app.listen(8080);
}


app.get("/all", function(req, res) {
    db.collection("quotes").find().toArray(function(err, result) {
        if (err) throw err;

        var output = "<h1>All the quotes</h1>";

        for (var i = 0; i < result.length; i++) {
            output += "<div>"
            output += "<h3>" + result[i].name + "</h3>";
            output += "<p>" + result[i].quote + "</p>";
            output += "</div>"
        }
        res.send(output);
    });
});
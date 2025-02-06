var express = require("express");
var app = express();
var SpotifyWebApi = require("spotify-web-api-node");
app.use(express.static("public"))

app.get("/", function(req, res) {
    res.send("Hello world by express")
})
var spotifyApi = new SpotifyWebApi({
    clientId: "6c147d1edb16457cbce816d434b50dd3",
    clientSecret: "6a0dbcf0ba864168b228689c2af0fcdc"
})

// Retrive an acces token 
spotifyApi.clientCredentialsGrant().then(
    function (data) {
        console.log("The access token expres in " + data.body["expires_in"]);
        console.log("The access token is " + data.body["access_token"]);

        
        // Save the access token so that it's used in future calls
        spotifyApi.setAccessToken(data.body["access_token"]);
    },
    function (err) {
        console.log(
            "something went wrong when retrieving an access token", 
            err.message
        );
    }
);

async function getTracks(searchterm, res) {
    spotifyApi.searchTracks(searchterm)
    .then(function (data) {
        res.send(JSON.stringify(data.body));
    }, function (err) {
        console.error(err);
    });
}

// Route for love in tracks, artists and albums
app.get("/searchlove", function (req, res) {
    getTracks("love", res);
});

app.listen(8080)
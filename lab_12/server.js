var express = require("express");
var app = express();
var SpotifyWebApi = require("spotify-web-api-node");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/public/form.html");
});


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

// Route for love in tracks, artists and albums
app.get("/searchlove", function (req, res) {
    getTracks("love", res);
});

// Route for serching in tracks, artists and albums
app.get("/search", function (req, res) {
    var searchterm = req.query.searchterm;
    getTracks(searchterm, res);
});

// Route for handling form submission
app.post("/postform", function (req, res) {
    var searchTerm = req.body.searchTerm;
    getTracks(searchTerm, res);
});

async function getTracks(searchterm, res) {

    spotifyApi.searchTracks(searchterm).then(function (data) {
        var tracks = data.body.tracks.items
        var HTMLResponse = "";
        for(var i=0; i<tracks.length; i++){
            var track = tracks[i];
            console.log(track.name);
            HTMLResponse += `
                    <div>
                        <h2>${track.name}</h2>
                        <h4>${track.artists[0].name}</h4>
                        <img src='${track.album.images[0].url}'>
                        <a href='${track.external_urls.spotify}'>Track Details</a>
                    </div>`;
            console.log(HTMLResponse);
        }
        res.send(HTMLResponse)
    }, function (err) {
        console.error(err);
    });
}

async function getTopTracks(artist, res) {
    spotifyApi.getArtistTopTracks(artist,'GB')
    .then(function (data) {
        console.log(data.body);
    }, function (err) {
        console.log('Something went wrong!', err);
    });
}


app.listen(8080)
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

app.get("/toptracks/:artistId", function (req, res) {
    var artistId = req.params.artistId;
    getTopTracks(artistId, res);
});

app.get("/related/:artistId", function (req, res) {
    var artistId = req.params.artistId;
    getRelated(artistId, res);
});

// Route for handling form submission
app.post("/postform", function (req, res) {
    var searchTerm = req.body.searchTerm;
    getTracks(searchTerm, res);
});

async function getTracks(searchterm, res) {
    spotifyApi.searchTracks(searchterm).then(function (data) {
        var tracks = data.body.tracks.items;
        var HTMLResponse = "<h1>Search Results</h1>";

        for (var i = 0; i < tracks.length; i++) {
            var track = tracks[i];
            var artistId = track.artists[0].id; // Get artist ID

            HTMLResponse += `
                <div>
                    <h2>${track.name}</h2>
                    <h4>${track.artists[0].name}</h4>
                    <img src='${track.album.images[0].url}' width="200">
                    <a href='${track.external_urls.spotify}'>Track Details</a>
                    <br>
                    <a href='/toptracks/${artistId}'>View Top Tracks</a> <!-- Link to Top Tracks -->
                    <br>
                    <a href='/related/${artistId}'>View Related Artists</a> <!-- Link to Related Artists -->
                </div>`;
        }
        res.send(HTMLResponse);
    }, function (err) {
        console.error(err);
        res.send("Error retrieving search results");
    });
}

async function getTopTracks(artistId, res) {
    spotifyApi.getArtistTopTracks(artistId, 'GB')
        .then(function (data) {
            var tracks = data.body.tracks;
            var HTMLResponse = "<h1>Top Tracks</h1>";
            
            for (var i = 0; i < tracks.length; i++) {
                var track = tracks[i];
                HTMLResponse += `
                    <div>
                        <h2>${track.name}</h2>
                        <h4>Album: ${track.album.name}</h4>
                        <img src='${track.album.images[0].url}' width="200">
                        <a href='${track.external_urls.spotify}'>Listen on Spotify</a>
                    </div>`;
            }
            res.send(HTMLResponse);
        })
        .catch(function (err) {
            console.log('Something went wrong!', err);
            res.send("Error fetching top tracks");
        });
}

async function getRelated(artistId, res) {
    console.log("Artist ID:", artistId);  // Log the artist ID to check if it's valid
    spotifyApi.getArtistRelatedArtists(artistId)
        .then(function (data) {
            var artists = data.body.artists;
            var HTMLResponse = "<h1>Related Artists</h1>";

            for (var i = 0; i < artists.length; i++) {
                var artist = artists[i];
                HTMLResponse += `
                    <div>
                        <h2>${artist.name}</h2>
                        <img src='${artist.images.length > 0 ? artist.images[0].url : "https://via.placeholder.com/200"}' width="200">
                        <a href='/toptracks/${artist.id}'>View Top Tracks</a>
                    </div>`;
            }
            res.send(HTMLResponse);
        })
        .catch(function (err) {
            console.log('Something went wrong!', err);
            res.send("Error fetching related artists");
        });
}



app.listen(8080)
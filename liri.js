// require packages
require("dotenv").config();
var axios = require("axios");
var moment = require("moment");
var Spotify = require("node-spotify-api");
var fs = require("fs");
var keys = require("./key.js");

// spotify keys
var spotify = new Spotify(keys.spotify);

// set variables from command line arguments
var command = process.argv[2];
var term = process.argv.slice(3).join(" ");

// switch statements for different commands
function start() {
    switch (command) {
        case "concert-this":
            concertThis();
            break;

        case "spotify-this-song":
            spotifyThis();
            break;

        case "movie-this":
            movieThis();
            break;

        case "do-what-it-says":
            doIt();
            break;
    };
};

function concertThis() {
    // api call to bands in town
    axios.get("https://rest.bandsintown.com/artists/" + term + "/events?app_id=codingbootcamp")
        .then(function (res) {
            // append command to log.txt
            fs.appendFile("log.txt", "\n>>>" + command + " " + term);

            // loop through concerts
            res.data.forEach(show => {
                // store concert data
                var info = "\nArtists: " + show.lineup.join(", ") +
                    "\nLocation: " + show.venue.name + ", " + show.venue.city + ", " + show.venue.region +
                    "\nDate: " + moment(show.datetime).format("MM/DD/YYYY") +
                    "\n\n--------------------------------------";

                // log data and append to log.txt
                console.log(info);
                fs.appendFile("log.txt", "\n" + info);

            });
        })
};

function spotifyThis() {
    // set default search term
    if (term === "") {
        term = "The Sign"
    };

    // api call to spotify
    spotify.search({
        type: 'track',
        query: term
    }, function (err, data) {
        // handle error
        if (err) {
            return console.log('Error occurred: ' + err);
        };

        // append command to log.txt
        fs.appendFile("log.txt", "\n>>>" + command + " " + term);

        // loop through tracks
        data.tracks.items.forEach(track => {
            // store movie data
            var info = "\nArtist(s): " + track.artists[0].name + "\nSong: " + track.name +
                "\nAlbum: " + track.album.name + "\nPreview Link: " + track.preview_url +
                "\n\n--------------------------------------";

            // log track data and append to log.txt
            console.log(info);
            fs.appendFile("log.txt", "\n" + info);
        });
    });
}

function movieThis() {
    // set default search term
    if (term === "") {
        term = "Mr.nobody"
    };

    // api call to omdb
    axios.get("http://www.omdbapi.com/?t=" + term + "&apikey=trilogy")
        .then(function (res) {
            // store movie data
            var info = "\nTitle: " + res.data.Title + "\nYear: " + res.data.Year +
                "\nIMDB: " + res.data.imdbRating + "\nRotten Tomatoes: " + res.data.Ratings[1].Value +
                "\nCountry: " + res.data.Country + "\nLaunguage: " + res.data.Language +
                "\nPlot: " + res.data.Plot + "\nActors: " + res.data.Actors +
                "\n\n--------------------------------------";

            // log data and append to log.txt
            console.log(info);
            fs.appendFile("log.txt", "\n>>>" + command + " " + term + "\n" + info);
        });
};

function doIt() {
    // read file and get new command and term
    fs.readFile("random.txt","utf8", function(err,res) {
        if (err) throw err;
        var text = res.split(",");
        command = text[0];
        term = text[1];

        // append command to log.txt
        fs.appendFile("log.txt", "\n>>>" + command);

        // restart app with new command and term
        start();
    });
}

start();
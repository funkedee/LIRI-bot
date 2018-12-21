// require packages
require("dotenv").config();
var axios = require("axios");
var moment = require("moment");
var spotify = require("node-spotify-api");
var fs = require("fs")

// spotify keys
// var spotify = new Spotify(keys.spotify);

// set variables from command line arguments
var command = process.argv[2];
var term = process.argv.slice(3).join(" ");

// switch statements for different commands
function start() {
    switch(command) {
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
    .then(function(res) {
        res.data.forEach(show => {
            var info ="\nArtists: " + show.lineup.join(", ") +
            "\nLocation: " + show.venue.name + ", " + show.venue.city + ", " + show.venue.region +
            "\nDate: " + moment(show.datetime).format("MM/DD/YYYY")+
            "\n\n--------------------------------------";
            console.log(info);
            fs.appendFile("log.txt", command + "\n" + info);
        
        });
    })
};

start();


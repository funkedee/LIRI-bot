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
        // append command to log.txt
        fs.appendFile("log.txt", "\n>>>" + command + " " + term);

        // loop through concerts
        res.data.forEach(show => {
            // store concert data
            var info ="\nArtists: " + show.lineup.join(", ") +
            "\nLocation: " + show.venue.name + ", " + show.venue.city + ", " + show.venue.region +
            "\nDate: " + moment(show.datetime).format("MM/DD/YYYY")+
            "\n\n--------------------------------------";
            
            // log data and append to log.txt
            console.log(info);
            fs.appendFile("log.txt", "\n" + info);
        
        });
    })
};

function movieThis() {
    // set default search term
    if (term === ""){
        term = "Mr.nobody"
    };

    // api call to omdb
    axios.get("http://www.omdbapi.com/?t=" + term + "&apikey=trilogy")
    .then(function(res){
        // store movie data
        var info =  "\nTitle: " + res.data.Title + "\nYear: " + res.data.Year +
        "\nIMDB: "+ res.data.imdbRating + "\nRotten Tomatoes: " + res.data.Ratings[1].Value +
        "\nCountry: " + res.data.Country + "\nLaunguage: " + res.data.Language +
        "\nPlot: " + res.data.Plot + "\nActors: " + res.data.Actors +
        "\n\n--------------------------------------";

        // log data and append to log.txt
        console.log(info);
        fs.appendFile("log.txt", "\n>>>" + command + " " + term + "\n" + info);
    })
}

start();


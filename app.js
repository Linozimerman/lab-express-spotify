require('dotenv').config();

const express = require('express');
const hbs = require('hbs');


// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const CLIENT_ID= process.env.MONGO_URI
const CLIENT_SECRET= process.env.MONGO_URI
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));
// Our routes go here:
app.get("/home", (req, res) => {
    res.render("home");
    spotifyApi
    .searchArtists(req) ////
    .then(function(data) {
        //console.log('The received data from the API: ', data.body);
        // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
        //res.send(`this is the artist ${artist}`)
        res.render("artist-search", data)
    }, function(err){
        console.error(err);
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get("/artist-search", (req, res) => {
    //console.log("console log de req:",req)
    const artist = req.query.searchArtist;
    //console.log("console log de artist:", artist);
    spotifyApi
    .searchArtists(artist)
    .then((result)=>{
        //console.log("ESTE ES EL RESULT ",result)
        //console.log("esto sale!", result.body.artists)
        const artistas = result.body.artists.items;
        //console.log("console log de {artistas}",{artistas})
        res.render("artist-search", {artistas});
    })
    .catch((error)=> console.log(error))
})

app.get("/albums/:artistId", (req, res) => {
    const id = req.params.artistId;
    spotifyApi.getArtistAlbums(id) 
    .then((results2)=>{
        //console.log("estos son los Albums",results2.body)
        res.render("albums",{results2});
        console.log("ACA ESTOY",results2.body.items[0].name)
    })
    .catch((error)=> console.log(error))
})


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));

const youtubePlaylist = /^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/;
const spotify = /^https?:\/\/open\.spotify\.com\/(.*)$/;
const spotifyTrack = /^https?:\/\/open\.spotify\.com\/track\/(.*)$/;
const spotifyPlaylist = /^https?:\/\/open\.spotify\.com\/playlist\/(.*)$/;

function isPlaylist(url) {
    return youtubePlaylist.test(url);
} 

function isSpotify(url) {
    return spotify.test(url);
}

function isSpotifyTrack(url) {
    return spotifyTrack.test(url);
}

function isSpotifyPlaylist(url) {
    return spotifyPlaylist.test(url);
}

module.exports = {
    isPlaylist,
    isSpotify,
    isSpotifyTrack,
    isSpotifyPlaylist
}
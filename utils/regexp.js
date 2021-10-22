const youtubeTrackId = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
const youtubeTrack = /^https?:\/\/(www.youtube.com|youtube.com)\/watch(.*)$/;
const youtubePlaylist = /^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/;
const spotify = /^https?:\/\/open\.spotify\.com\/(.*)$/;
const spotifyTrack = /^https?:\/\/open\.spotify\.com\/track\/(.*)$/;
const spotifyPlaylist = /^https?:\/\/open\.spotify\.com\/playlist\/(.*)$/;

function matchYoutubeTrackId(url) {
    const result = url.match(youtubeTrackId);
    if (result) return result[7];
}

function isYoutubeTrack(url) {
    return youtubeTrack.test(url);
}

function isYoutubePlaylist(url) {
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
    isYoutubeTrack,
    matchYoutubeTrackId,
    isYoutubePlaylist,
    isSpotify,
    isSpotifyTrack,
    isSpotifyPlaylist
}
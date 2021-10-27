const urlCheck = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/
const youtubeTrackId = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
const youtubeTrack = /^https?:\/\/(www.youtube.com|youtube.com)\/watch(.*)$/;
const youtubePlaylist = /^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/;
const spotify = /^https?:\/\/open\.spotify\.com\/(.*)$/;
const spotifyTrack = /^https?:\/\/open\.spotify\.com\/track\/(.*)$/;
const spotifyPlaylist = /^https?:\/\/open\.spotify\.com\/playlist\/(.*)$/;
const spotifyAlbum = /^https?:\/\/open\.spotify\.com\/album\/(.*)$/;

function matchYoutubeTrackId(url) {
    const result = url.match(youtubeTrackId);
    if (result) return result[7];
}

function isUrl(url) {
    return urlCheck.test(url)
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


function isSpotifyAulbum(url) {
    return spotifyAlbum.test(url);
}

module.exports = {
    isYoutubeTrack,
    matchYoutubeTrackId,
    isYoutubePlaylist,
    isSpotify,
    isSpotifyTrack,
    isSpotifyPlaylist,
    isUrl,
    isSpotifyAulbum
}
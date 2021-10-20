const ytsr = require('ytsr');
const ytpl = require('ytpl');
const SpotifyWebApi = require('spotify-web-api-node');


const spotify = new SpotifyWebApi({
    clientId: '8cf20745c9164fc38fc928e911f7969f',
    clientSecret: '1799a9145bd94a3895853735f7eda5dd'
});

spotify.clientCredentialsGrant().then(
  function(data) {
    console.log('The access token expires in ' + data.body['expires_in']);
    console.log('The access token is ' + data.body['access_token']);

    // Save the access token so that it's used in future calls
    spotify.setAccessToken(data.body['access_token']);
  },
  function(err) {
    console.log('Something went wrong when retrieving an access token', err);
  }
);


/**
 * 
 * @param { String } string 
 */
async function getTrackData(string) {
    // const filters = await ytsr.getFilters(string);
    // const filter = filters.get('Type').get('Video');
    const filter = 'https://www.youtube.com/results?search_query='.concat(string).concat('&sp=EgIQAQ%253D%253D');
    const videos = await ytsr(filter, { limit: 1 });
    return videos;
}

/**
 * 
 * @param { String } string 
 * @param { Number } amount 
 */
async function getMultipleTrackData(string, amount) {
    // const filters = await ytsr.getFilters(string);
    // const filter = filters.get('Type').get('Video');
    const filter = 'https://www.youtube.com/results?search_query='.concat(string).concat('&sp=EgIQAQ%253D%253D');
    const videos = await ytsr(filter, { limit: amount });
    return videos;
}

/**
 * 
 * @param { String } string 
 */
async function getPlaylistData(string) {
    // const filters = await ytsr.getFilters(string);
    // const filter = filters.get('Type').get('Playlist')
    const videos = await ytpl(string, { page: 1 });
    return videos;
}

/**
 * 
 * @param { String } string 
 * @returns Spotify track data
 */
async function getSpotifyTrack(string) {
    const match = /(?<=track\/)(.*)(?=\?)/;
    const result = string.match(match);
    const data = await spotify.getTrack(result[0]);
    return data;
}

async function getSpotifyPlaylist(string) {
    const match = /(?<=playlist\/)(.*)(?=\?)/;
    const result = string.match(match);
    const data = await spotify.getPlaylistTracks(result[0], { limit: 20 });
    return data;
}

module.exports = {
    getMultipleTrackData,
    getPlaylistData,
    getTrackData,
    getSpotifyTrack,
    getSpotifyPlaylist
}
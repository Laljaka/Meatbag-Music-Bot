const ytsr = require('ytsr');
const ytpl = require('ytpl');
const SpotifyWebApi = require('spotify-web-api-node');
const { matchYoutubeTrackId } = require('./regexp');
const dotenv = require('dotenv');

dotenv.config();

class GoodSpotifyWebApi extends SpotifyWebApi {
    constructor(options) {
        super(options);
        this.expired = true;
    }

    async update() {
        try {
            const data = await this.clientCredentialsGrant()
            console.log('The access token expires in ' + data.body['expires_in']);
            console.log('The access token is ' + data.body['access_token']);
            
            // Save the access token so that it's used in future calls
            this.setAccessToken(data.body['access_token']);
            this.expired = false;
            setTimeout(() => {this.expired = true}, 60*60*1000);
        } catch (err) {console.log('Something went wrong when retrieving an access token', err)}
    }
}


const spotify = new GoodSpotifyWebApi({
    clientId: process.env.SPOTIFYID,
    clientSecret: process.env.SPOTIFYSECRET
});

spotify.update();


/**
 * 
 * @param { String } string 
 */

//TODO EXTRACT VIDEO ID FROM EVERY URL done?
async function getTrackData(string) {
    console.time('data')
    // const filters = await ytsr.getFilters(string);
    // const filter = filters.get('Type').get('Video');
    const filter = 'https://www.youtube.com/results?search_query=' + string + '&sp=EgIQAQ%253D%253D';
    const videos = await ytsr(filter, { limit: 1 });
    console.timeEnd('data');
    return videos;
}

async function getTrackDataById(string) {
    // const filter = matchYoutubeTrackId(string);
    const videos = await ytsr(string, { limit: 1 });
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
    const filter = 'https://www.youtube.com/results?search_query=' + string + '&sp=EgIQAQ%253D%253D';
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
    if (spotify.expired) await spotify.update();
    const match = /(?<=track\/)(.*)(?=\?)/;
    const result = string.match(match);
    const data = await spotify.getTrack(result[0]);
    return data;
}

async function getSpotifyPlaylist(string) {
    if (spotify.expired) await spotify.update();
    const match = /(?<=playlist\/)(.*)(?=\?)/;
    const result = string.match(match);
    const data = await spotify.getPlaylistTracks(result[0], { limit: 40 });
    return data;
}

async function getSpotifyAlbum(string) {
    if (spotify.expired) await spotify.update();
    const match = /(?<=album\/)(.*)(?=\?)/;
    const result = string.match(match);
    const data = await spotify.getAlbumTracks(result[0], { limit: 40 });
    return data;
}

module.exports = {
    getMultipleTrackData,
    getPlaylistData,
    getTrackData,
    getSpotifyTrack,
    getSpotifyPlaylist,
    getTrackDataById,
    getSpotifyAlbum
}
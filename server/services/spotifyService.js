const fetch = require('node-fetch');
const qs = require('querystring');
require('dotenv').config();

let token = null;
let tokenExpiry = 0;

async function getAccessToken() {
  const now = Date.now();
  if (token && now < tokenExpiry) return token;

  if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
    console.error('Spotify credentials missing in .env');
    throw new Error('Spotify credentials missing');
  }

  const creds = qs.stringify({
    grant_type: 'client_credentials',
    client_id: process.env.SPOTIFY_CLIENT_ID,
    client_secret: process.env.SPOTIFY_CLIENT_SECRET,
  });

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: creds,
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Spotify token request failed:', res.status, errorText);
    throw new Error(`Spotify token request failed: ${res.status} - ${errorText}`);
  }

  const data = await res.json();
  token = data.access_token;
  tokenExpiry = now + data.expires_in * 1000;
  console.log('Spotify access token obtained');
  return token;
}
function extractSpotifyId(url) {
  if (!url) return null;

  try {
    const parsed = new URL(url);
    const parts = parsed.pathname.split('/');
    const index = parts.findIndex((part) => part === 'playlist');
    return index !== -1 ? parts[index + 1] : null;
  } catch (e) {
    console.error('Invalid URL:', url);
    return null;
  }
}

async function getPlaylistTracks(playlistUrl) {
  const playlistId = extractSpotifyId(playlistUrl);
  if (!playlistId) {
    console.error('Invalid Spotify URL:', playlistUrl);
    return [];
  }

  try {
    const accessToken = await getAccessToken();
    let tracks = [];
    let next = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=100`;

    while (next) {
      const res = await fetch(next, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error(`Spotify API error for playlist ${playlistId}: ${res.status} - ${errorText}`);
        throw new Error(`Failed to fetch tracks for playlist ${playlistId}: ${res.status} - ${errorText}`);
      }

      const json = await res.json();
      json.items.forEach((item) => {
        if (item.track?.name) tracks.push(item.track.name);
      });
      next = json.next;
    }

    console.log(`Fetched ${tracks.length} tracks for playlist ${playlistId}`);
    return tracks;
  } catch (error) {
    console.error('Error fetching playlist tracks:', error.message);
    return [];
  }
}

module.exports = { getPlaylistTracks, extractSpotifyId };
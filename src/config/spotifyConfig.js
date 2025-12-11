/**
 * Spotify Web API Configuration
 * Uses environment variables for client ID
 * NO CLIENT SECRET - using PKCE flow for SPAs
 */

export const spotifyConfig = {
  clientId: import.meta.env.VITE_SPOTIFY_CLIENT_ID || '',
  redirectUri: `${window.location.origin}${import.meta.env.BASE_URL || '/'}`,
  scopes: [
    'user-read-currently-playing',
    'user-read-playback-state',
    'user-top-read',
  ],
  apiBaseUrl: 'https://api.spotify.com/v1',
  authBaseUrl: 'https://accounts.spotify.com',
};

export const getAuthUrl = () => {
  return `${spotifyConfig.authBaseUrl}/authorize`;
};

export const getTokenUrl = () => {
  return `${spotifyConfig.authBaseUrl}/api/token`;
};


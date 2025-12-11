/**
 * Backend API Configuration
 * 
 * TODO: Update BACKEND_URL for production deployment
 * For local development, backend runs on http://localhost:3001
 * For production, update this to your backend server URL
 */

const isDevelopment = import.meta.env.DEV;
export const BACKEND_URL = isDevelopment 
  ? 'http://localhost:3001'
  : 'https://your-backend-server.com'; // TODO: Update with your production backend URL

export const API_ENDPOINTS = {
  login: `${BACKEND_URL}/auth/login`,
  callback: `${BACKEND_URL}/auth/callback`,
  status: `${BACKEND_URL}/auth/status`,
  logout: `${BACKEND_URL}/auth/logout`,
  nowPlaying: `${BACKEND_URL}/spotify/now-playing`,
  topTracks: `${BACKEND_URL}/spotify/top-tracks`,
};


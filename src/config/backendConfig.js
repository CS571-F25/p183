/**
 * Backend API Configuration
 * 
 * This file manages the backend URL for both development and production.
 * 
 * Development:
 *   - Uses http://127.0.0.1:3001 (local backend server)
 *   - VITE_BACKEND_URL is not set in dev, so it falls back to localhost
 * 
 * Production:
 *   - Uses VITE_BACKEND_URL from .env.production if set
 *   - Falls back to https://shivani-spotify-backend.onrender.com if not set
 *   - When building: npm run build reads .env.production
 */

const BACKEND_BASE_URL =
  import.meta.env.VITE_BACKEND_URL ||
  (import.meta.env.DEV 
    ? 'http://127.0.0.1:3001' 
    : 'https://shivani-spotify-backend.onrender.com');

export { BACKEND_BASE_URL };

export const API_ENDPOINTS = {
  login: `${BACKEND_BASE_URL}/auth/login`,
  callback: `${BACKEND_BASE_URL}/auth/callback`,
  status: `${BACKEND_BASE_URL}/auth/status`,
  logout: `${BACKEND_BASE_URL}/auth/logout`,
  nowPlaying: `${BACKEND_BASE_URL}/spotify/now-playing`,
  topTracks: `${BACKEND_BASE_URL}/spotify/top-tracks?time_range=short_term&limit=5`,
  recentlyPlayed: `${BACKEND_BASE_URL}/spotify/recently-played?limit=1`,
  contact: `${BACKEND_BASE_URL}/contact/send`,
};


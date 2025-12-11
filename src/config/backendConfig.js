/**
 * Backend API Configuration
 * 
 * This file manages the backend URL for both development and production.
 * 
 * Development:
 *   - If VITE_BACKEND_URL is not set, defaults to http://127.0.0.1:3001
 *   - This matches the local backend server running in the server/ folder
 * 
 * Production:
 *   - Set VITE_BACKEND_URL environment variable to your deployed backend URL
 *   - Example: VITE_BACKEND_URL=https://shivani-spotify-backend.onrender.com
 *   - This will be used when building for production (npm run build)
 * 
 * To set for production build:
 *   1. Create a .env.production file in the root directory
 *   2. Add: VITE_BACKEND_URL=https://your-backend-domain.com
 *   3. Run: npm run build
 *   4. The built files in docs/ will use this URL
 */

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:3001";

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


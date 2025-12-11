/**
 * Spotify Backend Server
 * Handles Spotify OAuth Authorization Code Flow
 * 
 * ENVIRONMENT VARIABLES REQUIRED (in server/.env):
 * - SPOTIFY_CLIENT_ID: Your Spotify app client ID from https://developer.spotify.com/dashboard
 * - SPOTIFY_CLIENT_SECRET: Your Spotify app client secret
 * - SPOTIFY_REDIRECT_URI: Must be EXACTLY "http://127.0.0.1:3001/auth/callback" for local dev
 *   IMPORTANT: Spotify no longer allows localhost; use 127.0.0.1
 *   This exact URI must be added to your Spotify Dashboard → Redirect URIs
 * - FRONTEND_URL: Frontend URL (defaults to http://localhost:5173)
 * - PORT: Server port (optional, defaults to 3001)
 * 
 * SPOTIFY DASHBOARD SETUP:
 * 1. Go to https://developer.spotify.com/dashboard
 * 2. Click on your app
 * 3. Under "Redirect URIs", add: http://127.0.0.1:3001/auth/callback
 * 4. Save changes
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// fetch is built-in in Node 18+, no import needed

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration - allow requests from frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

// In-memory token storage (for this project, single-user is fine)
// In production, you'd use a database
let tokenStore = {
  accessToken: null,
  refreshToken: null,
  expiresAt: null,
  state: null, // For CSRF protection
};

// Read Spotify credentials from environment variables
// These MUST be set in server/.env file
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const SPOTIFY_REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const SPOTIFY_AUTH_BASE = 'https://accounts.spotify.com';
const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

// Scopes needed for the app
const SCOPES = [
  'user-read-currently-playing',
  'user-read-playback-state',
  'user-top-read',
].join(' ');

/**
 * GET /auth/login
 * Initiates Spotify authorization flow
 * Redirects user to Spotify's authorization page
 * 
 * Dev redirect URI must be http://127.0.0.1:3001/auth/callback (matches SPOTIFY_REDIRECT_URI)
 */
app.get('/auth/login', (req, res) => {
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REDIRECT_URI) {
    return res.status(500).json({ 
      error: 'Spotify credentials not configured. Please set SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, and SPOTIFY_REDIRECT_URI in server/.env' 
    });
  }

  const state = generateRandomString(16);
  // Store state in memory (for this simple implementation)
  // In production, use proper session storage
  tokenStore.state = state;

  // Build authorize URL using redirect_uri from environment variable
  // This ensures we use 127.0.0.1 instead of localhost (required by Spotify)
  const authUrl = new URL(`${SPOTIFY_AUTH_BASE}/authorize`);
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('client_id', SPOTIFY_CLIENT_ID);
  authUrl.searchParams.append('scope', SCOPES);
  authUrl.searchParams.append('redirect_uri', SPOTIFY_REDIRECT_URI);
  authUrl.searchParams.append('state', state);

  res.redirect(authUrl.toString());
});

/**
 * GET /auth/callback
 * Handles Spotify's redirect after authorization
 * Exchanges authorization code for access token
 */
app.get('/auth/callback', async (req, res) => {
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REDIRECT_URI) {
    console.error('Spotify credentials not configured in .env');
    return res.status(500).send('Server configuration error');
  }

  const { code, state, error } = req.query;

  if (error) {
    return res.redirect(`${FRONTEND_URL}/p183/#/now?error=${encodeURIComponent(error)}`);
  }

  if (!code) {
    return res.redirect(`${FRONTEND_URL}/p183/#/now?error=no_code`);
  }

  // Verify state parameter (CSRF protection)
  if (state !== tokenStore.state) {
    console.error('State mismatch - possible CSRF attack');
    return res.redirect(`${FRONTEND_URL}/p183/#/now?error=state_mismatch`);
  }
  
  // Clear state after use
  tokenStore.state = null;

  try {
    // Exchange code for token using credentials from environment
    const tokenResponse = await fetch(`${SPOTIFY_AUTH_BASE}/api/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: SPOTIFY_REDIRECT_URI,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error('Token exchange error:', errorData);
      return res.redirect(`${FRONTEND_URL}/p183/#/now?error=token_exchange_failed`);
    }

    const tokenData = await tokenResponse.json();

    // Store tokens server-side
    tokenStore = {
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresAt: Date.now() + (tokenData.expires_in * 1000),
    };

    // Redirect back to frontend Now page after successful auth
    // Frontend is at FRONTEND_URL, using hash router with /p183/#/now
    res.redirect(`${FRONTEND_URL}/p183/#/now?auth=success`);
  } catch (error) {
    console.error('Callback error:', error);
    res.redirect(`${FRONTEND_URL}/p183/#/now?error=server_error`);
  }
});

/**
 * GET /spotify/now-playing
 * Returns currently playing track or null
 */
app.get('/spotify/now-playing', async (req, res) => {
  try {
    const token = await getValidToken();
    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const response = await fetch(`${SPOTIFY_API_BASE}/me/player/currently-playing`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.status === 204) {
      // 204 means nothing is currently playing
      return res.json(null);
    }

    if (!response.ok) {
      throw new Error(`Spotify API error: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Now playing error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /spotify/top-tracks
 * Returns top tracks (medium-term, limit 10)
 */
app.get('/spotify/top-tracks', async (req, res) => {
  try {
    const token = await getValidToken();
    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const timeRange = req.query.time_range || 'medium_term';
    const limit = req.query.limit || 10;

    const response = await fetch(
      `${SPOTIFY_API_BASE}/me/top/tracks?time_range=${timeRange}&limit=${limit}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Spotify API error: ${response.status}`);
    }

    const data = await response.json();
    // Add rank to each track
    const tracksWithRank = data.items.map((track, index) => ({
      ...track,
      rank: index + 1,
    }));
    res.json(tracksWithRank);
  } catch (error) {
    console.error('Top tracks error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /auth/status
 * Returns authentication status
 */
app.get('/auth/status', (req, res) => {
  res.json({
    authenticated: !!tokenStore.accessToken,
    expiresAt: tokenStore.expiresAt,
  });
});

/**
 * POST /auth/logout
 * Clears stored tokens
 */
app.post('/auth/logout', (req, res) => {
  tokenStore = {
    accessToken: null,
    refreshToken: null,
    expiresAt: null,
  };
  res.json({ success: true });
});

/**
 * Helper: Get valid access token, refreshing if necessary
 */
async function getValidToken() {
  if (!tokenStore.accessToken) {
    return null;
  }

  // Check if token is expired (with 5 minute buffer)
  if (Date.now() >= (tokenStore.expiresAt - 5 * 60 * 1000)) {
    if (!tokenStore.refreshToken) {
      return null;
    }

    if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
      console.error('Spotify credentials not configured for token refresh');
      return null;
    }

    try {
      const response = await fetch(`${SPOTIFY_AUTH_BASE}/api/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: tokenStore.refreshToken,
        }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const tokenData = await response.json();
      tokenStore.accessToken = tokenData.access_token;
      tokenStore.expiresAt = Date.now() + (tokenData.expires_in * 1000);
      
      if (tokenData.refresh_token) {
        tokenStore.refreshToken = tokenData.refresh_token;
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      tokenStore = {
        accessToken: null,
        refreshToken: null,
        expiresAt: null,
      };
      return null;
    }
  }

  return tokenStore.accessToken;
}

/**
 * Helper: Generate random string for state parameter
 */
function generateRandomString(length) {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let text = '';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

app.listen(PORT, () => {
  console.log(`Spotify backend server running on http://localhost:${PORT}`);
  
  // Check if credentials are configured
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REDIRECT_URI) {
    console.warn('\n⚠️  WARNING: Spotify credentials not configured!');
    console.warn('Please create server/.env file and set:');
    console.warn('  - SPOTIFY_CLIENT_ID');
    console.warn('  - SPOTIFY_CLIENT_SECRET');
    console.warn('  - SPOTIFY_REDIRECT_URI');
    console.warn('See server/.env.example for reference\n');
  } else {
    console.log('✅ Spotify credentials loaded from environment');
  }
});


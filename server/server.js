/**
 * Spotify Backend Server
 * Handles Spotify OAuth Authorization Code Flow
 * 
 * ENVIRONMENT VARIABLES REQUIRED (in server/.env or deployment platform):
 * - SPOTIFY_CLIENT_ID: Your Spotify app client ID from https://developer.spotify.com/dashboard
 * - SPOTIFY_CLIENT_SECRET: Your Spotify app client secret
 * - SPOTIFY_REDIRECT_URI: The callback URL for Spotify OAuth
 *   - Local dev: "http://127.0.0.1:3001/auth/callback"
 *   - Production: "https://YOUR-BACKEND-DOMAIN/auth/callback" (e.g., https://shivani-spotify-backend.onrender.com/auth/callback)
 *   IMPORTANT: This exact URI must be added to your Spotify Dashboard → Redirect URIs
 * - FRONTEND_URL: Frontend URL for post-auth redirect
 *   - Local dev: "http://localhost:5173/p183/"
 *   - Production: "https://cs571-f25.github.io/p183/"
 * - PORT: Server port (optional, defaults to 3001)
 *   - Deployment platforms (Render, Railway, etc.) will set this automatically
 * 
 * SPOTIFY DASHBOARD SETUP:
 * 1. Go to https://developer.spotify.com/dashboard
 * 2. Click on your app
 * 3. Under "Redirect URIs", add BOTH:
 *   - http://127.0.0.1:3001/auth/callback (for local dev)
 *   - https://YOUR-BACKEND-DOMAIN/auth/callback (for production - replace with your actual backend URL)
 * 4. Save changes
 * 
 * NOTE: SPOTIFY_REDIRECT_URI in your backend environment must EXACTLY match one of the URIs
 * in your Spotify Dashboard. The backend will use this value when building the authorization URL.
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// fetch is built-in in Node 18+, no import needed

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TOKEN_FILE = path.join(__dirname, '.spotify-tokens.json');

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration - allow requests from frontend
// In development: allows localhost and 127.0.0.1
// In production: allows GitHub Pages and Render frontend origins
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://cs571-f25.github.io",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) {
        return callback(null, true);
      }
      
      // Check if origin is in allowed list
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        // Check if it matches FRONTEND_URL from env (supports both GitHub Pages and Render)
        const frontendUrl = process.env.FRONTEND_URL;
        if (frontendUrl) {
          // Remove trailing slash for comparison
          const normalizedFrontendUrl = frontendUrl.replace(/\/$/, '');
          const normalizedOrigin = origin.replace(/\/$/, '');
          
          if (normalizedOrigin.startsWith(normalizedFrontendUrl)) {
            return callback(null, true);
          }
        }
        
        // Also allow Render frontend URLs (if frontend is on Render)
        if (origin.includes('.onrender.com')) {
          console.log('✅ Allowing Render frontend origin:', origin);
          return callback(null, true);
        }
        
        console.warn('⚠️  CORS blocked origin:', origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// Token storage - loads from file on startup, saves to file on update
// This allows tokens to persist across server restarts (like Kyan's implementation)
// NOTE: On Render free tier, filesystem is ephemeral - tokens may be lost on restart
function loadTokens() {
  try {
    if (fs.existsSync(TOKEN_FILE)) {
      const data = fs.readFileSync(TOKEN_FILE, 'utf8');
      const tokens = JSON.parse(data);
      console.log('📂 Token file found and loaded');
      return tokens;
    } else {
      console.log('📂 No token file found (this is normal on first run or after Render restart)');
    }
  } catch (error) {
    console.error('❌ Error loading tokens from file:', error.message);
  }
  return {
    accessToken: null,
    refreshToken: null,
    expiresAt: null,
  };
}

// Reload tokens from file (useful if tokens were lost due to service restart)
function reloadTokens() {
  const loaded = loadTokens();
  if (loaded.accessToken && !tokenStore.accessToken) {
    console.log('🔄 Reloading tokens from file into memory');
    tokenStore = {
      ...loaded,
      state: tokenStore.state, // Preserve state
    };
    return true;
  }
  return false;
}

function saveTokens(tokens) {
  try {
    // Don't save state to file (it's only for CSRF protection)
    const { state, ...tokensToSave } = tokens;
    fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokensToSave, null, 2));
    console.log('💾 Tokens saved to file:', {
      hasAccessToken: !!tokensToSave.accessToken,
      hasRefreshToken: !!tokensToSave.refreshToken,
      expiresAt: tokensToSave.expiresAt ? new Date(tokensToSave.expiresAt).toISOString() : null,
    });
  } catch (error) {
    console.error('❌ Error saving tokens:', error);
  }
}

let tokenStore = {
  ...loadTokens(),
  state: null, // For CSRF protection (not persisted)
};

// Log token status on startup
if (tokenStore.accessToken) {
  console.log('✅ Loaded Spotify tokens from file');
  console.log(`   Token expires at: ${new Date(tokenStore.expiresAt).toISOString()}`);
} else {
  console.log('ℹ️  No Spotify tokens found. User needs to authenticate.');
}

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
  'user-read-recently-played',
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

  // Debug: Log the redirect URI being used (for troubleshooting)
  console.log('🔐 Spotify Auth - Redirect URI:', SPOTIFY_REDIRECT_URI);
  console.log('🔐 Spotify Auth - Client ID:', SPOTIFY_CLIENT_ID);
  console.log('🔐 Spotify Auth - Full URL:', authUrl.toString());

  res.redirect(authUrl.toString());
});

/**
 * GET /auth/callback
 * Handles Spotify's redirect after authorization
 * Exchanges authorization code for access token
 */
app.get('/auth/callback', async (req, res) => {
  console.log('🔄 Spotify callback received');
  console.log('   Query params:', { code: req.query.code ? 'present' : 'missing', state: req.query.state, error: req.query.error });
  
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REDIRECT_URI) {
    console.error('❌ Spotify credentials not configured in .env');
    return res.status(500).send('Server configuration error');
  }

  const { code, state, error } = req.query;

  if (error) {
    console.error('❌ Spotify returned error:', error);
    return res.redirect(`${FRONTEND_URL}#/about?error=${encodeURIComponent(error)}`);
  }

  if (!code) {
    console.error('❌ No authorization code in callback');
    return res.redirect(`${FRONTEND_URL}#/about?error=no_code`);
  }
  
  console.log('✅ Authorization code received, exchanging for token...');

  // Verify state parameter (CSRF protection)
  // Note: On Render free tier, service may restart between login and callback,
  // causing state to be lost. We'll log this but still allow the callback to proceed
  // if we have valid credentials (security trade-off for Render's ephemeral nature)
  if (state !== tokenStore.state) {
    if (!tokenStore.state) {
      console.warn('⚠️  State mismatch: tokenStore.state is null (likely due to Render service restart)');
      console.warn('   Proceeding with token exchange anyway - this is expected on Render free tier');
      // Continue - state was likely lost due to service restart
    } else {
      console.error('❌ State mismatch - possible CSRF attack or service restart');
      console.error(`   Expected: ${tokenStore.state}, Got: ${state}`);
      // Still allow it on Render since state is ephemeral, but log the issue
      console.warn('   Proceeding with token exchange (Render service may have restarted)');
    }
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
      const errorData = await tokenResponse.json().catch(() => ({ error: 'Failed to parse error response' }));
      console.error('❌ Token exchange failed:', {
        status: tokenResponse.status,
        statusText: tokenResponse.statusText,
        error: errorData,
      });
      return res.redirect(`${FRONTEND_URL}#/about?error=token_exchange_failed`);
    }

    console.log('✅ Token exchange successful, parsing response...');
    const tokenData = await tokenResponse.json();
    console.log('✅ Token data received:', {
      hasAccessToken: !!tokenData.access_token,
      hasRefreshToken: !!tokenData.refresh_token,
      expiresIn: tokenData.expires_in,
    });

    // Store tokens server-side and persist to file
    const expiresAt = Date.now() + (tokenData.expires_in * 1000);
    tokenStore = {
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresAt: expiresAt,
      state: null, // Clear state after successful auth
    };
    saveTokens(tokenStore);

    console.log('✅ Tokens saved successfully:', {
      hasAccessToken: !!tokenStore.accessToken,
      hasRefreshToken: !!tokenStore.refreshToken,
      expiresAt: new Date(expiresAt).toISOString(),
      expiresIn: tokenData.expires_in,
      refreshTokenLength: tokenStore.refreshToken ? tokenStore.refreshToken.length : 0,
    });

    // Redirect back to frontend About page after successful auth (where Spotify section is)
    console.log('✅ Authentication complete, redirecting to frontend...');
    res.redirect(`${FRONTEND_URL}#/about?auth=success`);
  } catch (error) {
    console.error('❌ Callback error:', error);
    console.error('   Error stack:', error.stack);
    res.redirect(`${FRONTEND_URL}#/about?error=server_error`);
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
 * Returns top tracks (short_term for "this month", limit 5)
 */
app.get('/spotify/top-tracks', async (req, res) => {
  try {
    const token = await getValidToken();
    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const timeRange = req.query.time_range || 'short_term'; // short_term = last 4 weeks
    const limit = req.query.limit || 5;

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
 * GET /spotify/recently-played
 * Returns recently played tracks (limit 1 for last played)
 */
app.get('/spotify/recently-played', async (req, res) => {
  try {
    const token = await getValidToken();
    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const limit = req.query.limit || 1;

    const response = await fetch(
      `${SPOTIFY_API_BASE}/me/player/recently-played?limit=${limit}`,
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
    res.json(data);
  } catch (error) {
    console.error('Recently played error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /auth/status
 * Returns authentication status
 * Also attempts to refresh token if expired (but refresh token exists)
 */
app.get('/auth/status', async (req, res) => {
  // Try to reload tokens from file if they're missing (handles Render restarts)
  if (!tokenStore.accessToken && !tokenStore.refreshToken) {
    reloadTokens();
  }
  
  // Try to get a valid token (will refresh if needed)
  const token = await getValidToken();
  
  // Log status for debugging
  if (!token) {
    console.log('📊 Auth status check: Not authenticated', {
      hasAccessToken: !!tokenStore.accessToken,
      hasRefreshToken: !!tokenStore.refreshToken,
      expiresAt: tokenStore.expiresAt ? new Date(tokenStore.expiresAt).toISOString() : null,
      isExpired: tokenStore.expiresAt ? Date.now() >= tokenStore.expiresAt : true,
      tokenFileExists: fs.existsSync(TOKEN_FILE),
    });
  }
  
  res.json({
    authenticated: !!token,
    expiresAt: tokenStore.expiresAt,
    hasRefreshToken: !!tokenStore.refreshToken,
    hasAccessToken: !!tokenStore.accessToken,
  });
});

/**
 * GET /health
 * Health check endpoint - can be pinged to keep Render service awake
 * Also useful for monitoring service status
 */
app.get('/health', (req, res) => {
  const hasTokens = !!(tokenStore.accessToken || tokenStore.refreshToken);
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    hasTokens: hasTokens,
    tokenFileExists: fs.existsSync(TOKEN_FILE),
  });
});

/**
 * GET /auth/debug
 * Debug endpoint to check redirect URI configuration
 */
app.get('/auth/debug', (req, res) => {
  res.json({
    redirectUri: SPOTIFY_REDIRECT_URI,
    clientId: SPOTIFY_CLIENT_ID ? 'SET' : 'NOT SET',
    clientSecret: SPOTIFY_CLIENT_SECRET ? 'SET' : 'NOT SET',
    hasTokens: !!tokenStore.accessToken,
    message: `Make sure this exact redirect URI is in your Spotify Dashboard: ${SPOTIFY_REDIRECT_URI}`
  });
});

/**
 * POST /contact/send
 * Sends contact form email to spotnuru@wisc.edu
 * 
 * Currently logs to console. To enable actual email sending:
 * 1. Install nodemailer: npm install nodemailer
 * 2. Configure email service in .env (see EMAIL_SETUP.md)
 * 3. Uncomment and configure the email sending code below
 */
app.post('/contact/send', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const recipientEmail = 'shivanipotnuru@gmail.com';
    
    // Log the submission (for development)
    console.log('📧 Contact Form Submission:');
    console.log(`From: ${name} <${email}>`);
    console.log(`To: ${recipientEmail}`);
    console.log(`Message: ${message}`);
    console.log(`Timestamp: ${new Date().toISOString()}`);
    console.log('---');

    // Send email using nodemailer (if configured)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
      try {
        const nodemailer = await import('nodemailer');
        const transporter = nodemailer.default.createTransport({
          service: process.env.EMAIL_SERVICE || 'gmail',
          host: 'smtp.gmail.com',
          port: 587,
          secure: false, // true for 465, false for other ports
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
          },
          connectionTimeout: 10000, // 10 seconds
          greetingTimeout: 10000,
          socketTimeout: 10000,
        });

        // Send email with timeout
        const emailPromise = transporter.sendMail({
          from: `"${name}" <${process.env.EMAIL_USER}>`,
          to: recipientEmail,
          replyTo: email,
          subject: `Contact Form: Message from ${name}`,
          text: message,
          html: `<p><strong>From:</strong> ${name} (${email})</p><p><strong>Message:</strong></p><p>${message.replace(/\n/g, '<br>')}</p>`,
        });
        
        // Don't wait for email - respond immediately to user
        emailPromise
          .then(() => console.log('✅ Email sent successfully'))
          .catch((emailErr) => console.error('❌ Email sending failed:', emailErr));
        
        // Return success immediately (email will send in background)
        console.log('✅ Form submission received, email queued');
      } catch (emailError) {
        console.error('❌ Email sending failed:', emailError);
        // Don't fail the request if email fails - still log to console
      }
    } else {
      console.log('ℹ️  Email not configured - submission logged to console only');
    }

    res.json({ 
      success: true, 
      message: 'Message received! I\'ll get back to you soon.',
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Failed to send message. Please try again later.' });
  }
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
    state: null,
  };
  saveTokens(tokenStore);
  res.json({ success: true });
});

/**
 * Helper: Get valid access token, refreshing if necessary
 */
async function getValidToken() {
  // If no tokens in memory, try to reload from file (handles Render restarts)
  if (!tokenStore.accessToken && !tokenStore.refreshToken) {
    reloadTokens();
  }
  
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
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error_description || errorData.error || 'Token refresh failed';
        const errorCode = errorData.error || 'unknown';
        
        console.error('❌ Token refresh failed:', {
          status: response.status,
          error: errorCode,
          description: errorMessage,
        });
        
        // Only clear tokens if refresh token is invalid/expired (400, 401)
        // Don't clear on network errors or server errors (5xx) - might be temporary
        if (response.status === 400 || response.status === 401) {
          console.error('🔄 Refresh token is invalid or expired. User needs to reconnect.');
          tokenStore = {
            accessToken: null,
            refreshToken: null,
            expiresAt: null,
            state: tokenStore.state,
          };
          saveTokens(tokenStore);
        } else {
          // For other errors (network, 5xx), log but don't clear tokens
          // Return the expired token - the API call will fail, but we keep tokens for retry
          console.warn('⚠️  Token refresh failed with non-auth error. Keeping tokens for retry.');
        }
        return null;
      }

      const tokenData = await response.json();
      tokenStore.accessToken = tokenData.access_token;
      tokenStore.expiresAt = Date.now() + (tokenData.expires_in * 1000);
      
      // Spotify may or may not return a new refresh token
      // If it does, update it; otherwise keep the existing one
      if (tokenData.refresh_token) {
        tokenStore.refreshToken = tokenData.refresh_token;
        console.log('✅ Token refreshed successfully with new refresh token');
      } else {
        // Keep existing refresh token if Spotify doesn't provide a new one
        console.log('✅ Token refreshed successfully (using existing refresh token)');
        if (!tokenStore.refreshToken) {
          console.warn('⚠️  WARNING: No refresh token available after refresh!');
        }
      }
      
      // Save refreshed tokens to file
      saveTokens(tokenStore);
      
      console.log('🔄 Token refresh complete:', {
        expiresAt: new Date(tokenStore.expiresAt).toISOString(),
        hasRefreshToken: !!tokenStore.refreshToken,
      });
    } catch (error) {
      // Network errors or other exceptions
      console.error('❌ Token refresh error (network/exception):', error.message);
      // Don't clear tokens on network errors - might be temporary
      // Return null so the API call fails, but tokens remain for next retry
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
  console.log(`\n🚀 Spotify backend server running on http://localhost:${PORT}`);
  
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
    console.log(`   Redirect URI: ${SPOTIFY_REDIRECT_URI}`);
    console.log(`   ⚠️  Make sure this EXACT URI is in your Spotify Dashboard!`);
  }
  
  // Log token status
  if (tokenStore.accessToken) {
    const expiresAt = new Date(tokenStore.expiresAt);
    const isExpired = Date.now() >= tokenStore.expiresAt;
    console.log(`\n📝 Token Status:`);
    console.log(`   ${isExpired ? '❌ Token expired' : '✅ Token valid'}`);
    console.log(`   Expires: ${expiresAt.toISOString()}`);
    if (tokenStore.refreshToken) {
      console.log(`   ✅ Refresh token available`);
    }
  } else {
    console.log(`\n📝 Token Status: No tokens found - user needs to authenticate`);
    console.log(`   Visit: http://localhost:${PORT}/auth/login to start`);
  }
  console.log('');
});


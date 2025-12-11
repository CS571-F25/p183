/**
 * Spotify Authentication Service using PKCE (Authorization Code with Proof Key for Code Exchange)
 * Implements OAuth 2.0 PKCE flow for SPAs - NO CLIENT SECRET required
 * 
 * Reference: https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow
 */

import { spotifyConfig, getAuthUrl, getTokenUrl } from '../config/spotifyConfig.js';

// Generate a random string for code verifier
function generateRandomString(length) {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], '');
}

// Generate code challenge from verifier using SHA256
async function generateCodeChallenge(codeVerifier) {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Start the Spotify authorization flow
 * Generates PKCE codes and redirects to Spotify
 */
export async function loginWithSpotify() {
  const codeVerifier = generateRandomString(128);
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  const state = generateRandomString(16);

  // Store code verifier and state in sessionStorage for security
  sessionStorage.setItem('spotify_code_verifier', codeVerifier);
  sessionStorage.setItem('spotify_state', state);

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: spotifyConfig.clientId,
    scope: spotifyConfig.scopes.join(' '),
    redirect_uri: spotifyConfig.redirectUri,
    state: state,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
  });

  window.location.href = `${getAuthUrl()}?${params.toString()}`;
}

/**
 * Exchange authorization code for access token using PKCE
 * @param {string} code - Authorization code from Spotify callback
 * @param {string} state - State parameter to verify
 * @returns {Promise<Object>} Token response with access_token, refresh_token, expires_in
 */
export async function exchangeCodeForToken(code, state) {
  // Verify state
  const storedState = sessionStorage.getItem('spotify_state');
  if (state !== storedState) {
    throw new Error('State mismatch - possible CSRF attack');
  }

  const codeVerifier = sessionStorage.getItem('spotify_code_verifier');
  if (!codeVerifier) {
    throw new Error('Code verifier not found');
  }

  const response = await fetch(getTokenUrl(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: spotifyConfig.redirectUri,
      client_id: spotifyConfig.clientId,
      code_verifier: codeVerifier,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error_description || 'Failed to exchange code for token');
  }

  const data = await response.json();

  // Clean up session storage
  sessionStorage.removeItem('spotify_code_verifier');
  sessionStorage.removeItem('spotify_state');

  return data;
}

/**
 * Refresh access token using refresh token
 * @param {string} refreshToken - Refresh token from previous auth
 * @returns {Promise<Object>} New token response
 */
export async function refreshAccessToken(refreshToken) {
  const response = await fetch(getTokenUrl(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: spotifyConfig.clientId,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error_description || 'Failed to refresh token');
  }

  return await response.json();
}

/**
 * Get stored tokens from localStorage
 * @returns {Object|null} Tokens object or null if not found
 */
export function getStoredTokens() {
  const accessToken = localStorage.getItem('spotify_access_token');
  const refreshToken = localStorage.getItem('spotify_refresh_token');
  const expiresAt = localStorage.getItem('spotify_expires_at');

  if (!accessToken || !refreshToken || !expiresAt) {
    return null;
  }

  return {
    accessToken,
    refreshToken,
    expiresAt: parseInt(expiresAt, 10),
  };
}

/**
 * Store tokens in localStorage
 * @param {Object} tokenData - Token response from Spotify
 */
export function storeTokens(tokenData) {
  const expiresAt = Date.now() + (tokenData.expires_in * 1000);
  
  localStorage.setItem('spotify_access_token', tokenData.access_token);
  localStorage.setItem('spotify_expires_at', expiresAt.toString());
  
  if (tokenData.refresh_token) {
    localStorage.setItem('spotify_refresh_token', tokenData.refresh_token);
  }
}

/**
 * Clear all stored tokens
 */
export function clearTokens() {
  localStorage.removeItem('spotify_access_token');
  localStorage.removeItem('spotify_refresh_token');
  localStorage.removeItem('spotify_expires_at');
}

/**
 * Check if access token is expired or will expire soon (within 5 minutes)
 * @param {number} expiresAt - Expiration timestamp
 * @returns {boolean}
 */
export function isTokenExpired(expiresAt) {
  return Date.now() >= (expiresAt - 5 * 60 * 1000); // 5 minute buffer
}

/**
 * Get valid access token, refreshing if necessary
 * @returns {Promise<string|null>} Access token or null if not authenticated
 */
export async function getValidAccessToken() {
  const tokens = getStoredTokens();
  
  if (!tokens) {
    return null;
  }

  // Check if token is expired
  if (isTokenExpired(tokens.expiresAt)) {
    try {
      const newTokenData = await refreshAccessToken(tokens.refreshToken);
      storeTokens(newTokenData);
      return newTokenData.access_token;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      clearTokens();
      return null;
    }
  }

  return tokens.accessToken;
}


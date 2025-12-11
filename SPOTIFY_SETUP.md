# Spotify Integration Setup

## Required Environment Variables

In `server/.env`, you must set:

- `SPOTIFY_CLIENT_ID` - Your Spotify app client ID
- `SPOTIFY_CLIENT_SECRET` - Your Spotify app client secret  
- `SPOTIFY_REDIRECT_URI` - **Must be exactly:** `http://127.0.0.1:3001/auth/callback`
  - **IMPORTANT:** Spotify no longer allows `localhost`; you must use `127.0.0.1`
- `FRONTEND_URL` - Frontend URL (defaults to `http://localhost:5173`)
- `PORT` - Server port (optional, defaults to 3001)

## Spotify Dashboard Configuration

**CRITICAL:** You must add this exact redirect URI to your Spotify Developer Dashboard:

1. Go to https://developer.spotify.com/dashboard
2. Click on your app
3. Under "Redirect URIs", add: `http://127.0.0.1:3001/auth/callback`
4. Click "Add" and then "Save"

**Note:** Spotify's new rules require `127.0.0.1` instead of `localhost`. The redirect URI in your `.env` file must match **exactly** what you add in the Spotify Dashboard (including the protocol, port, and path).

## How It Works

1. User clicks "Connect Spotify" on the Now page
2. Frontend redirects to backend `/auth/login` endpoint
3. Backend redirects to Spotify authorization page
4. User authorizes the app on Spotify
5. Spotify redirects back to `http://127.0.0.1:3001/auth/callback` (your backend)
6. Backend exchanges the authorization code for access/refresh tokens
7. Backend redirects user back to frontend at `FRONTEND_URL/p183/#/now`
8. Frontend detects successful auth and fetches Spotify data from backend endpoints

## Backend Endpoints

- `GET /auth/login` - Initiates Spotify OAuth flow
- `GET /auth/callback` - Handles Spotify redirect and token exchange
- `GET /auth/status` - Returns authentication status
- `POST /auth/logout` - Clears stored tokens
- `GET /spotify/now-playing` - Returns currently playing track
- `GET /spotify/top-tracks` - Returns top tracks for the month

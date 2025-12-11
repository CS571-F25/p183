# Spotify Backend Server

Backend server for handling Spotify OAuth Authorization Code Flow. This server securely stores the Spotify Client Secret and handles token management.

## Setup

1. **Install dependencies:**
   ```bash
   cd server
   npm install
   ```

2. **Configure Spotify credentials:**
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Open `server/.env` in a text editor
   - Fill in your real Spotify credentials from the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard):
     ```
     SPOTIFY_CLIENT_ID=your_actual_client_id_from_spotify_dashboard
     SPOTIFY_CLIENT_SECRET=your_actual_client_secret_from_spotify_dashboard
    SPOTIFY_REDIRECT_URI=http://127.0.0.1:3001/auth/callback
     FRONTEND_URL=http://localhost:5173
     ```
   - **IMPORTANT:** Never commit the `.env` file - it contains your secret keys. The `.env` file is already gitignored.

3. **Configure Spotify App:**
   - Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Add redirect URI: `http://127.0.0.1:3001/auth/callback` (for local development)
   - Ensure this matches exactly what you set in `SPOTIFY_REDIRECT_URI` in your `.env` file

## Running the Server

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

The server will run on `http://localhost:3001` by default.

## API Endpoints

- `GET /auth/login` - Initiates Spotify authorization flow
- `GET /auth/callback` - Handles Spotify redirect and exchanges code for token
- `GET /auth/status` - Returns authentication status
- `POST /auth/logout` - Clears stored tokens
- `GET /spotify/now-playing` - Returns currently playing track (or null)
- `GET /spotify/top-tracks?time_range=medium_term&limit=10` - Returns top tracks

## Security Notes

- Client Secret is stored server-side only (never exposed to frontend)
- Tokens are stored in-memory (for this project)
- In production, use proper session storage or database
- CORS is configured to allow requests from frontend only

## Deployment

For production deployment:

1. Deploy this server to a hosting service (Heroku, Railway, Render, etc.)
2. Update `BACKEND_URL` in `src/config/backendConfig.js` with your production server URL
3. Set environment variables on your hosting platform
4. Ensure the redirect URI in Spotify dashboard matches your production URL


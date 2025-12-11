# Setup Guide

This guide will help you set up both the frontend and backend for the personal website.

## Frontend Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

## Backend Setup (Spotify Integration)

### 1. Create Spotify App

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Click "Create App"
3. Fill in app details
4. Add Redirect URIs:
   - Production: `https://cs571-f25.github.io/p183/`
   - Local dev: `http://localhost:5173/p183/`
5. Copy your **Client ID** and **Client Secret**

### 2. Configure Backend - Spotify Credentials Setup

1. **Navigate to server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```

4. **Open `server/.env` and paste your real Spotify credentials:**
   - Get your credentials from [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - In `server/.env`, replace the placeholder values:
     ```
     SPOTIFY_CLIENT_ID=paste_your_actual_client_id_here
     SPOTIFY_CLIENT_SECRET=paste_your_actual_client_secret_here
     SPOTIFY_REDIRECT_URI=http://localhost:5173/p183/
     ```
   - **CRITICAL:** The `.env` file is gitignored and should NEVER be committed. Only edit your local `server/.env` file.

5. **Start backend server:**
   ```bash
   npm run dev
   ```

### 3. Configure Frontend Backend URL

1. **Update `src/config/backendConfig.js`:**
   - For local development: Already set to `http://localhost:3001`
   - For production: Update `BACKEND_URL` with your deployed backend server URL

### 4. Running Both Servers

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

Visit `http://localhost:5173/p183/` and navigate to the "Now" page to test Spotify integration.

## Production Deployment

### Frontend (GitHub Pages)

1. Build the project:
   ```bash
   npm run build
   ```

2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push
   ```

3. Enable GitHub Pages:
   - Go to repository Settings → Pages
   - Select source: `main` branch, `/docs` folder
   - Save

### Backend

Deploy the `server/` directory to a hosting service:

**Options:**
- **Heroku**: Create a Procfile, deploy via Git
- **Railway**: Connect GitHub repo, set environment variables
- **Render**: Create a web service, set environment variables

**Required environment variables on hosting platform:**
- `SPOTIFY_CLIENT_ID`
- `SPOTIFY_CLIENT_SECRET`
- `SPOTIFY_REDIRECT_URI` (your production URL)
- `FRONTEND_URL` (your GitHub Pages URL)
- `PORT` (usually auto-set by hosting platform)

**After deploying backend:**
1. Update `BACKEND_URL` in `src/config/backendConfig.js` with your production backend URL
2. Rebuild and redeploy frontend

## Troubleshooting

**"Not authenticated" error:**
- Check that backend server is running
- Verify backend URL in `backendConfig.js`
- Check browser console for CORS errors

**"Redirect URI mismatch" error:**
- Ensure redirect URI in Spotify dashboard matches exactly
- Check for trailing slashes
- Verify both production and local dev URIs are added

**Theme not working:**
- Clear browser localStorage
- Check browser console for errors
- Verify `data-theme` attribute is set on `<html>` element

**Contact form not visible in dark mode:**
- Check that form inputs have proper border colors
- Verify CSS variables are being applied
- Test with browser dev tools


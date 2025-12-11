# Next Steps After Backend Deployment

Your backend is now deployed to Render! Follow these steps to connect your frontend:

## Step 1: Get Your Backend URL

1. Go to your Render dashboard: https://dashboard.render.com
2. Click on your web service
3. Find your service URL at the top (e.g., `https://shivani-spotify-backend.onrender.com`)
4. Copy the full URL (without trailing slash)

## Step 2: Update `.env.production`

1. Open `.env.production` in the root of your repo
2. Replace `https://your-backend-url.onrender.com` with your actual Render URL
3. Save the file

Example:
```
VITE_BACKEND_URL=https://shivani-spotify-backend.onrender.com
```

## Step 3: Update Spotify Dashboard

1. Go to https://developer.spotify.com/dashboard
2. Click on your app ("personal website")
3. Click "Edit Settings"
4. Under "Redirect URIs", add:
   ```
   https://YOUR-BACKEND-URL.onrender.com/auth/callback
   ```
   (Replace with your actual Render URL)
5. Keep the local dev URI: `http://127.0.0.1:3001/auth/callback`
6. Click "Save"

## Step 4: Verify Render Environment Variables

In your Render dashboard, make sure these environment variables are set:

- `SPOTIFY_CLIENT_ID=7ab3b7d3e4e0452fac073941160b3cab`
- `SPOTIFY_CLIENT_SECRET=cf15915b2dad47c7a172a17ee94ecd49`
- `SPOTIFY_REDIRECT_URI=https://YOUR-BACKEND-URL.onrender.com/auth/callback`
- `FRONTEND_URL=https://cs571-f25.github.io/p183/`
- `PORT=10000` (or leave blank - Render sets this automatically)

**Important:** `SPOTIFY_REDIRECT_URI` must exactly match what you added to Spotify Dashboard!

## Step 5: Build and Deploy Frontend

1. Build with production environment:
   ```bash
   npm run build
   ```

2. Copy built files to docs:
   ```bash
   cp -r dist/* docs/
   ```

3. Commit and push:
   ```bash
   git add .env.production docs/
   git commit -m "Configure frontend for production backend"
   git push origin main
   ```

4. Wait 1-2 minutes for GitHub Pages to update

## Step 6: Test

1. Visit: https://cs571-f25.github.io/p183/
2. Go to the "About" page
3. Click "Connect Spotify" if needed
4. Your Spotify data should appear!

## Troubleshooting

### Backend not responding
- Check Render logs for errors
- Verify all environment variables are set correctly
- Make sure `SPOTIFY_REDIRECT_URI` matches Spotify Dashboard exactly

### CORS errors
- Verify `FRONTEND_URL` is set to `https://cs571-f25.github.io/p183/` in Render
- Check that CORS allows your GitHub Pages origin

### Spotify auth fails
- Double-check redirect URI matches exactly between:
  - Spotify Dashboard
  - Render environment variable `SPOTIFY_REDIRECT_URI`
- Check Render logs for specific error messages


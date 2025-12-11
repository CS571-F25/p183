# Deploying the Spotify Backend

This guide explains how to deploy the Spotify backend server separately from your GitHub Pages frontend, so that your deployed site at `https://cs571-f25.github.io/p183/` can access your Spotify data.

## Overview

Your portfolio site is split into two parts:
1. **Frontend** (React/Vite): Deployed to GitHub Pages as static files
2. **Backend** (Node/Express): Must be deployed to a service that can run Node.js

GitHub Pages can only host static files, so the backend must be deployed separately to a service like Render, Railway, or Fly.io. This guide uses **Render** as an example, but the same principles apply to other platforms.

---

## Step 1: Deploy Backend to Render

### 1.1 Create a Render Account
1. Go to [render.com](https://render.com)
2. Sign up for a free account (GitHub login works great)

### 1.2 Create a New Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository (`p183`)
3. Configure the service:
   - **Name**: `shivani-spotify-backend` (or any name you like)
   - **Root Directory**: `server` (important! This tells Render where your backend code is)
   - **Environment**: `Node`
   - **Build Command**: `npm install` (or leave blank if not needed)
   - **Start Command**: `node server.js`
   - **Plan**: Free (or paid if you need more resources)

### 1.3 Set Environment Variables
In the Render dashboard, go to your service → "Environment" tab, and add these variables:

```
SPOTIFY_CLIENT_ID=7ab3b7d3e4e0452fac073941160b3cab
SPOTIFY_CLIENT_SECRET=cf15915b2dad47c7a172a17ee94ecd49
SPOTIFY_REDIRECT_URI=https://YOUR-SERVICE-NAME.onrender.com/auth/callback
FRONTEND_URL=https://cs571-f25.github.io/p183/
PORT=10000
```

**Important Notes:**
- Replace `YOUR-SERVICE-NAME` with your actual Render service name (e.g., `shivani-spotify-backend.onrender.com`)
- `SPOTIFY_REDIRECT_URI` must be the full URL: `https://your-service.onrender.com/auth/callback`
- `FRONTEND_URL` is where users will be redirected after Spotify auth
- `PORT` is usually set automatically by Render, but you can set it explicitly

### 1.4 Deploy
1. Click "Create Web Service"
2. Render will build and deploy your backend
3. Wait for deployment to complete (usually 2-3 minutes)
4. Note your backend URL: `https://your-service-name.onrender.com`

---

## Step 2: Update Spotify Dashboard

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Click on your app ("personal website")
3. Click "Edit Settings"
4. Under "Redirect URIs", add your production callback URL:
   ```
   https://your-service-name.onrender.com/auth/callback
   ```
5. Keep the local dev URI: `http://127.0.0.1:3001/auth/callback`
6. Click "Save"

**Important:** The `SPOTIFY_REDIRECT_URI` in your Render environment variables must **exactly match** one of the URIs in your Spotify Dashboard.

---

## Step 3: Configure Frontend for Production

### 3.1 Create Production Environment File
In the root of your `p183` repository, create a file called `.env.production`:

```bash
VITE_BACKEND_URL=https://your-service-name.onrender.com
```

Replace `your-service-name.onrender.com` with your actual Render backend URL.

### 3.2 Build and Deploy Frontend
1. Build the frontend with the production environment:
   ```bash
   npm run build
   ```
   This will use `VITE_BACKEND_URL` from `.env.production` and bake it into the built files.

2. Copy the built files to `docs/`:
   ```bash
   cp -r dist/* docs/
   ```
   (Or manually copy the contents of `dist/` to `docs/`)

3. Commit and push to GitHub:
   ```bash
   git add docs/
   git add .env.production
   git commit -m "Configure frontend for production backend"
   git push origin main
   ```

4. GitHub Pages will automatically update (usually within 1-2 minutes)

---

## Step 4: Test Your Deployment

1. Visit your deployed site: `https://cs571-f25.github.io/p183/`
2. Navigate to the "About" page (where Spotify section is)
3. Click "Connect Spotify" (if not already connected)
4. You should be redirected to Spotify, then back to your site
5. Your Spotify data should appear!

---

## Local Development (Still Works!)

Your local development setup remains unchanged:

1. **Start backend:**
   ```bash
   cd server
   node server.js
   ```
   Backend runs on `http://127.0.0.1:3001`

2. **Start frontend:**
   ```bash
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

3. **Local environment:**
   - No `.env.production` needed for local dev
   - Frontend automatically uses `http://127.0.0.1:3001` when `VITE_BACKEND_URL` is not set
   - Backend uses `server/.env` with:
     ```
     SPOTIFY_REDIRECT_URI=http://127.0.0.1:3001/auth/callback
     FRONTEND_URL=http://localhost:5173/p183/
     ```

---

## Troubleshooting

### Backend won't start
- Check that all environment variables are set in Render
- Check Render logs for errors
- Verify `SPOTIFY_REDIRECT_URI` matches your Render service URL

### CORS errors
- Verify your backend CORS configuration includes `https://cs571-f25.github.io`
- Check that `FRONTEND_URL` is set correctly in Render

### Spotify auth fails
- Verify `SPOTIFY_REDIRECT_URI` in Render exactly matches what's in Spotify Dashboard
- Check that the redirect URI is added to Spotify Dashboard
- Check backend logs in Render for specific error messages

### Frontend can't reach backend
- Verify `VITE_BACKEND_URL` in `.env.production` is correct
- Rebuild frontend after changing `.env.production`
- Check browser console for network errors

---

## Alternative Deployment Platforms

### Railway
1. Connect GitHub repo
2. Set root directory to `server`
3. Add environment variables (same as Render)
4. Deploy

### Fly.io
1. Install Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. In `server/` directory: `fly launch`
3. Set environment variables: `fly secrets set SPOTIFY_CLIENT_ID=...`
4. Deploy: `fly deploy`

### Heroku
1. Create app: `heroku create your-app-name`
2. Set buildpack: `heroku buildpacks:set heroku/nodejs`
3. Set root: `heroku config:set PROJECT_PATH=server`
4. Add environment variables
5. Deploy: `git push heroku main`

---

## Security Notes

- **Never commit** `server/.env` or `.env.production` with real secrets
- Use environment variables in your deployment platform
- Rotate secrets if they're ever exposed
- The backend handles all Spotify API calls; frontend never sees client secrets

---

## Summary

After following this guide:
- ✅ Backend deployed to Render (or similar)
- ✅ Frontend configured to use production backend
- ✅ Spotify Dashboard updated with production redirect URI
- ✅ Local development still works with localhost
- ✅ Production site can access Spotify data

Your site should now work for anyone visiting `https://cs571-f25.github.io/p183/`!


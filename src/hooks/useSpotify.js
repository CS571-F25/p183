import { useState, useEffect, useCallback } from 'react';
import { API_ENDPOINTS } from '../config/backendConfig.js';

/**
 * Custom hook for Spotify integration via backend
 * Handles authentication and fetches data from backend endpoints
 */
export function useSpotify() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nowPlaying, setNowPlaying] = useState(null);
  const [topTracks, setTopTracks] = useState([]);

  // Check authentication status and handle callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authParam = urlParams.get('auth');
    const errorParam = urlParams.get('error');

    // Handle callback from backend after Spotify auth
    if (authParam === 'success') {
      // Clean up URL parameters but keep the hash route
      const cleanUrl = window.location.pathname + window.location.hash.split('?')[0];
      window.history.replaceState({}, document.title, cleanUrl);
      checkAuthStatus();
      return;
    }

    if (errorParam) {
      setError(`Spotify authorization error: ${errorParam}`);
      setIsLoading(false);
      // Clean up URL parameters
      const cleanUrl = window.location.pathname + window.location.hash.split('?')[0];
      window.history.replaceState({}, document.title, cleanUrl);
      return;
    }

    // Check initial auth status
    checkAuthStatus();
  }, []);

  // Check authentication status with backend
  const checkAuthStatus = useCallback(async () => {
    try {
      const response = await fetch(API_ENDPOINTS.status, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setIsAuthenticated(data.authenticated);
        if (data.authenticated) {
          fetchSpotifyData();
        } else {
          setIsLoading(false);
        }
      } else {
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Error checking auth status:', err);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  }, []);

  // Fetch Spotify data from backend
  const fetchSpotifyData = useCallback(async () => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    setError(null);

    try {
      // Fetch currently playing track
      const nowPlayingResponse = await fetch(API_ENDPOINTS.nowPlaying, {
        credentials: 'include',
      });

      if (nowPlayingResponse.ok) {
        const data = await nowPlayingResponse.json();
        setNowPlaying(data); // null if nothing playing
      } else if (nowPlayingResponse.status === 401) {
        setIsAuthenticated(false);
        setError('Authentication expired. Please reconnect.');
      } else {
        throw new Error('Failed to fetch now playing');
      }

      // Fetch top tracks
      const topTracksResponse = await fetch(API_ENDPOINTS.topTracks, {
        credentials: 'include',
      });

      if (topTracksResponse.ok) {
        const data = await topTracksResponse.json();
        setTopTracks(data);
      } else if (topTracksResponse.status === 401) {
        setIsAuthenticated(false);
        setError('Authentication expired. Please reconnect.');
      } else {
        throw new Error('Failed to fetch top tracks');
      }
    } catch (err) {
      console.error('Error fetching Spotify data:', err);
      setError(err.message);
      
      if (err.message.includes('401') || err.message.includes('expired')) {
        setIsAuthenticated(false);
      }
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Refresh data
  useEffect(() => {
    if (isAuthenticated) {
      fetchSpotifyData();
    }
  }, [isAuthenticated, fetchSpotifyData]);

  const handleLogin = useCallback(() => {
    // Redirect to backend login endpoint
    window.location.href = API_ENDPOINTS.login;
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await fetch(API_ENDPOINTS.logout, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      console.error('Logout error:', err);
    }
    
    setIsAuthenticated(false);
    setNowPlaying(null);
    setTopTracks([]);
    setError(null);
  }, []);

  return {
    isAuthenticated,
    isLoading,
    error,
    nowPlaying,
    topTracks,
    loginWithSpotify: handleLogin,
    logout: handleLogout,
    refreshData: fetchSpotifyData,
  };
}

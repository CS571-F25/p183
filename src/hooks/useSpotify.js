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
  const [recentlyPlayed, setRecentlyPlayed] = useState(null);

  // Automatically fetch data on mount and handle auth callback
  useEffect(() => {
    // Check for auth callback in URL (HashRouter puts query params in hash)
    const hash = window.location.hash;
    const hashParts = hash.split('?');
    let authStatus = null;
    let error = null;
    
    if (hashParts.length > 1) {
      const params = new URLSearchParams(hashParts[1]);
      authStatus = params.get('auth');
      error = params.get('error');
    }
    
    if (authStatus === 'success') {
      // Clean up URL (remove ?auth=success from hash)
      const cleanHash = hashParts[0];
      window.history.replaceState({}, document.title, window.location.pathname + cleanHash);
      // Check auth status and fetch data
      checkAuthStatus();
    } else if (authStatus === 'error' || error) {
      setError(`Authentication failed: ${error || 'Unknown error'}`);
      setIsLoading(false);
      // Clean up URL (remove ?error=... from hash)
      const cleanHash = hashParts[0];
      window.history.replaceState({}, document.title, window.location.pathname + cleanHash);
    } else {
      // Normal load - check auth status
      checkAuthStatus();
    }
  }, []);

  // Fetch Spotify data from backend
  const fetchSpotifyData = useCallback(async () => {
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
        setIsLoading(false);
        return;
      } else if (nowPlayingResponse.status === 502 || nowPlayingResponse.status === 504 || nowPlayingResponse.status === 402) {
        // Service is sleeping (Render free tier) - silently fail, keep existing data
        console.log('Backend service is sleeping, keeping existing data');
        setIsLoading(false);
        return;
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
        setIsLoading(false);
        return;
      } else if (topTracksResponse.status === 502 || topTracksResponse.status === 504 || topTracksResponse.status === 402) {
        // Service is sleeping - silently fail, keep existing data
        console.log('Backend service is sleeping, keeping existing data');
        setIsLoading(false);
        return;
      }

      // Fetch recently played (for last played section)
      const recentlyPlayedResponse = await fetch(API_ENDPOINTS.recentlyPlayed, {
        credentials: 'include',
      });

      if (recentlyPlayedResponse.ok) {
        const data = await recentlyPlayedResponse.json();
        // Get the first track from recently played
        if (data.items && data.items.length > 0) {
          setRecentlyPlayed(data.items[0]);
        }
      } else if (recentlyPlayedResponse.status === 401) {
        setIsAuthenticated(false);
        setError('Authentication expired. Please reconnect.');
      } else if (recentlyPlayedResponse.status === 502 || recentlyPlayedResponse.status === 504 || recentlyPlayedResponse.status === 402) {
        // Service is sleeping - silently fail, keep existing data
        console.log('Backend service is sleeping, keeping existing data');
      }
      // Don't throw error for recently played - it's optional
    } catch (err) {
      console.error('Error fetching Spotify data:', err);
      
      // Network errors (service sleeping) - don't show error, keep existing data
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        console.log('Backend service unavailable, keeping existing data');
        setIsLoading(false);
        return;
      }
      
      setError(err.message);
      
      if (err.message.includes('401') || err.message.includes('expired')) {
        setIsAuthenticated(false);
      }
    } finally {
      setIsLoading(false);
    }
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
          // Fetch data if authenticated
          await fetchSpotifyData();
        } else {
          // Not authenticated - try to auto-login if we have tokens stored
          // The backend will handle token refresh if needed
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
  }, [fetchSpotifyData]);

  // Refresh data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchSpotifyData();
    }
  }, [isAuthenticated, fetchSpotifyData]);

  // Auto-refresh Spotify data every minute (60 seconds)
  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    // Set up interval to refresh data every 60 seconds
    const intervalId = setInterval(() => {
      fetchSpotifyData();
    }, 60000); // 60000ms = 60 seconds = 1 minute

    // Cleanup interval on unmount or when auth status changes
    return () => {
      clearInterval(intervalId);
    };
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
    setRecentlyPlayed(null);
    setError(null);
  }, []);

  return {
    isAuthenticated,
    isLoading,
    error,
    nowPlaying,
    topTracks,
    recentlyPlayed,
    loginWithSpotify: handleLogin,
    logout: handleLogout,
    refreshData: fetchSpotifyData,
  };
}

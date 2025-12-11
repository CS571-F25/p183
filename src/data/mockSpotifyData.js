/**
 * Mock Spotify data for development
 * This will be replaced with real Spotify Web API integration later
 * Structure matches Spotify Web API response format
 */

export const mockTopTracks = [
  {
    id: '1',
    rank: 1,
    name: 'Anti-Hero',
    artists: [{ name: 'Taylor Swift' }],
    album: { name: 'Midnights' },
    duration_ms: 200000,
    external_urls: { spotify: 'https://open.spotify.com/track/example1' },
  },
  {
    id: '2',
    rank: 2,
    name: 'As It Was',
    artists: [{ name: 'Harry Styles' }],
    album: { name: "Harry's House" },
    duration_ms: 167000,
    external_urls: { spotify: 'https://open.spotify.com/track/example2' },
  },
  {
    id: '3',
    rank: 3,
    name: 'Flowers',
    artists: [{ name: 'Miley Cyrus' }],
    album: { name: 'Endless Summer Vacation' },
    duration_ms: 200000,
    external_urls: { spotify: 'https://open.spotify.com/track/example3' },
  },
  {
    id: '4',
    rank: 4,
    name: 'Blinding Lights',
    artists: [{ name: 'The Weeknd' }],
    album: { name: 'After Hours' },
    duration_ms: 200000,
    external_urls: { spotify: 'https://open.spotify.com/track/example4' },
  },
  {
    id: '5',
    rank: 5,
    name: 'Watermelon Sugar',
    artists: [{ name: 'Harry Styles' }],
    album: { name: 'Fine Line' },
    duration_ms: 174000,
    external_urls: { spotify: 'https://open.spotify.com/track/example5' },
  },
];

export const mockNowPlaying = {
  id: 'now-1',
  name: 'Anti-Hero',
  artists: [{ name: 'Taylor Swift' }],
  album: {
    name: 'Midnights',
    images: [{ url: null }], // Placeholder for album art
  },
  is_playing: true,
  progress_ms: 120000,
  duration_ms: 200000,
  external_urls: { spotify: 'https://open.spotify.com/track/example1' },
};

/**
 * Hook-like function that returns mock Spotify data
 * In production, this would fetch from Spotify Web API
 */
export function useSpotifyData() {
  return {
    topTracks: mockTopTracks,
    nowPlaying: mockNowPlaying,
    isLoading: false,
    error: null,
  };
}


import { Card, Row, Col } from 'react-bootstrap';
import { useSpotify } from '../hooks/useSpotify';
import uwCrest from '../assets/bDHGPuGDEGalyH0Z_WU0K12PZ3UjHPWNH7ydzb8wWhY=.png';

/**
 * SpotifyNowSection - Real Spotify data styled like Kyan Cox's site
 * Shows Education, Last Played, and Top Tracks sections
 * Automatically fetches data without requiring user to connect
 */

// Format duration from milliseconds to MM:SS
function formatDuration(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Format time from ISO string to "3:42 PM" format
function formatTime(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
}

export default function SpotifyNowSection() {
  const { 
    isLoading, 
    error,
    nowPlaying, 
    topTracks, 
    recentlyPlayed,
    loginWithSpotify
  } = useSpotify();

  // Get last played track (prefer currently playing, then recently played)
  const lastPlayedTrack = nowPlaying?.item || (recentlyPlayed?.track || null);
  const lastPlayedAt = nowPlaying?.item 
    ? 'Now playing' 
    : recentlyPlayed?.played_at 
      ? formatTime(recentlyPlayed.played_at)
      : null;

  return (
    <section aria-labelledby="spotify-section-heading" className="mb-5 mt-5">
      <Row className="g-4 mb-4">
        {/* Education Card - Left */}
        <Col xs={12} md={6}>
          <Card className="h-100 now-card">
            <Card.Header className="d-flex align-items-center gap-2 now-card-header">
              <div className="education-icon-wrapper">
                <img 
                  src={uwCrest} 
                  alt="University of Wisconsin crest" 
                  className="uw-crest-icon"
                />
              </div>
              <span>Education</span>
            </Card.Header>
            <Card.Body>
              <div className="now-education-content">
                <p className="mb-2"><strong>University of Wisconsin - Madison</strong></p>
                <p className="mb-1">Majors: Computer Science, Statistics</p>
                <p className="mb-0">Expected: May 2028</p>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Last Played Card - Right */}
        <Col xs={12} md={6}>
          <Card className="h-100 now-card">
            <Card.Header className="d-flex align-items-center gap-2 now-card-header">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#1DB954" aria-hidden="true">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
              <span>
                {isLoading ? 'Loading...' : lastPlayedAt ? `Last played at ${lastPlayedAt}` : 'No recent tracks'}
              </span>
            </Card.Header>
            <Card.Body>
              {isLoading ? (
                <div className="text-center py-3">
                  <p className="text-muted mb-0">Loading...</p>
                </div>
              ) : lastPlayedTrack ? (
                <div className="d-flex align-items-center gap-3">
                  <div className="now-album-art">
                    <img 
                      src={lastPlayedTrack.album?.images?.[0]?.url || ''} 
                      alt={`${lastPlayedTrack.album?.name || 'Album'} album cover`}
                      className="now-album-image"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        if (e.target.nextSibling) {
                          e.target.nextSibling.style.display = 'flex';
                        }
                      }}
                    />
                    <div className="now-album-placeholder" style={{ display: 'none' }}>
                      <span>♪</span>
                    </div>
                  </div>
                  <div className="flex-grow-1">
                    <h3 className="h6 mb-1">
                      <a 
                        href={lastPlayedTrack.external_urls?.spotify || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-decoration-none now-track-link"
                      >
                        {lastPlayedTrack.name}
                      </a>
                    </h3>
                    <p className="text-muted small mb-0">
                      {lastPlayedTrack.artists?.map(a => a.name).join(', ') || 'Unknown artist'}
                    </p>
                  </div>
                </div>
              ) : error ? (
                <div className="text-center py-3">
                  <p className="text-danger small mb-2">{error}</p>
                  <button
                    onClick={loginWithSpotify}
                    className="btn btn-sm btn-primary"
                    style={{ fontSize: '0.85rem' }}
                  >
                    Connect Spotify
                  </button>
                </div>
              ) : (
                <div className="text-center py-3">
                  <p className="text-muted mb-2 small">No tracks available</p>
                  <button
                    onClick={loginWithSpotify}
                    className="btn btn-sm btn-primary"
                    style={{ fontSize: '0.85rem' }}
                  >
                    Connect Spotify
                  </button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Top Tracks Section */}
      <Card className="now-card">
        <Card.Header className="d-flex align-items-center justify-content-between now-card-header">
          <div className="d-flex align-items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#1DB954" aria-hidden="true">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            <span>Top tracks this month</span>
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          {isLoading ? (
            <div className="text-center py-4">
              <p className="text-muted mb-0">Loading tracks...</p>
            </div>
          ) : topTracks && topTracks.length > 0 ? (
            <div className="now-tracks-list">
              {topTracks.map((track) => (
                <a
                  key={track.id || track.rank}
                  href={track.external_urls?.spotify || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="now-track-row"
                  aria-label={`${track.rank}. ${track.name} by ${track.artists?.map(a => a.name).join(', ') || 'Unknown'} from ${track.album?.name || 'Unknown album'}. Click to open on Spotify.`}
                >
                  <div className="now-track-rank">{track.rank}</div>
                  <div className="now-track-album-art">
                    <img 
                      src={track.album?.images?.[2]?.url || track.album?.images?.[0]?.url || ''} 
                      alt={`${track.album?.name || 'Album'} album cover`}
                      className="now-track-image"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        if (e.target.nextSibling) {
                          e.target.nextSibling.style.display = 'flex';
                        }
                      }}
                    />
                    <div className="now-track-placeholder" style={{ display: 'none' }}>
                      <span>♪</span>
                    </div>
                  </div>
                  <div className="now-track-info flex-grow-1">
                    <div className="now-track-name">{track.name}</div>
                    <div className="now-track-artist text-muted small">
                      {track.artists?.map(a => a.name).join(', ') || 'Unknown artist'}
                    </div>
                  </div>
                  <div className="now-track-album text-muted small d-none d-md-block">
                    {track.album?.name || 'Unknown album'}
                  </div>
                  <div className="now-track-duration text-muted small">
                    {formatDuration(track.duration_ms || 0)}
                  </div>
                </a>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-4">
              <p className="text-danger small mb-2">{error}</p>
              <button
                onClick={loginWithSpotify}
                className="btn btn-sm btn-primary"
              >
                Connect Spotify
              </button>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted mb-2">No tracks available</p>
              <button
                onClick={loginWithSpotify}
                className="btn btn-sm btn-primary"
              >
                Connect Spotify
              </button>
            </div>
          )}
        </Card.Body>
      </Card>
    </section>
  );
}

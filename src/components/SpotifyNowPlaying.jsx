import { Card } from 'react-bootstrap';

/**
 * SpotifyNowPlaying - Card showing currently playing or last played track
 * Displays album art placeholder, track name, artist, and play status
 */
export default function SpotifyNowPlaying({ track }) {
  if (!track) return null;

  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Handle both API response formats
  const progressMs = track.progress_ms || 0;
  const durationMs = track.item?.duration_ms || track.duration_ms || 0;
  const isPlaying = track.is_playing !== undefined ? track.is_playing : track.is_playing;
  const trackItem = track.item || track; // API returns { item: {...}, is_playing: true }
  const progress = durationMs > 0 ? (progressMs / durationMs) * 100 : 0;

  return (
    <Card className="mb-4 spotify-now-playing">
      <Card.Body>
        <div className="d-flex align-items-center gap-3">
          {/* Album art placeholder */}
          <div 
            className="spotify-album-art"
            role="img"
            aria-label={`Album art for ${trackItem.album?.name || 'Unknown album'}`}
          >
            {trackItem.album?.images?.[0]?.url ? (
              <img 
                src={trackItem.album.images[0].url} 
                alt={`${trackItem.album.name} album cover`}
                className="spotify-album-image"
              />
            ) : (
              <div className="spotify-album-placeholder" aria-hidden="true">
                <span className="spotify-icon">♪</span>
              </div>
            )}
          </div>

          {/* Track info */}
          <div className="flex-grow-1">
            <div className="d-flex align-items-center gap-2 mb-1">
              {isPlaying && (
                <span className="spotify-playing-indicator" aria-label="Currently playing">
                  <span className="spotify-pulse"></span>
                  <span className="spotify-pulse"></span>
                  <span className="spotify-pulse"></span>
                </span>
              )}
              <span className="small text-muted">
                {isPlaying ? 'Now playing' : 'Last played'}
              </span>
            </div>
            <Card.Title as="h3" className="h5 mb-1">
              <a 
                href={trackItem.external_urls?.spotify} 
                target="_blank" 
                rel="noreferrer"
                className="text-decoration-none"
                aria-label={`${trackItem.name} by ${trackItem.artists?.map(a => a.name).join(', ') || 'Unknown artist'} on Spotify`}
              >
                {trackItem.name}
              </a>
            </Card.Title>
            <Card.Text className="text-muted small mb-2">
              {trackItem.artists?.map(a => a.name).join(', ') || 'Unknown artist'}
            </Card.Text>
            {durationMs > 0 && (
              <div className="small text-muted">
                {formatDuration(progressMs)} / {formatDuration(durationMs)}
              </div>
            )}
          </div>
        </div>

        {/* Progress bar */}
        {isPlaying && progressMs > 0 && (
          <div className="mt-3">
            <div 
              className="spotify-progress-bar"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin="0"
              aria-valuemax="100"
              aria-label="Track progress"
            >
              <div 
                className="spotify-progress-fill"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}


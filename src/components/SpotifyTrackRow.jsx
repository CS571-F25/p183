/**
 * SpotifyTrackRow - Accessible row component for a single track in the top tracks list
 * Keyboard navigable with hover/focus states
 */
export default function SpotifyTrackRow({ track, rank }) {
  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const artists = track.artists.map(a => a.name).join(', ');

  return (
    <div 
      className="spotify-track-row"
      role="row"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (track.external_urls?.spotify) {
            window.open(track.external_urls.spotify, '_blank', 'noopener,noreferrer');
          }
        }
      }}
      onClick={() => {
        if (track.external_urls?.spotify) {
          window.open(track.external_urls.spotify, '_blank', 'noopener,noreferrer');
        }
      }}
      aria-label={`${rank}. ${track.name} by ${artists} from ${track.album.name}. Click to open on Spotify.`}
    >
      <div className="spotify-track-rank" aria-hidden="true">
        {rank}
      </div>
      <div className="spotify-track-info flex-grow-1">
        <div className="spotify-track-name">
          {track.name}
        </div>
        <div className="spotify-track-artist text-muted small">
          {artists}
        </div>
      </div>
      <div className="spotify-track-album text-muted small d-none d-md-block">
        {track.album.name}
      </div>
      <div className="spotify-track-duration text-muted small">
        {formatDuration(track.duration_ms)}
      </div>
    </div>
  );
}


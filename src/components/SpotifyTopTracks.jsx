import { Card } from 'react-bootstrap';
import SpotifyTrackRow from './SpotifyTrackRow.jsx';

/**
 * SpotifyTopTracks - Card displaying top tracks for the month
 * Accessible list with keyboard navigation
 */
export default function SpotifyTopTracks({ tracks }) {
  if (!tracks || tracks.length === 0) {
    return null;
  }

  return (
    <Card className="spotify-top-tracks">
      <Card.Header>
        <h2 className="h5 mb-0">Top tracks this month</h2>
      </Card.Header>
      <Card.Body className="p-0">
        <div 
          role="list"
          aria-label="Top tracks this month"
          className="spotify-tracks-list"
        >
          {tracks.map((track) => (
            <SpotifyTrackRow 
              key={track.id} 
              track={track} 
              rank={track.rank}
            />
          ))}
        </div>
      </Card.Body>
    </Card>
  );
}


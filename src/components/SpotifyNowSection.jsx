import { Card, Button } from 'react-bootstrap';

/**
 * SpotifyNowSection - Static music section for GitHub Pages
 * Shows a curated playlist link without requiring backend OAuth
 */
export default function SpotifyNowSection() {
  return (
    <section aria-labelledby="spotify-heading" className="mb-5">
      <h2 id="spotify-heading" className="mb-4">Music I'm Listening To</h2>
      <Card className="mb-4">
        <Card.Body>
          <p className="mb-3">
            A curated playlist I use for focus and coding sessions. This collection includes indie pop, 
            ambient tracks, and instrumental music that helps me stay productive.
          </p>
          <Button
            href="https://open.spotify.com/playlist/your-playlist-id"
            target="_blank"
            rel="noopener noreferrer"
            variant="primary"
            className="btn-custom-primary"
            aria-label="Listen to Shivani's Spotify playlist in new tab"
          >
            Listen on Spotify
          </Button>
        </Card.Body>
      </Card>
    </section>
  );
}

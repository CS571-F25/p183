import { Container } from 'react-bootstrap';
import SpotifyNowSection from './SpotifyNowSection.jsx';

/**
 * Now - Main page showing Education, Last Played, and Top Tracks
 * Styled similar to Kyan Cox's site
 */
export default function Now() {
  return (
    <main>
      <Container className="py-5">
        <header className="mb-5">
          <h1>Now</h1>
        </header>

        {/* Education, Last Played, and Top Tracks section */}
        <SpotifyNowSection />
      </Container>
    </main>
  );
}

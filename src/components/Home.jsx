import { Container, Row, Col } from "react-bootstrap";
import Avatar from "./Avatar.jsx";
// Import outdoor mural photo
import outdoorPhoto from "../assets/IMG_1964.PNG";

/**
 * Home - Landing page with introduction, quick navigation, and Spotify data
 * Two-column layout on desktop: avatar on left, text on right
 * Stacked on mobile with centered avatar
 */
export default function Home() {
  return (
    <main>
      <section className="home-hero" aria-labelledby="home-heading">
        <Container>
          <Row className="align-items-center">
            {/* Avatar column - left on desktop, centered on mobile */}
            <Col xs={12} lg={4} className="text-center text-lg-start mb-4 mb-lg-0">
              <Avatar 
                size="lg" 
                variant="photo"
                src={outdoorPhoto} 
                showBorder={true} 
                alt="Shivani Potnuru standing in front of a colorful mural" 
                className="home-avatar profile-avatar"
              />
            </Col>

            {/* Text content column - right on desktop */}
            <Col xs={12} lg={8}>
              <h1 id="home-heading" className="home-title">
                Hi <span aria-hidden="true">👋</span>
              </h1>
              <h2 className="home-subtitle-large">
                I'm Shivani Potnuru.
              </h2>

              <p className="home-intro">
                I'm a computer science & statistics major at UW–Madison interested in data science and user experience design. 
                I like building data-driven interfaces that are accessible and easy to use.
              </p>

              <div className="mt-4 d-flex flex-wrap gap-3">
                <a
                  href="https://github.com/spotnuru12"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link-hero"
                  aria-label="GitHub profile"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  <span>GitHub</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/shivanipotnuru"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link-hero"
                  aria-label="LinkedIn profile"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  <span>LinkedIn</span>
                </a>
                <a
                  href={`${import.meta.env.BASE_URL}resume.pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link-hero"
                  aria-label="View resume PDF"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                  </svg>
                  <span>Resume</span>
                </a>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
}
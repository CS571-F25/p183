import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Avatar from "./Avatar.jsx";
// Import professional headshot
import headshot from "../assets/DSCF8789.JPG";

/**
 * Home - Landing page with introduction and quick navigation
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
                src={headshot} 
                showBorder={true} 
                alt="Portrait of Shivani Potnuru" 
                className="home-avatar"
              />
            </Col>

            {/* Text content column - right on desktop */}
            <Col xs={12} lg={8}>
              <p className="home-hello" role="text" aria-label="Greeting">
                Hello! <span aria-hidden="true">👋</span>
              </p>

              <h1 id="home-heading" className="home-title">
                I'm Shivani Potnuru.
              </h1>

              <p className="home-intro">
                I'm a computer science & statistics major at UW–Madison interested in data science and user experience design. 
                I like building data-driven interfaces that are accessible and easy to use.
              </p>

              <div className="mt-4 d-flex flex-wrap gap-3">
                <Button as={Link} to="/work" size="lg" className="btn-hero-primary">
                  View My Work
                </Button>
                <Button as={Link} to="/now" size="lg" className="btn-hero-outline">
                  What I'm Doing Now
                </Button>
                <Button as={Link} to="/contact" size="lg" className="btn-hero-outline">
                  Get in Touch
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
}
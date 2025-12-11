import { Container, Row, Col } from "react-bootstrap";
import Avatar from "./Avatar.jsx";
// Import outdoor mural photo
import outdoorPhoto from "../assets/IMG_1964.PNG";

/**
 * AboutMe - About page with biographical information
 * Avatar on left, text on right on desktop; stacked on mobile
 * Uses semantic HTML and proper heading hierarchy
 */
export default function AboutMe() {
  return (
    <main>
      <Container className="py-5">
        <header className="mb-5">
          <h1>About Me</h1>
        </header>

        <Row className="align-items-start">
          {/* Avatar column - left on desktop */}
          <Col xs={12} md={4} lg={3} className="text-center text-md-start mb-4 mb-md-0">
            <Avatar 
              size="lg" 
              variant="photo"
              src={outdoorPhoto} 
              showBorder={true} 
              alt="Shivani Potnuru standing in front of a colorful mural" 
            />
          </Col>

          {/* Content column - right on desktop */}
          <Col xs={12} md={8} lg={9}>
            <section aria-labelledby="bio-heading">
              <h2 id="bio-heading">Background</h2>
              <p>
                I'm a Computer Science & Statistics student at UW–Madison. I'm interested in using data and UX to support decision making, 
                especially in healthcare and civic engagement contexts.
              </p>
              <p>
                My work spans data visualization, human–computer interaction research, and accessible interface design. I'm inspired by 
                faculty like Yuhang Zhao who work on accessibility, AR/VR, and AI-powered interactive systems.
              </p>
              <p>
                I like designing interfaces that make complex data and decisions easier to understand, particularly for people who need 
                to make important choices about their health, voting, or other civic matters.
              </p>
            </section>

            <section aria-labelledby="interests-heading" className="mt-4">
              <h2 id="interests-heading">Interests</h2>
              <ul>
                <li><strong>Data Science / Analytics</strong></li>
                <li><strong>Human–Computer Interaction / UX Research</strong></li>
                <li><strong>Accessible Interfaces & Visualization</strong></li>
              </ul>
            </section>

            <section aria-labelledby="current-roles-heading" className="mt-4">
              <h2 id="current-roles-heading">Current Roles</h2>
              <p>
                <strong>Design Interactive – Cohort Manager:</strong> Leading a student team on a semester-long client project with 
                Wisconsin Conservation Voices, translating client goals into actionable design tasks and coordinating a website redesign 
                focused on accessibility.
              </p>
              <p>
                <strong>Biokind Analytics – Data Analyst:</strong> Working with public data APIs and dashboards to benchmark Dane County 
                against peer counties.
              </p>
            </section>

            <section aria-labelledby="goals-heading" className="mt-4">
              <h2 id="goals-heading">Goals</h2>
              <p>
                I want to design tools that help people make complex decisions (like medical decisions or voting) more confidently. 
                I'm interested in combining data analysis with user-centered design to create interfaces that are both informative and accessible.
              </p>
            </section>
          </Col>
        </Row>
      </Container>
    </main>
  );
}
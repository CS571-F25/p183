import { Container } from "react-bootstrap";
import SpotifyNowSection from "./SpotifyNowSection.jsx";

/**
 * AboutMe - About page with biographical information
 * Centered text layout
 * Uses semantic HTML and proper heading hierarchy
 */
export default function AboutMe() {
  return (
    <main>
      <Container className="py-5">
        <header className="mb-5 text-center">
          <h1>About Me</h1>
        </header>

        <div className="mx-auto" style={{ maxWidth: '800px' }}>
            <section aria-labelledby="bio-heading">
              <h2 id="bio-heading" className="about-section-heading">Background</h2>
              <p>
                I'm a Computer Science & Statistics student at UW–Madison interested in using data and UX to support decision making, 
                especially in healthcare and civic engagement.
              </p>
              <p>
                My work sits at the intersection of data visualization, human–computer interaction, and accessible interface design. 
                I like building tools that make complex information and choices easier to understand so people can confidently decide what to do next.
              </p>
            </section>

            <section aria-labelledby="interests-heading" className="mt-4">
              <h2 id="interests-heading" className="about-section-heading">Interests</h2>
              <ul>
                <li><strong>Data Science & Analytics</strong></li>
                <li><strong>Human–Computer Interaction / UX Research</strong></li>
                <li><strong>Accessible Interfaces & Visualization</strong></li>
              </ul>
            </section>

            <section aria-labelledby="current-roles-heading" className="mt-4">
              <h2 id="current-roles-heading" className="about-section-heading">Current Roles</h2>
              <p>
                <strong>Design Interactive – Cohort Manager:</strong> Leading a student team on a semester-long client project with 
                Wisconsin Conservation Voices. I help translate client goals into actionable design tasks and coordinate our accessibility-focused redesign work.
              </p>
              <p>
                <strong>Biokind Analytics – Data Analyst:</strong> Working with public data APIs and dashboards to benchmark Dane County 
                against peer counties and explore patterns in health and social outcomes.
              </p>
            </section>

            <section aria-labelledby="goals-heading" className="mt-4">
              <h2 id="goals-heading" className="about-section-heading">Goals</h2>
              <p>
                I want to design tools that help people make complex decisions—like health, education, or voting decisions—more confidently. 
                I'm especially interested in combining rigorous data analysis with user-centered design so that interfaces are both informative and genuinely usable.
              </p>
            </section>
        </div>

        {/* Education and Spotify Section */}
        <div className="mt-5">
          <SpotifyNowSection />
        </div>
      </Container>
    </main>
  );
}
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import ThemeToggle from "./ThemeToggle.jsx";

/**
 * NavBar - Primary navigation component with theme toggle
 * Enhanced hover and active states with accessible focus indicators
 */
export default function NavBar() {
  return (
    <Navbar expand="md" sticky="top" className="navbar-custom mb-4">
      <Container fluid>
        <Navbar.Brand as={NavLink} to="/" className="navbar-brand-custom" aria-label="Shivani Potnuru - Home">
          Shivani Potnuru
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-nav" aria-label="Toggle navigation menu" />
        <Navbar.Collapse id="main-nav" className="justify-content-end">
          <Nav className="me-3 nav-custom">
            <Nav.Link 
              as={NavLink} 
              to="/" 
              end
              className="nav-link-custom"
            >
              Home
            </Nav.Link>
            <Nav.Link 
              as={NavLink} 
              to="/about"
              className="nav-link-custom"
            >
              About
            </Nav.Link>
            <Nav.Link 
              as={NavLink} 
              to="/work"
              className="nav-link-custom"
            >
              Work
            </Nav.Link>
            <Nav.Link 
              as={NavLink} 
              to="/contact"
              className="nav-link-custom"
            >
              Contact
            </Nav.Link>
          </Nav>

          <div className="d-flex align-items-center">
            <ThemeToggle />
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
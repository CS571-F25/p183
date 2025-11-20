import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { NavLink } from "react-router-dom";

export default function NavBar() {
  return (
    <Navbar bg="light" expand="md" sticky="top" className="mb-4">
      <Container fluid>
        <Navbar.Brand as={NavLink} to="/">
          Shivani Potnuru
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav" className="justify-content-end">
          <Nav className="me-3">
            <Nav.Link as={NavLink} to="/" end>
              Home
            </Nav.Link>
            <Nav.Link as={NavLink} to="/about">
              About
            </Nav.Link>
            <Nav.Link as={NavLink} to="/work">
              Work
            </Nav.Link>
            <Nav.Link as={NavLink} to="/contact">
              Contact
            </Nav.Link>
          </Nav>

          <Button
            variant="dark"
            href={`${import.meta.env.BASE_URL}resume.pdf`}
            target="_blank"
            rel="noreferrer"
          >
            View Resume
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
import { Container, Form, Button } from "react-bootstrap";

export default function Contact() {
  return (
    <Container className="py-4">
      <h1 className="mb-4">Get in Touch</h1>
      <Form>
        <Form.Group className="mb-3" controlId="contactEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" placeholder="Your email" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="contactName">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" placeholder="Your name" />
        </Form.Group>
        <Form.Group className="mb-4" controlId="contactMessage">
          <Form.Label>Message</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            placeholder="Write your message here..."
          />
        </Form.Group>
        <Button variant="dark" type="submit">
          Send
        </Button>
      </Form>
    </Container>
  );
}
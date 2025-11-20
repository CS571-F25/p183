import { Card, Button } from "react-bootstrap";

export default function ProjectCard({ title, description, link }) {
  return (
    <Card className="mb-4">
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>{description}</Card.Text>
        {link && (
          <Button variant="dark" href={link} target="_blank" rel="noreferrer">
            View Project
          </Button>
        )}
      </Card.Body>
    </Card>
  );
}
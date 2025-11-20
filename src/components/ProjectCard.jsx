import { Card, Badge } from "react-bootstrap";

export default function ProjectCard({ title, role, timeframe, description, tags }) {
  return (
    <Card className="mb-4">
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        {role && timeframe && (
          <Card.Subtitle className="mb-2 text-muted">
            {role} · {timeframe}
          </Card.Subtitle>
        )}
        <Card.Text>{description}</Card.Text>
        {tags &&
          tags.map((tag) => (
            <Badge key={tag} bg="secondary" className="me-2">
              {tag}
            </Badge>
          ))}
      </Card.Body>
    </Card>
  );
}
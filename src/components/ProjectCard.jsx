import { Card, Badge, Button } from "react-bootstrap";

/**
 * ProjectCard - Accessible card component for displaying work projects
 * Uses semantic HTML and proper heading hierarchy
 * Supports clickable cards with external links
 */
export default function ProjectCard({ title, role, timeframe, description, tags, externalLink, imageSrc, imageAlt }) {
  const cardId = `project-${title.replace(/\s+/g, '-').toLowerCase()}`;
  
  // Handle both single image and array of images
  const images = Array.isArray(imageSrc) ? imageSrc : (imageSrc ? [imageSrc] : []);
  const altTexts = Array.isArray(imageAlt) ? imageAlt : (imageAlt ? [imageAlt] : []);
  
  const cardContent = (
    <Card.Body>
      {images.length > 0 && (
        <div className="mb-3 project-card-image-wrapper">
          {images.length === 1 ? (
            <img
              src={images[0]}
              alt={altTexts[0] || `${title} thumbnail`}
              className="project-card-image"
              loading="lazy"
            />
          ) : (
            <div className="project-card-image-gallery">
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={altTexts[index] || `${title} screenshot ${index + 1}`}
                  className="project-card-image"
                  loading="lazy"
                />
              ))}
            </div>
          )}
        </div>
      )}
      <Card.Title as="h3" id={cardId} className="d-flex align-items-center gap-2">
        {title}
        {externalLink && (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
        )}
      </Card.Title>
      {role && timeframe && (
        <Card.Subtitle as="p" className="mb-2 text-muted">
          <span className="visually-hidden">Role: </span>
          {role} · <time dateTime={timeframe}>{timeframe}</time>
        </Card.Subtitle>
      )}
      <Card.Text>{description}</Card.Text>
      {tags && tags.length > 0 && (
        <div role="list" aria-label="Project tags" className="mb-3">
          {tags.map((tag) => (
            <Badge 
              key={tag} 
              bg="secondary" 
              className="me-2"
              role="listitem"
            >
              {tag}
            </Badge>
          ))}
        </div>
      )}
      {externalLink && (
        <Button
          as="a"
          href={externalLink}
          target="_blank"
          rel="noopener noreferrer"
          variant="outline-primary"
          size="sm"
          className="btn-hero-outline"
          aria-label={`View ${title} project details`}
        >
          {title.includes("Wisconsin Conservation") ? "View Slides" : "View Project"}
        </Button>
      )}
    </Card.Body>
  );

  return (
    <Card className="mb-4" role="article" aria-labelledby={cardId}>
      {cardContent}
    </Card>
  );
}
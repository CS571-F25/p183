import { useState } from 'react';
import { Card, Badge, Button } from 'react-bootstrap';

/**
 * NowItem - Expandable card component for individual "Now" page items
 * Shows title, date, and category badge
 * Expands to show notes and optional link
 */
export default function NowItem({ type, title, date, notes, link }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getCategoryLabel = (category) => {
    const labels = {
      music: 'Music',
      reading: 'Reading',
      project: 'Project',
    };
    return labels[category] || category;
  };

  const getCategoryVariant = (category) => {
    const variants = {
      music: 'primary',
      reading: 'success',
      project: 'info',
    };
    return variants[category] || 'secondary';
  };

  return (
    <Card className="h-100">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div className="flex-grow-1">
            <Card.Title as="h3" className="h5 mb-2">
              {title}
            </Card.Title>
            <div className="d-flex flex-wrap gap-2 align-items-center mb-2">
              <Badge bg={getCategoryVariant(type)}>
                {getCategoryLabel(type)}
              </Badge>
              <time dateTime={date} className="text-muted small">
                {formatDate(date)}
              </time>
            </div>
          </div>
        </div>

        {notes && (
          <div>
            {isExpanded ? (
              <div>
                <Card.Text className="mb-3">{notes}</Card.Text>
                {link && (
                  <Button
                    variant="outline-primary"
                    size="sm"
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                    className="me-2"
                    aria-label={`Open ${title} in new tab`}
                  >
                    View Link
                  </Button>
                )}
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => setIsExpanded(false)}
                  aria-expanded="true"
                  aria-controls={`notes-${title}`}
                >
                  Show Less
                </Button>
              </div>
            ) : (
              <Button
                variant="link"
                className="p-0 text-start"
                onClick={() => setIsExpanded(true)}
                aria-expanded="false"
                aria-controls={`notes-${title}`}
              >
                Show More
              </Button>
            )}
          </div>
        )}
      </Card.Body>
    </Card>
  );
}


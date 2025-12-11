import { Alert } from 'react-bootstrap';

/**
 * SuccessMessage - Accessible alert component for form submission success
 * Used in Contact form to confirm message was sent
 */
export default function SuccessMessage({ show, onClose, message }) {
  if (!show) return null;

  return (
    <Alert
      variant="success"
      dismissible
      onClose={onClose}
      role="alert"
      aria-live="polite"
      className="mt-3"
    >
      <Alert.Heading>Message Sent!</Alert.Heading>
      <p className="mb-0">{message}</p>
    </Alert>
  );
}


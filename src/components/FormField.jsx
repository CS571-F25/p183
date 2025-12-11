import { Form } from 'react-bootstrap';

/**
 * FormField - Reusable form field component with inline validation
 * Provides accessible labels, error messages, and visual feedback
 */
export default function FormField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  touched,
  placeholder,
  required = false,
  rows,
  as,
  ariaDescribedBy,
}) {
  const hasError = touched && error;
  const isValid = touched && !error && value;

  return (
    <Form.Group className="mb-3" controlId={id}>
      <Form.Label>
        {label}
        {required && <span className="text-danger" aria-label="required"> *</span>}
      </Form.Label>
      <Form.Control
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        isInvalid={hasError}
        isValid={isValid}
        required={required}
        rows={rows}
        as={as}
        aria-describedby={ariaDescribedBy || (hasError ? `${id}-error` : undefined)}
        aria-invalid={hasError}
        aria-required={required}
      />
      {hasError && (
        <Form.Control.Feedback type="invalid" id={`${id}-error`} role="alert">
          {error}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
}


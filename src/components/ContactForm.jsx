import { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import FormField from './FormField.jsx';
import SuccessMessage from './SuccessMessage.jsx';
import { API_ENDPOINTS } from '../config/backendConfig.js';

/**
 * ContactForm - Interactive contact form with real-time validation
 * Provides inline feedback as user types and confirms submission
 */
export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    message: false,
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [submittedMessages, setSubmittedMessages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Validation functions
  const validateName = (name) => {
    if (!name.trim()) {
      return 'Name is required';
    }
    if (name.trim().length < 2) {
      return 'Name must be at least 2 characters';
    }
    return '';
  };

  const validateEmail = (email) => {
    if (!email.trim()) {
      return 'Email is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const validateMessage = (message) => {
    if (!message.trim()) {
      return 'Message is required';
    }
    if (message.trim().length < 10) {
      return 'Message must be at least 10 characters';
    }
    return '';
  };

  const getFieldError = (fieldName) => {
    const value = formData[fieldName];
    switch (fieldName) {
      case 'name':
        return validateName(value);
      case 'email':
        return validateEmail(value);
      case 'message':
        return validateMessage(value);
      default:
        return '';
    }
  };

  const handleChange = (fieldName) => (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [fieldName]: value }));

    // Clear success message when user starts typing again
    if (showSuccess) {
      setShowSuccess(false);
    }
  };

  const handleBlur = (fieldName) => () => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      name: true,
      email: true,
      message: true,
    });

    // Validate all fields
    const nameError = validateName(formData.name);
    const emailError = validateEmail(formData.email);
    const messageError = validateMessage(formData.message);

    // If there are errors, don't submit
    if (nameError || emailError || messageError) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Send to backend endpoint with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(API_ENDPOINTS.contact, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send message');
      }

      // Show success message
      setShowSuccess(true);

      // Reset form
      setFormData({
        name: '',
        email: '',
        message: '',
      });
      setTouched({
        name: false,
        email: false,
        message: false,
      });

      // Scroll to success message
      setTimeout(() => {
        const successElement = document.querySelector('[role="alert"]');
        if (successElement) {
          successElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 100);
    } catch (error) {
      console.error('Contact form submission error:', error);
      if (error.name === 'AbortError') {
        setSubmitError('Request timed out. The message was received but email delivery may be delayed. Please try again if needed.');
      } else {
        setSubmitError(error.message || 'Failed to send message. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    return (
      !validateName(formData.name) &&
      !validateEmail(formData.email) &&
      !validateMessage(formData.message)
    );
  };

  return (
    <Container className="py-4">
      <header className="mb-4">
        <h1>Get in Touch</h1>
        <p className="lead">
          Have a question or want to collaborate? Fill out the form below and I'll get back to you.
        </p>
      </header>

      <Form onSubmit={handleSubmit} noValidate>
        <FormField
          id="contactName"
          label="Name"
          type="text"
          value={formData.name}
          onChange={handleChange('name')}
          onBlur={handleBlur('name')}
          error={touched.name ? getFieldError('name') : ''}
          touched={touched.name}
          placeholder="Your name"
          required
        />

        <FormField
          id="contactEmail"
          label="Email"
          type="email"
          value={formData.email}
          onChange={handleChange('email')}
          onBlur={handleBlur('email')}
          error={touched.email ? getFieldError('email') : ''}
          touched={touched.email}
          placeholder="your.email@example.com"
          required
        />

        <FormField
          id="contactMessage"
          label="Message"
          type="text"
          value={formData.message}
          onChange={handleChange('message')}
          onBlur={handleBlur('message')}
          error={touched.message ? getFieldError('message') : ''}
          touched={touched.message}
          placeholder="Write your message here..."
          required
          rows={4}
          as="textarea"
        />

        <Button
          variant="primary"
          type="submit"
          disabled={!isFormValid() || isSubmitting}
          aria-describedby="submit-help"
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </Button>
        {submitError && (
          <div className="alert alert-danger mt-3" role="alert">
            {submitError}
          </div>
        )}
        <div id="submit-help" className="visually-hidden">
          {isFormValid()
            ? 'Form is valid and ready to submit'
            : 'Please fill out all required fields correctly'}
        </div>
      </Form>

      <SuccessMessage
        show={showSuccess}
        onClose={() => setShowSuccess(false)}
        message="Thank you for your message! I'll get back to you soon."
      />
    </Container>
  );
}


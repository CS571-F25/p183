/**
 * SkipLink - Accessible skip navigation link for keyboard users
 * Allows users to skip directly to main content
 */
export default function SkipLink() {
  return (
    <a
      href="#main-content"
      className="skip-link visually-hidden-focusable"
      style={{
        position: 'absolute',
        top: '-40px',
        left: '0',
        background: '#000',
        color: '#fff',
        padding: '8px 16px',
        textDecoration: 'none',
        zIndex: 1000,
      }}
      onFocus={(e) => {
        e.target.style.top = '0';
      }}
      onBlur={(e) => {
        e.target.style.top = '-40px';
      }}
    >
      Skip to main content
    </a>
  );
}


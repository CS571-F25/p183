/**
 * Avatar - Reusable circular avatar component
 * Supports different sizes, variants (placeholder/photo), and optional border
 */
export default function Avatar({ 
  size = 'lg', 
  variant = 'placeholder',
  showBorder = true, 
  src = null,
  alt = 'Portrait of Shivani Potnuru',
  className = ''
}) {
  const sizeClasses = {
    sm: 'avatar-small',
    md: 'avatar-medium',
    lg: 'avatar-large',
    // Legacy support
    small: 'avatar-small',
    medium: 'avatar-medium',
    large: 'avatar-large',
  };

  const sizeValue = sizeClasses[size] || sizeClasses.lg;
  const hasImage = variant === 'photo' && src;

  return (
    <div 
      className={`avatar ${sizeValue} ${showBorder ? 'avatar-border' : ''} ${className}`}
      role="img"
      aria-label={alt}
    >
      {hasImage ? (
        <img 
          src={src} 
          alt={alt}
          className="avatar-image"
          loading="lazy"
        />
      ) : (
        <div className="avatar-placeholder" aria-hidden="true">
          {/* Placeholder circle - ready for image */}
        </div>
      )}
    </div>
  );
}


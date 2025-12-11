import { Button } from 'react-bootstrap';
import { useTheme } from '../contexts/ThemeContext';

/**
 * ThemeToggle - Accessible button to switch between light and dark themes
 * Used in NavBar for site-wide theme control
 */
export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Button
      variant="outline-secondary"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className="ms-2 theme-toggle-btn"
      size="sm"
    >
      {isDark ? '☀️' : '🌙'}
    </Button>
  );
}


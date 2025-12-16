# Project Requirements Checklist

## ✅ Core Requirements

### 1. ✅ Committed and pushed to GitHub
- **Status:** YES
- **Evidence:** Git log shows commits, remote is configured to `https://github.com/CS571-F25/p183.git`
- **Last commit:** `b0f5309 Fix contact form hanging - send email in background`

### 2. ✅ Live and functional on GitHub.io
- **Status:** YES
- **URL:** https://cs571-f25.github.io/p183/
- **Evidence:** User has confirmed deployment

### 3. ✅ Consistent use of React Bootstrap
- **Status:** YES
- **Evidence:** 
  - `package.json` includes `react-bootstrap: ^2.10.10`
  - All components use React Bootstrap components (Navbar, Container, Card, Button, Form, etc.)
  - Bootstrap CSS imported in `main.jsx`

### 4. ✅ Primary navigation bar present and functional
- **Status:** YES
- **Component:** `src/components/NavBar.jsx`
- **Features:**
  - Sticky top navigation
  - Responsive hamburger menu
  - Links to: Home, About, Work, Contact
  - Theme toggle integrated
  - Accessible with ARIA labels

### 5. ✅ At least 3 pages fully developed using React Router
- **Status:** YES (4 pages total)
- **Pages:**
  1. **Home** (`/`) - Landing page with intro and avatar
  2. **About** (`/about`) - Biography, interests, roles, goals, Spotify section
  3. **Work** (`/work`) - Portfolio projects with filtering
  4. **Contact** (`/contact`) - Contact form
- **Router:** Using `react-router-dom` with `HashRouter`

### 6. ✅ At least 12 components defined and meaningfully used
- **Status:** YES (22+ components found)
- **Components:**
  1. `App.jsx` - Main app component
  2. `SkipLink.jsx` - Accessibility skip link
  3. `NavBar.jsx` - Primary navigation
  4. `Home.jsx` - Landing page
  5. `AboutMe.jsx` - About page
  6. `Work.jsx` - Work/portfolio page
  7. `Contact.jsx` - Contact page wrapper
  8. `ContactForm.jsx` - Interactive contact form
  9. `FormField.jsx` - Reusable form field component
  10. `SuccessMessage.jsx` - Success alert component
  11. `Footer.jsx` - Site footer
  12. `ProjectCard.jsx` - Project display card
  13. `RoleFilter.jsx` - Work page filter buttons
  14. `ThemeToggle.jsx` - Dark/light theme switcher
  15. `Avatar.jsx` - Profile image component
  16. `SpotifyNowSection.jsx` - Spotify integration section
  17. `SpotifyNowPlaying.jsx` - Currently playing track
  18. `SpotifyTopTracks.jsx` - Top tracks display
  19. `SpotifyTrackRow.jsx` - Individual track row
  20. `FilterBar.jsx` - Filter controls
  21. `SortControl.jsx` - Sort controls
  22. `NowItem.jsx` - Now page item
  23. `ThemeContext.jsx` - Theme context provider

### 7. ✅ Meaningfully interactable element
- **Status:** YES
- **Interactive Elements:**
  - **Contact Form** (`ContactForm.jsx`): Real-time validation, form submission, success/error feedback
  - **Theme Toggle** (`ThemeToggle.jsx`): Switches between light/dark themes
  - **Role Filter** (`RoleFilter.jsx`): Filters work projects by role focus (Data Science/UI/UX)
  - **Spotify Integration**: Real-time data fetching and display (auto-updates)
  - **Navigation**: Clickable links, responsive menu

### 8. ✅ Thoughtful use of design principles
- **Status:** YES
- **Evidence:**
  - Consistent spacing and typography
  - Responsive design (mobile-first)
  - Visual hierarchy (headings, sections)
  - Color scheme with theme support
  - Consistent component styling
  - Accessible focus states
  - Semantic HTML structure

## ✅ Accessibility Requirements

### 9. ✅ No skipped heading levels
- **Status:** YES
- **Verification:**
  - **Home:** h1 → h2 (no skip)
  - **About:** h1 → h2 (no skip)
  - **Work:** h1 (no skip)
  - **Contact:** h1 (no skip)
  - **ProjectCard:** Uses `as="h3"` (proper hierarchy)
  - All pages follow proper heading hierarchy

### 10. ✅ Appropriate alt text on all images
- **Status:** YES
- **Images with alt text:**
  1. `Home.jsx`: Avatar - `"Shivani Potnuru standing in front of a colorful mural"`
  2. `SpotifyNowSection.jsx`: UW crest - `"University of Wisconsin crest"`
  3. `SpotifyNowSection.jsx`: Album covers - Dynamic alt text with album names
  4. `ProjectCard.jsx`: Project images - Dynamic alt text with project titles
  5. `Avatar.jsx`: Profile photos - Uses `alt` prop
  6. `SpotifyNowPlaying.jsx`: Album covers - Dynamic alt text
- **All images have descriptive alt text**

### 11. ⚠️ Sufficient color contrast (WCAG AA standards)
- **Status:** NEEDS VERIFICATION
- **Note:** Color contrast should be manually tested using browser dev tools or tools like:
  - WebAIM Contrast Checker
  - Chrome DevTools Lighthouse
  - axe DevTools
- **Recommendation:** Test all text/background combinations, especially:
  - Primary text on background
  - Button text on button background
  - Link colors
  - Form field borders/errors
  - Both light and dark themes

### 12. ✅ All inputs appropriately labeled
- **Status:** YES
- **Evidence:**
  - `FormField.jsx` uses `<Form.Label>` with `htmlFor` (via `controlId`)
  - All form fields have associated labels:
    - Name field: `label="Name"`
    - Email field: `label="Email"`
    - Message field: `label="Message"`
  - `RoleFilter.jsx` has hidden label for screen readers
  - All inputs use `aria-label` or `aria-labelledby` where appropriate

### 13. ✅ All forms completable via keyboard
- **Status:** YES
- **Evidence:**
  - Standard HTML form elements (input, textarea, button)
  - All form fields are keyboard accessible
  - Submit button can be activated with Enter key
  - Tab order is logical (name → email → message → submit)
  - Focus indicators visible (Bootstrap default + custom styles)
  - Theme toggle is keyboard accessible (Button component)
  - Navigation links are keyboard accessible
  - Role filter buttons are keyboard accessible

## Summary

**✅ Requirements Met: 12/13**
**⚠️ Needs Manual Verification: 1/13 (Color Contrast)**

### Next Steps:
1. **Test color contrast** using browser dev tools or online tools
2. **Commit and push** any remaining changes
3. **Final accessibility audit** using Lighthouse or axe DevTools

### Quick Color Contrast Test:
1. Open https://cs571-f25.github.io/p183/ in Chrome
2. Open DevTools → Lighthouse
3. Run accessibility audit
4. Check for contrast issues
5. Test both light and dark themes




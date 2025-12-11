import { useState, useMemo } from 'react';
import { Container } from 'react-bootstrap';
import SpotifyNowSection from './SpotifyNowSection.jsx';
import NowItem from './NowItem.jsx';
import FilterBar from './FilterBar.jsx';
import SortControl from './SortControl.jsx';

/**
 * Sample data for the "Now" page
 * In a real app, this could come from an API or be more dynamic
 */
const nowData = [
  {
    id: 1,
    type: 'music',
    title: 'Spotify Playlist: Indie Pop Vibes',
    date: '2025-01-15',
    notes: 'Currently loving this curated playlist with artists like Clairo, Phoebe Bridgers, and boygenius. Perfect for coding sessions.',
    link: 'https://open.spotify.com/playlist/example',
  },
  {
    id: 2,
    type: 'reading',
    title: 'The Design of Everyday Things by Don Norman',
    date: '2025-01-10',
    notes: 'Learning about user-centered design principles. Great insights on how good design is invisible and bad design is obvious.',
    link: null,
  },
  {
    id: 3,
    type: 'project',
    title: 'Personal Website Redesign',
    date: '2025-01-12',
    notes: 'Working on implementing React Router, theme toggle, and improved accessibility features. Focusing on making it mobile-friendly.',
    link: null,
  },
  {
    id: 4,
    type: 'music',
    title: 'Album: Midnights by Taylor Swift',
    date: '2025-01-08',
    notes: 'Revisiting this album - the production is incredible and the storytelling is top-notch.',
    link: 'https://open.spotify.com/album/example',
  },
  {
    id: 5,
    type: 'reading',
    title: 'Clean Code by Robert C. Martin',
    date: '2025-01-05',
    notes: 'Reading about best practices for writing maintainable code. The chapter on functions is particularly insightful.',
    link: null,
  },
  {
    id: 6,
    type: 'project',
    title: 'Data Visualization Dashboard',
    date: '2025-01-03',
    notes: 'Building an interactive dashboard using D3.js and React. Exploring ways to make complex data more accessible.',
    link: null,
  },
];

/**
 * Now - Main page showing current work, reading, and listening
 * Supports filtering by category and sorting by date
 */
export default function Now() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');

  // Get unique categories from data
  const categories = useMemo(() => {
    const unique = [...new Set(nowData.map(item => item.type))];
    return ['all', ...unique];
  }, []);

  // Filter and sort the data
  const filteredAndSorted = useMemo(() => {
    let filtered = nowData;
    
    // Apply filter
    if (selectedFilter !== 'all') {
      filtered = nowData.filter(item => item.type === selectedFilter);
    }

    // Apply sort
    const sorted = [...filtered].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === 'newest' 
        ? dateB - dateA 
        : dateA - dateB;
    });

    return sorted;
  }, [selectedFilter, sortOrder]);

  return (
    <main>
      <Container className="py-5">
        <header className="mb-5">
          <h1>Now</h1>
          <p className="lead">
            What I'm currently working on, reading, and listening to.
          </p>
        </header>

        {/* Spotify section */}
        <SpotifyNowSection />

        {/* Other activities section */}
        <section aria-labelledby="activities-heading" className="mt-5">
          <h2 id="activities-heading" className="mb-4">Other Activities</h2>

          <div className="mb-4 d-flex flex-column flex-md-row gap-3 align-items-md-center">
            <FilterBar
              categories={categories}
              selectedFilter={selectedFilter}
              onFilterChange={setSelectedFilter}
            />
            <SortControl
              sortOrder={sortOrder}
              onSortChange={setSortOrder}
            />
          </div>

          {filteredAndSorted.length > 0 ? (
            <div className="row g-4">
              {filteredAndSorted.map((item) => (
                <div key={item.id} className="col-12">
                  <NowItem {...item} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted">No items found for the selected filter.</p>
          )}
        </section>
      </Container>
    </main>
  );
}


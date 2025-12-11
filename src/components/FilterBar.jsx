import { ButtonGroup, ToggleButton } from 'react-bootstrap';

/**
 * FilterBar - Accessible filter controls for the Now page
 * Allows filtering by category (all, music, reading, project)
 */
export default function FilterBar({ categories, selectedFilter, onFilterChange }) {
  const getCategoryLabel = (category) => {
    const labels = {
      all: 'All',
      music: 'Music',
      reading: 'Reading',
      project: 'Project',
    };
    return labels[category] || category;
  };

  return (
    <div className="filter-bar">
      <label htmlFor="category-filter" className="visually-hidden">
        Filter by category
      </label>
      <ButtonGroup
        id="category-filter"
        role="group"
        aria-label="Filter activities by category"
      >
        {categories.map((category) => (
          <ToggleButton
            key={category}
            id={`filter-${category}`}
            type="radio"
            variant="outline-primary"
            name="category-filter"
            value={category}
            checked={selectedFilter === category}
            onChange={(e) => onFilterChange(e.currentTarget.value)}
            aria-pressed={selectedFilter === category}
          >
            {getCategoryLabel(category)}
          </ToggleButton>
        ))}
      </ButtonGroup>
    </div>
  );
}


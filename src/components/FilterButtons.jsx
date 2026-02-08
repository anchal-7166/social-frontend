import React from 'react';

function FilterButtons({ activeFilter, onFilterChange }) {
  const filters = [
    { id: 'all', label: 'All Posts' },
    { id: 'most-liked', label: 'Most Liked' },
    { id: 'most-commented', label: 'Most Commented' }
  ];

  return (
    <div className="filter-buttons">
      {filters.map(filter => (
        <button
          key={filter.id}
          className={`filter-btn ${activeFilter === filter.id ? 'active' : ''}`}
          onClick={() => onFilterChange(filter.id)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}

export default FilterButtons;
import React from 'react';

function SearchBar({ searchQuery, onSearchChange }) {
  return (
    <div className="search-bar-container">
      <input
        type="text"
        className="search-input"
        placeholder="Search, users, posts..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <button className="search-icon-btn">
        <i className="bi bi-search"></i>
      </button>
    </div>
  );
}

export default SearchBar;
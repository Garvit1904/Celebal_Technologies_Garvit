import React from 'react';

// FilterSortControls component for filtering and sorting tasks
function FilterSortControls({ filter, setFilter, sort, setSort }) {
  return (
    <div className="controls-container">
      {/* Filter Buttons */}
      <div className="filter-buttons">
        <button
          onClick={() => setFilter('all')}
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
        >
          Active
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
        >
          Completed
        </button>
      </div>

      {/* Sort Dropdown */}
      <div className="sort-dropdown-wrapper">
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="sort-dropdown"
        >
          <option value="default">Sort: Newest</option>
          <option value="alphabetical">Sort: A-Z</option>
          <option value="status">Sort: Status</option>
        </select>
        {/* Custom dropdown arrow using SVG */}
        <div className="dropdown-arrow">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default FilterSortControls;

import React, { useState } from 'react';

const SearchBar = ({ onSearch, onCategoryChange, categories = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    if (onCategoryChange) {
      onCategoryChange(category);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    if (onSearch) {
      onSearch('');
    }
    if (onCategoryChange) {
      onCategoryChange('all');
    }
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSearch}>
        <div className="row g-3">
          <div className="col-md-6">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search books by title or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="btn btn-primary" type="submit">
                <i className="bi bi-search"></i>
              </button>
            </div>
          </div>
          
          <div className="col-md-4">
            <select
              className="form-select"
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          
          <div className="col-md-2">
            <button
              type="button"
              className="btn btn-outline-secondary w-100"
              onClick={handleClear}
            >
              <i className="bi bi-x-circle me-1"></i>
              Clear
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
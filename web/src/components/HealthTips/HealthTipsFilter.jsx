import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './HealthTipsFilter.css';

const HealthTipsFilter = ({ 
  categories, 
  selectedCategory, 
  onCategoryChange, 
  isDarkMode,
  allCategoryIcon
}) => {

  return (
    <div className={`health-tips-filter ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="filter-categories">
        <button
          className={`category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => onCategoryChange('all')}
        >
          {allCategoryIcon}
          <span className="category-label">All</span>
        </button>
        
        {categories.map(category => (
          <button
            key={category.id}
            className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => onCategoryChange(category.id)}
            aria-label={`Filter by ${category.label}`}
          >
            {category.icon}
            <span className="category-label">{category.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

HealthTipsFilter.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      icon: PropTypes.node.isRequired,
      label: PropTypes.string.isRequired
    })
  ).isRequired,
  selectedCategory: PropTypes.string.isRequired,
  onCategoryChange: PropTypes.func.isRequired,
  isDarkMode: PropTypes.bool,
  onSortChange: PropTypes.func,
  currentSort: PropTypes.string,
  allCategoryIcon: PropTypes.node
};

export default HealthTipsFilter;

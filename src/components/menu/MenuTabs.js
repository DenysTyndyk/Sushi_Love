import React from 'react';

const MenuTabs = ({ categories, activeCategory, onSelect, categoryLabel }) => (
  <div className="category-tabs">
    {categories.map((cat) => (
      <button
        key={cat}
        type="button"
        className={activeCategory === cat ? 'tab-btn active' : 'tab-btn'}
        onClick={() => onSelect(cat)}
      >
        {categoryLabel(cat)}
      </button>
    ))}
  </div>
);

export default MenuTabs;

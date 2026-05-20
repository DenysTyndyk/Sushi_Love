import React from 'react';

const CategoryHero = ({ src, alt }) => {
  if (!src) return null;
  return (
    <div className="menu-category-hero">
      <img
        src={src}
        alt={alt}
        width={1200}
        height={520}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
};

export default CategoryHero;

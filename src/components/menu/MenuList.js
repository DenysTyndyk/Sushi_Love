import React from 'react';
import MenuItemRow from './MenuItemRow';

const MenuList = ({
  items,
  activeCategory,
  variantChoice,
  onVariantSelect,
  onAddToCart,
  addToCartLabel
}) => (
  <>
    {items.map((item) => {
      if (item.kind === 'section') {
        return (
          <div key={item.id} className="menu-section-heading" role="presentation">
            <h3>{item.name}</h3>
          </div>
        );
      }
      return (
        <MenuItemRow
          key={item.id}
          item={item}
          categoryKey={activeCategory}
          chosenVariantKey={variantChoice[item.id]}
          onVariantSelect={onVariantSelect}
          onAddToCart={onAddToCart}
          addToCartLabel={addToCartLabel}
        />
      );
    })}
  </>
);

export default MenuList;

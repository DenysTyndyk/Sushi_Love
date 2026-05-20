import React from 'react';

const THUMB_W = 124;
const THUMB_H = 93;

const MenuItemRow = ({
  item,
  categoryKey,
  chosenVariantKey,
  onVariantSelect,
  onAddToCart,
  addToCartLabel
}) => {
  const variantKey = item.variantOptions?.length
    ? chosenVariantKey ?? item.variantOptions[0].key
    : undefined;

  return (
    <div
      className={item.image ? 'menu-item menu-item--has-image' : 'menu-item'}
    >
      {item.image ? (
        <div className="menu-item__media">
          <img
            src={item.image}
            alt={item.name}
            width={THUMB_W}
            height={THUMB_H}
            loading="lazy"
            decoding="async"
          />
        </div>
      ) : null}
      <div className="item-info">
        <h4>{item.name}</h4>
        {item.desc && item.desc !== item.name ? <p>{item.desc}</p> : null}
      </div>
      <div
        className={
          item.variantOptions?.length
            ? 'item-actions item-actions--variants'
            : 'item-actions'
        }
      >
        <div className="item-price">{item.price}</div>
        {item.variantOptions?.length ? (
          <div className="menu-item-variants" role="group" aria-label={item.name}>
            {item.variantOptions.map((opt) => {
              const isActive = variantKey === opt.key;
              return (
                <button
                  key={opt.key}
                  type="button"
                  className={
                    isActive
                      ? 'menu-variant-btn menu-variant-btn--active'
                      : 'menu-variant-btn'
                  }
                  onClick={() => onVariantSelect(item.id, opt.key)}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        ) : null}
        <button
          type="button"
          className="add-btn"
          onClick={() =>
            onAddToCart(item, categoryKey, {
              variantKey: item.variantOptions?.length ? variantKey : undefined
            })
          }
        >
          {addToCartLabel}
        </button>
      </div>
    </div>
  );
};

export default React.memo(MenuItemRow);

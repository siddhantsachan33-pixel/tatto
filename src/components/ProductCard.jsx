import React from 'react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  return (
    <div className="product-card animate-fade-in">
      <div className="product-image-container">
        {product.isBestseller && (
          <span className="product-badge">Best Seller</span>
        )}
        {product.isNew && !product.isBestseller && (
          <span className="product-badge sale">New</span>
        )}
        {discountPercent > 0 && (
          <span className="product-badge sale" style={{ right: '12px', left: 'auto' }}>
            -{discountPercent}%
          </span>
        )}

        <img 
          src={product.image1} 
          alt={product.name} 
          className="product-img primary" 
          loading="lazy"
        />
        <img 
          src={product.image2} 
          alt={`${product.name} Hover`} 
          className="product-img secondary" 
          loading="lazy"
        />

        <button 
          className="product-quick-add" 
          onClick={handleQuickAdd}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Quick Add
        </button>
      </div>

      <div className="product-info">
        <div className="product-rating">
          <span className="stars">★</span>
          <span>{product.rating}</span>
          <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
            ({product.reviewsCount})
          </span>
        </div>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-size">{product.size}</p>
        
        <div className="product-price-wrapper">
          <span className="product-price">₹{product.price}</span>
          {product.originalPrice && (
            <span className="product-original-price">₹{product.originalPrice}</span>
          )}
        </div>
      </div>
    </div>
  );
}

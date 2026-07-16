import React from 'react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const discountPercent = product.discountPercentage || Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  return (
    <div className="product-card animate-fade-in">
      <div className="product-image-container">
        {/* Discount badge bottom-left */}
        {discountPercent > 0 && (
          <span className="discount-badge">-{discountPercent}% OFF</span>
        )}

        {/* Premium badge top-right */}
        {product.isPremium && (
          <span className="premium-badge">👑 PREMIUM</span>
        )}

        {/* New Drop badge top-right (if not premium) */}
        {!product.isPremium && product.isNewDrop && (
          <span className="new-drop-badge">✨ NEW</span>
        )}

        {/* Bestseller badge (legacy fallback) */}
        {!product.isPremium && !product.isNewDrop && product.isBestseller && (
          <span className="product-badge">Best Seller</span>
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
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 01-8 0"></path>
          </svg>
          Add to Cart
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

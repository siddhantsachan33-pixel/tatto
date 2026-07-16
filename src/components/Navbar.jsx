import React from 'react';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { cartCount, setCartOpen } = useCart();

  return (
    <>
      <div className="announcement-bar">
        🎉 FREE SHIPPING ON ALL ORDERS OVER ₹499! • SHOP NOW
      </div>
      <header className="navbar-wrapper">
        <div className="container navbar">
          {/* Menu Toggle / Burger (Visual only) */}
          <button className="nav-btn" style={{ marginRight: 'auto' }} aria-label="Menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="12" x2="20" y2="12"></line>
              <line x1="4" y1="6" x2="20" y2="6"></line>
              <line x1="4" y1="18" x2="20" y2="18"></line>
            </svg>
          </button>

          {/* Centered Brand Logo */}
          <a href="/" className="nav-logo">
            INKUP
          </a>

          {/* Navigation Links (Desktop) */}
          <ul className="nav-links" style={{ marginLeft: '40px', marginRight: 'auto' }}>
            <li><a href="#shop-all">Shop All</a></li>
            <li><a href="#tabbed-collection">Collections</a></li>
            <li><a href="#initial-selector">Custom Initials</a></li>
            <li><a href="#bulk-orders">Bulk Orders</a></li>
            <li><a href="#faq">FAQ</a></li>
          </ul>

          {/* Actions */}
          <div className="nav-actions">
            {/* Search (Mock toggle) */}
            <button className="nav-btn" aria-label="Search" onClick={() => alert('Search functionality: Type to search filters coming soon!')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>

            {/* Cart Icon with badge */}
            <button 
              className="nav-btn" 
              aria-label="Cart" 
              onClick={() => setCartOpen(true)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              {cartCount > 0 && (
                <span className="cart-count-badge">{cartCount}</span>
              )}
            </button>
          </div>
        </div>
      </header>
    </>
  );
}

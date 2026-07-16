import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';

export default function Navbar({ user, onUserClick, onSearch }) {
  const { cartCount, setCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef(null);

  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    onSearch && onSearch(e.target.value);
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <>
      {/* Mobile Slide-In Drawer */}
      <div className={`mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <button className="mobile-drawer-close" onClick={closeMenu} aria-label="Close">✕</button>
        <div className="mobile-drawer-logo">SEEDINK</div>
        <nav className="mobile-drawer-nav">
          <a href="#shop-all" className="mobile-drawer-link" onClick={closeMenu}>🕉️ All Designs</a>
          <a href="#shop-all" className="mobile-drawer-link" onClick={() => { closeMenu(); onSearch && onSearch('premium'); }}>👑 Premium</a>
          <a href="#shop-all" className="mobile-drawer-link" onClick={() => { closeMenu(); onSearch && onSearch('new'); }}>✨ New Drops</a>
          <a href="#shop-all" className="mobile-drawer-link" onClick={() => { closeMenu(); onSearch && onSearch('discounted'); }}>🏷️ Discounted</a>
          <a href="#tabbed-collection" className="mobile-drawer-link" onClick={closeMenu}>Collections</a>
          <a href="#how-to-apply" className="mobile-drawer-link" onClick={closeMenu}>How It Works</a>
          <a href="#bulk-orders" className="mobile-drawer-link" onClick={closeMenu}>Bulk Orders</a>
          <a href="#faq" className="mobile-drawer-link" onClick={closeMenu}>FAQ</a>
        </nav>
        <div className="mobile-drawer-footer">
          <button className="mobile-drawer-user-btn" onClick={() => { closeMenu(); onUserClick && onUserClick(); }}>
            {user ? `👤 Hi, ${user.name ? user.name.split(' ')[0] : 'User'}` : '🔑 Login / Register'}
          </button>
        </div>
      </div>
      {mobileMenuOpen && <div className="mobile-drawer-overlay" onClick={closeMenu} />}

      <div className="announcement-bar">
        🕉️ FREE SHIPPING ON ALL ORDERS OVER ₹499! &nbsp;•&nbsp; SACRED BODY ART THAT LASTS 2 WEEKS
      </div>

      <header className="navbar-wrapper">
        <div className="container navbar">
          {/* Burger Menu Button */}
          <button className="nav-btn burger-btn" aria-label="Menu" onClick={() => setMobileMenuOpen(true)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          {/* Brand Logo */}
          <a href="#shop-all" className="nav-logo">SEEDINK</a>

          {/* Desktop Nav */}
          <ul className="nav-links" style={{ marginLeft: '32px', marginRight: 'auto' }}>
            <li><a href="#shop-all">Shop All</a></li>
            <li><a href="#tabbed-collection">Collections</a></li>
            <li><a href="#initial-selector">Custom Initials</a></li>
            <li><a href="#bulk-orders">Bulk Orders</a></li>
            <li><a href="#faq">FAQ</a></li>
          </ul>

          {/* Actions */}
          <div className="nav-actions">
            {/* Live Search */}
            <div className="search-container">
              <button className="nav-btn" aria-label="Search" onClick={() => { setSearchOpen(v => !v); if (searchOpen) { setSearchQuery(''); onSearch && onSearch(''); } }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </button>
              <div className={`search-dropdown ${searchOpen ? 'open' : ''}`}>
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search tattoos..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="search-input"
                />
                {searchQuery && (
                  <button className="search-clear" onClick={() => { setSearchQuery(''); onSearch && onSearch(''); }}>✕</button>
                )}
              </div>
            </div>

            {/* User */}
            <button className="nav-btn user-nav-btn" aria-label="Account" onClick={onUserClick} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {user ? (
                <span className="user-avatar-small">{(user.name || user.email || 'U')[0].toUpperCase()}</span>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              )}
              {user && <span style={{ fontSize: '0.85rem', fontWeight: 'bold', maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name ? user.name.split(' ')[0] : ''}</span>}
            </button>

            {/* Cart */}
            <button className="nav-btn" aria-label="Cart" onClick={() => setCartOpen(true)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {cartCount > 0 && <span className="cart-count-badge">{cartCount}</span>}
            </button>
          </div>
        </div>
      </header>
    </>
  );
}

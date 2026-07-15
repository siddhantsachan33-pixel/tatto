import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function InitialSelector() {
  const [selectedLetter, setSelectedLetter] = useState('A');
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    // Create a mock product object representing the Custom Initial Tattoo
      const customProduct = {
        id: 'custom-initial',
        name: `Signature Heart Initial '${selectedLetter}'`,
        price: 299,
        originalPrice: 499,
        size: '2 x 2 inches',
        image1: 'https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&q=80&w=600',
      };
      addToCart(customProduct, 1, selectedLetter);
    };
  
    return (
      <section className="section-padding" id="initial-selector" style={{ background: '#fafafa' }}>
        <div className="container">
          <div className="section-header">
            <p className="section-subtitle">Interactive Customizer</p>
            <h2 className="section-title">Signature Initial Heart</h2>
          </div>
  
          <div className="initial-container">
            {/* Left Column: Dynamic Preview */}
            <div className="initial-preview-panel">
              <img 
                src="https://images.unsplash.com/photo-1550537687-c91072c4792d?auto=format&fit=crop&q=80&w=600" 
                alt="Tattoo Placement Skin Mockup" 
                className="initial-preview-bg"
              />
            {/* Overlay Heart SVG with Custom Letter */}
            <div className="initial-overlay-letter animate-fade-in" key={selectedLetter}>
              ♡ {selectedLetter}
            </div>
          </div>

          {/* Right Column: Customizer Controls */}
          <div className="initial-controls">
            <span className="initial-badge">Popular Custom Drop</span>
            <h3 className="initial-title">Custom Initial Letter Tattoo</h3>
            
            <div className="product-rating" style={{ margin: '4px 0' }}>
              <span className="stars">★ ★ ★ ★ ★</span>
              <span style={{ fontWeight: 'bold' }}>4.9</span>
              <span style={{ color: '#71717a' }}>(432 custom orders)</span>
            </div>

            <p style={{ fontSize: '0.9rem', color: '#71717a', margin: '8px 0' }}>
              Get our signature heart fine-line tattoo customized with your favorite initial. Pain-free, organic, and lasts up to 14 days. Choose your letter below:
            </p>

            {/* A-Z Letter Grid */}
            <div>
              <p style={{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '8px' }}>
                Select Letter: <span style={{ color: '#d4af37' }}>{selectedLetter}</span>
              </p>
              <div className="initial-grid">
                {alphabet.map((letter) => (
                  <button
                    key={letter}
                    className={`initial-letter-btn ${selectedLetter === letter ? 'active' : ''}`}
                    onClick={() => setSelectedLetter(letter)}
                  >
                    {letter}
                  </button>
                ))}
              </div>
            </div>

            <div className="product-price-wrapper" style={{ margin: '12px 0', fontSize: '1.25rem' }}>
              <span className="product-price" style={{ fontSize: '1.4rem' }}>₹299</span>
              <span className="product-original-price" style={{ fontSize: '1rem' }}>₹499</span>
              <span className="comp-badge green" style={{ fontSize: '0.75rem', padding: '2px 8px' }}>
                Save 40%
              </span>
            </div>

            <button 
              className="submit-btn" 
              onClick={handleAddToCart}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              Add Customized Tattoo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

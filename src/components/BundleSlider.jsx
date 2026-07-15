import React from 'react';
import { bundles } from '../data/products';
import { useCart } from '../context/CartContext';

export default function BundleSlider() {
  const { addToCart } = useCart();

  return (
    <section className="section-padding" id="bundles" style={{ background: '#fafafa' }}>
      <div className="container">
        <div className="section-header">
          <p className="section-subtitle">Combo Deals</p>
          <h2 className="section-title">Shop The Bundles</h2>
        </div>

        <div className="bundles-wrapper">
          {bundles.map((bundle) => (
            <div className="bundle-card animate-fade-in" key={bundle.id}>
              <div className="bundle-img-container">
                <img src={bundle.image} alt={bundle.name} className="bundle-img" />
              </div>
              <div className="bundle-info">
                <span className="bundle-tag">Save Combo Pricing</span>
                <h3 className="bundle-title">{bundle.name}</h3>
                <p className="bundle-desc">{bundle.description}</p>
                <div className="product-rating" style={{ margin: '4px 0' }}>
                  <span className="stars">★ ★ ★ ★ ★</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>{bundle.rating}</span>
                </div>
                <div className="bundle-bottom">
                  <div className="bundle-price-box">
                    <span className="bundle-price">₹{bundle.price}</span>
                    <span className="bundle-original-price">₹{bundle.originalPrice}</span>
                  </div>
                  <button 
                    className="bundle-btn" 
                    onClick={() => addToCart(bundle)}
                  >
                    Add Pack
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import React, { useState } from 'react';
import { products as defaultProducts } from '../data/products';
import ProductCard from './ProductCard';

const tabs = [
  { id: 'all', label: 'All Designs' },
  { id: 'bestsellers', label: 'Bestsellers' },
  { id: 'spiritual', label: 'Spiritual' },
  { id: 'anime', label: 'Anime & Pop' },
  { id: 'gothic', label: 'Gothic & Dark' },
  { id: 'typography', label: 'Typography' }
];

export default function TabbedCollection({ products = defaultProducts }) {
  const [activeTab, setActiveTab] = useState('all');

  const filteredProducts = products.filter((prod) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'bestsellers') return prod.isBestseller;
    return prod.category === activeTab;
  });

  return (
    <section className="section-padding" id="tabbed-collection">
      <div className="container">
        <div className="section-header">
          <p className="section-subtitle">Curated Categories</p>
          <h2 className="section-title">Explore Collections</h2>
        </div>

        <div className="collection-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="products-grid">
          {filteredProducts.length === 0 ? (
            <p style={{ textAlign: 'center', gridColumn: 'span 4', color: '#71717a' }}>
              No designs found in this category.
            </p>
          ) : (
            filteredProducts.map((product) => (
              <ProductCard key={product.id || product._id} product={product} />
            ))
          )}
        </div>
      </div>
    </section>
  );
}

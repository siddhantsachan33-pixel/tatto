import React from 'react';
import { categories } from '../data/products';

export default function CategoryBar({ activeCategory, onSelectCategory }) {
  return (
    <div className="category-bar-container">
      <div className="container">
        <div className="category-bar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`category-item ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => {
                onSelectCategory(cat.id);
                // Scroll to products if they click it
                const el = document.getElementById('shop-all');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span className="category-icon">{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

import React from 'react';

const sizes = [
  { name: 'Extra Small', dimensions: '2 x 2 cm', description: 'Tiny details, stars, and symbols' },
  { name: 'Small', dimensions: '5 x 5 cm', description: 'Perfect for wrist scripts & butterflies' },
  { name: 'Medium', dimensions: '8 x 8 cm', description: 'Mandala icons & detailed graphics' },
  { name: 'Large', dimensions: '12 x 8 cm', description: 'Statement daggers, snakes, & sleeve bases' },
  { name: 'Custom Combo', dimensions: 'Varies', description: 'Tailored bundles matching your vibe' }
];

export default function SizeGrid({ onSelectSizeFilter }) {
  return (
    <section className="section-padding" id="shop-by-size">
      <div className="container">
        <div className="section-header">
          <p className="section-subtitle">Size Guide</p>
          <h2 className="section-title">Shop By Sizing</h2>
        </div>

        <div className="sizes-grid">
          {sizes.map((size, index) => (
            <div 
              key={index} 
              className="size-tile animate-fade-in-up" 
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <h3 className="size-name">{size.name}</h3>
              <p className="size-dimensions">{size.dimensions}</p>
              <p style={{ fontSize: '0.75rem', color: '#71717a', marginTop: '6px' }}>
                {size.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

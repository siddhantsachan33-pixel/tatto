import React, { useState, useEffect } from 'react';

const slides = [
  {
    subtitle: "India's First Semi-Permanent Brand",
    title: "Commitment-Free Body Art",
    cta: "Shop The Collection",
    link: "#shop-all",
    bg: "https://images.unsplash.com/photo-1590246815117-cdd26e601848?auto=format&fit=crop&q=80&w=1600"
  },
  {
    subtitle: "Looks 100% Like Real Ink",
    title: "Zero Pain. Zero Regrets.",
    cta: "Explore Bestsellers",
    link: "#tabbed-collection",
    bg: "https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?auto=format&fit=crop&q=80&w=1600"
  },
  {
    subtitle: "Personalized Custom Tattoos",
    title: "Signature Letter Initials",
    cta: "Customize Yours",
    link: "#initial-selector",
    bg: "https://images.unsplash.com/photo-1565058379802-bbe93b2f703a?auto=format&fit=crop&q=80&w=1600"
  }
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="hero-container">
      {slides.map((slide, index) => (
        <div 
          className={`hero-slide ${index === current ? 'active' : ''}`} 
          key={index}
        >
          <img src={slide.bg} alt={slide.title} className="hero-bg" />
          <div className="hero-overlay"></div>
          <div className="container" style={{ position: 'relative', width: '100%' }}>
            <div className="hero-content">
              <p className="hero-subtitle">{slide.subtitle}</p>
              <h1 className="hero-title">{slide.title}</h1>
              <a href={slide.link} className="hero-btn">
                {slide.cta}
              </a>
            </div>
          </div>
        </div>
      ))}

      <div className="hero-indicators">
        {slides.map((_, index) => (
          <button 
            key={index} 
            className={`hero-dot ${index === current ? 'active' : ''}`}
            onClick={() => setCurrent(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

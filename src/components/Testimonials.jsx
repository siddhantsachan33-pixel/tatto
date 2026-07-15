import React from 'react';

const defaultTestimonials = [
  {
    name: 'Ananya Roy',
    stars: '★★★★★',
    text: 'Literally looks so real! I got the Mandala Harmony and people keep asking me where I got it inked. Developing takes a day, but once it turns dark, it is perfect.',
    verified: true
  },
  {
    name: 'Rohit Sharma',
    stars: '★★★★★',
    text: 'I wanted to see if I liked a tattoo on my forearm before committing. This was a lifesaver. Kept it for 12 days, showered every day, and it did not fade. Highly recommend!',
    verified: true
  },
  {
    name: 'Meera Kapoor',
    stars: '★★★★★',
    text: 'Absolutely obsessed with the Custom Initial Heart Selector. Choose your letter and get it. Applies in 10 minutes. Will buy again!',
    verified: true
  }
];

export default function Testimonials({ testimonials = defaultTestimonials }) {
  return (
    <section className="section-padding" id="reviews">
      <div className="container">
        <div className="section-header">
          <p className="section-subtitle">Real Reviews</p>
          <h2 className="section-title">Verified Inkers</h2>
        </div>

        <div className="testimonials-container">
          {testimonials.map((test, index) => (
            <div className="testimonial-card animate-fade-in-up" key={test._id || index} style={{ animationDelay: `${index * 0.15}s` }}>
              <div className="stars">{test.stars}</div>
              <p className="testimonial-text">"{test.text}"</p>
              <div className="testimonial-author">
                <span>{test.name}</span>
                {test.verified && (
                  <span className="testimonial-verify">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Verified Customer
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

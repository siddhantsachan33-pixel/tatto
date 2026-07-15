import React, { useState } from 'react';

export default function BulkForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    quantity: '100',
    details: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.details) {
      setError('Please fill in all required fields.');
      return;
    }
    setError('');
    setSubmitted(true);
    // Simulating sending data to a backend
    console.log('Bulk Order Query:', formData);
  };

  return (
    <section className="section-padding" id="bulk-orders">
      <div className="container">
        <div className="section-header">
          <p className="section-subtitle">Collaborations & Events</p>
          <h2 className="section-title">Bulk & Custom Orders</h2>
        </div>

        <div className="bulk-container animate-fade-in">
          {submitted ? (
            <div className="form-success-box animate-fade-in">
              <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Thank You!</h3>
              <p>Your custom query has been received. Our B2B coordinator will get back to you within 24 hours.</p>
              <button 
                className="submit-btn" 
                style={{ marginTop: '20px', maxWidth: '200px' }}
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: '', email: '', quantity: '100', details: '' });
                }}
              >
                Send Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && (
                <p style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '16px', fontWeight: 'bold' }}>
                  {error}
                </p>
              )}
              
              <div className="form-group">
                <label className="form-label" htmlFor="bulk-name">Your Name *</label>
                <input 
                  type="text" 
                  name="name" 
                  id="bulk-name"
                  className="form-input" 
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. John Doe"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="bulk-email">Work/Personal Email *</label>
                <input 
                  type="email" 
                  name="email" 
                  id="bulk-email"
                  className="form-input" 
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. john@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="bulk-qty">Estimated Quantity</label>
                <select 
                  name="quantity" 
                  id="bulk-qty"
                  className="form-input"
                  value={formData.quantity}
                  onChange={handleChange}
                >
                  <option value="50">50 - 100 Tattoos</option>
                  <option value="100">100 - 500 Tattoos</option>
                  <option value="500">500 - 1000 Tattoos</option>
                  <option value="1000+">1000+ Tattoos</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="bulk-details">Project Description & Custom Designs *</label>
                <textarea 
                  name="details" 
                  id="bulk-details"
                  className="form-textarea" 
                  value={formData.details}
                  onChange={handleChange}
                  placeholder="Tell us about your brand logos, custom designs, or college festival themes..."
                  required
                />
              </div>

              <button type="submit" className="submit-btn">
                Submit Inquiry
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSlider from './components/HeroSlider';
import CategoryBar from './components/CategoryBar';
import ProductCard from './components/ProductCard';
import TabbedCollection from './components/TabbedCollection';
import InitialSelector from './components/InitialSelector';
import SizeGrid from './components/SizeGrid';
import BundleSlider from './components/BundleSlider';
import Testimonials from './components/Testimonials';
import ComparisonTable from './components/ComparisonTable';
import BulkForm from './components/BulkForm';
import FaqAccordion from './components/FaqAccordion';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import AdminDashboard from './components/AdminDashboard';
import { products as defaultProducts } from './data/products';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [productsList, setProductsList] = useState(defaultProducts);
  const [testimonialsList, setTestimonialsList] = useState([]);
  const [route, setRoute] = useState(window.location.hash || '');

  // Hash Router setup
  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash || '');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Fetch products and reviews from MERN backend
  useEffect(() => {
    const fetchBackendData = async () => {
      try {
        const prodRes = await fetch(`${API_BASE}/products`);
        if (prodRes.ok) {
          const prodData = await prodRes.json();
          if (prodData && prodData.length > 0) {
            setProductsList(prodData);
          }
        }
        
        const testRes = await fetch(`${API_BASE}/testimonials`);
        if (testRes.ok) {
          const testData = await testRes.json();
          if (testData && testData.length > 0) {
            setTestimonialsList(testData);
          }
        }
      } catch (err) {
        console.log('Express API backend offline, running in fallback mode.');
      }
    };
    
    fetchBackendData();
  }, [route]);


  // Filter products for the primary "Shop All" grid based on category selection
  const displayedProducts = productsList.filter((prod) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'bestsellers') return prod.isBestseller;
    return prod.category === selectedCategory;
  });

  // If the admin route is active, render the Management Console instead
  if (route === '#admin') {
    return (
      <AdminDashboard 
        onClose={() => { window.location.hash = ''; }} 
      />
    );
  }

  return (
    <div className="storefront-app">
      {/* Navigation */}
      <Navbar />

      {/* Hero Banner Slider */}
      <HeroSlider />

      {/* Horizontal Category Nav */}
      <CategoryBar 
        activeCategory={selectedCategory} 
        onSelectCategory={setSelectedCategory} 
      />

      {/* Primary Products Grid (Shop All / Category Grid) */}
      <section className="section-padding" id="shop-all">
        <div className="container">
          <div className="section-header">
            <p className="section-subtitle">Catalog</p>
            <h2 className="section-title">
              {selectedCategory === 'all' 
                ? 'Shop All Designs' 
                : `${selectedCategory.toUpperCase()} Designs`}
            </h2>
          </div>

          <div className="products-grid">
            {displayedProducts.map((product) => (
              <ProductCard key={product.id || product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Curated Tabbed Collections */}
      <TabbedCollection products={productsList} />

      {/* Custom Initials Widget */}
      <InitialSelector />

      {/* Visual Sizing Grid */}
      <SizeGrid />

      {/* Custom Tattoo Care / How to Apply section (similar to inkup.co.in) */}
      <section className="section-padding" id="how-to-apply" style={{ background: '#fafafa' }}>
        <div className="container">
          <div className="section-header">
            <p className="section-subtitle">Painless Application</p>
            <h2 className="section-title">How To Apply In 4 Steps</h2>
          </div>

          <div className="props-grid" style={{ borderBottom: 'none', padding: '0 0 20px 0' }}>
            <div className="prop-card animate-fade-in-up">
              <div className="prop-icon" style={{ fontSize: '2.5rem' }}>🧼</div>
              <h3 className="prop-title">1. Prep Skin</h3>
              <p className="prop-desc">Exfoliate and clean the target skin area. Make sure it is completely dry and free from any oils or lotions.</p>
            </div>
            
            <div className="prop-card animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="prop-icon" style={{ fontSize: '2.5rem' }}>💦</div>
              <h3 className="prop-title">2. Place & Wet</h3>
              <p className="prop-desc">Remove transparent film. Place design face-down on skin and firmly press a wet sponge over it for 30 seconds.</p>
            </div>

            <div className="prop-card animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="prop-icon" style={{ fontSize: '2.5rem' }}>📄</div>
              <h3 className="prop-title">3. Peel Backing</h3>
              <p className="prop-desc">Gently peel away paper. The tattoo will look completely transparent or light blue at first. Don't touch for 1 hour!</p>
            </div>

            <div className="prop-card animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="prop-icon" style={{ fontSize: '2.5rem' }}>⏳</div>
              <h3 className="prop-title">4. Darkens in 24h</h3>
              <p className="prop-desc">Over 24-36 hours, our skin-safe organic plant ink reacts with your skin proteins and darkens into a deep black ink tattoo.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Curated Tattoo Bundles */}
      <BundleSlider />

      {/* Comparison Grid */}
      <ComparisonTable />

      {/* Testimonials */}
      <Testimonials testimonials={testimonialsList.length > 0 ? testimonialsList : undefined} />

      {/* Bulk/Corporate Order Forms */}
      <BulkForm />

      {/* FAQs */}
      <FaqAccordion />

      {/* Footer */}
      <footer className="footer-wrapper">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col">
              <h2 className="footer-logo">INKUP</h2>
              <p className="footer-text">
                India's first pain-free, commitment-free semi-permanent body art brand. Zero needles. Zero regrets. Just beautiful body art that lasts 2 weeks.
              </p>
            </div>
            
            <div className="footer-col">
              <h3 className="footer-heading">Collections</h3>
              <ul className="footer-links">
                <li><a href="#shop-all">Shop All</a></li>
                <li><a href="#tabbed-collection">Bestsellers</a></li>
                <li><a href="#initial-selector">Custom Initials</a></li>
                <li><a href="#bundles">Curated Bundles</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h3 className="footer-heading">Company</h3>
              <ul className="footer-links">
                <li><a href="#why-choose-us">How It Works</a></li>
                <li><a href="#reviews">Testimonials</a></li>
                <li><a href="#bulk-orders">Bulk Inquiry</a></li>
                <li><a href="#faq">FAQs</a></li>
                <li><a href="#admin" style={{ color: 'var(--color-accent)', fontWeight: 'bold' }}>Admin Console ⚙️</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h3 className="footer-heading">Join The Tribe</h3>
              <p className="footer-text" style={{ marginBottom: '8px' }}>
                Subscribe to get 10% off your first order and early access to new drop designs.
              </p>
              <form className="newsletter-form" onSubmit={(e) => { e.preventDefault(); alert('Subscribed successfully!'); e.target.reset(); }}>
                <input 
                  type="email" 
                  placeholder="Enter email address" 
                  className="newsletter-input" 
                  required
                />
                <button type="submit" className="newsletter-btn">Join</button>
              </form>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} INKUP Body Art Inc. All rights reserved.</p>
            <p>Made with ❤️ in India. Semi-permanent MERN technology.</p>
          </div>
        </div>
      </footer>

      {/* Global Shopping Drawer & Checkout */}
      <CartDrawer />
      <CheckoutModal />
    </div>
  );
}

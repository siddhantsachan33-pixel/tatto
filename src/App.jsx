import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSlider from './components/HeroSlider';
import CategoryBar from './components/CategoryBar';
import StoryHighlights from './components/StoryHighlights';
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
import Chatbot from './components/Chatbot';
import UserPortal from './components/UserPortal';
import OtpPopup from './components/OtpPopup';
import ProductDetailModal from './components/ProductDetailModal';
import { products as defaultProducts } from './data/products';

const API_BASE = (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1')
  ? 'https://tatto-backend-4axz.onrender.com/api'
  : 'http://localhost:5000/api';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [productsList, setProductsList] = useState(defaultProducts);
  const [testimonialsList, setTestimonialsList] = useState([]);
  const [route, setRoute] = useState(window.location.hash || '');
  const [user, setUser] = useState(null);
  const [userPortalOpen, setUserPortalOpen] = useState(false);
  const [otpPopupOpen, setOtpPopupOpen] = useState(false);
  const [selectedDetailProduct, setSelectedDetailProduct] = useState(null);
  const [showMoreLimit, setShowMoreLimit] = useState(2);

  // Reset pagination limit on category or search query change
  useEffect(() => {
    setShowMoreLimit(2);
  }, [activeTab, searchQuery]);

  // Dynamically change browser tab favicon based on selected category/religion
  useEffect(() => {
    const FAVICON_MAP = {
      all: '🔱',
      hinduism: '🕉️',
      islam: '🌙',
      sikhism: '🪯',
      buddhism: '☸️',
      judaism: '✡️',
      christianity: '✝️',
      'new-drops': '🔥',
      combo: '🎁',
      discounted: '🏷️',
      custom: '🎨'
    };
    const emoji = FAVICON_MAP[activeTab] || '🔱';
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>${emoji}</text></svg>`;
  }, [activeTab]);

  // Authenticate user session from token on mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('seedink_user_token');
      if (token) {
        try {
          const res = await fetch(`${API_BASE}/auth/user/profile`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            setUser(data);
          } else {
            localStorage.removeItem('seedink_user_token');
            localStorage.removeItem('seedink_user_data');
          }
        } catch (e) {
          console.log('User auth server connection issue.');
        }
      }
    };
    fetchUserProfile();
  }, []);

  // Auto OTP popup after 4 seconds for non-logged-in users
  useEffect(() => {
    const stored = localStorage.getItem('seedink_user_token');
    if (!stored) {
      const timer = setTimeout(() => setOtpPopupOpen(true), 4000);
      return () => clearTimeout(timer);
    }
  }, []);

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


  const categoriesList = [
    { id: 'typography', name: 'Typography & Script', icon: '✍️' },
    { id: 'spiritual', name: 'Spiritual & Sacred', icon: '🧘' },
    { id: 'anime', name: 'Anime & Pop Culture', icon: '👾' },
    { id: 'gothic', name: 'Gothic & Dark Art', icon: '💀' },
    { id: 'minimalist', name: 'Minimalist & Fine-Line', icon: '🌱' }
  ];

  // Filter products by tab and search query
  const getTabProducts = () => {
    let list = productsList;
    if (searchQuery) {
      list = list.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description || '').toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (activeTab === 'all') return list;
    if (activeTab === 'premium') return list.filter(p => p.isPremium);
    if (activeTab === 'new-drops') return list.filter(p => p.isNewDrop || p.isNew);
    if (activeTab === 'discounted') return list.filter(p => p.discountPercentage > 0).sort((a, b) => b.discountPercentage - a.discountPercentage);
    return list.filter(p => p.category === activeTab);
  };
  const displayedProducts = getTabProducts();

  const handleSearch = (q) => {
    setSearchQuery(q);
    if (q) setActiveTab('all');
  };

  const handleFooterClick = (tabId) => {
    setActiveTab(tabId);
    const el = document.getElementById('shop-all');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // If the admin route is active, render the Management Console instead
  if (route === '#admin') {
    return (
      <AdminDashboard 
        onClose={() => { window.location.hash = 'shop-all'; }} 
      />
    );
  }

  return (
    <div className="storefront-app">
      {/* Email OTP Popup */}
      {otpPopupOpen && (
        <OtpPopup
          onClose={() => setOtpPopupOpen(false)}
          onLogin={(u) => {
            setUser(u);
            setOtpPopupOpen(false);
          }}
        />
      )}

      {/* Navigation */}
      <Navbar
        user={user}
        onUserClick={() => user ? setUserPortalOpen(true) : setOtpPopupOpen(true)}
        onSearch={handleSearch}
        onSelectTab={setActiveTab}
      />

      {/* Religion Story Highlights (Directly below header) */}
      <StoryHighlights onSelectCategory={setActiveTab} />

      {/* Hero Banner Slider */}
      <HeroSlider />

      {/* Horizontal Category Nav */}
      <CategoryBar 
        activeCategory={activeTab} 
        onSelectCategory={setActiveTab} 
      />

      {/* Primary Products Grid with Tabs */}
      <section className="section-padding" id="shop-all">
        <div className="container">
          <div className="section-header" style={{ marginBottom: '24px' }}>
            <p className="section-subtitle">🕉️ Sacred Collection</p>
            <h2 className="section-title">Spiritual & Sacred Body Art</h2>
          </div>

          {/* Search result info */}
          {searchQuery && (
            <p className="search-results-headline">
              Results for "<strong>{searchQuery}</strong>" — {displayedProducts.length} found
            </p>
          )}

          {displayedProducts.length === 0 ? (
            <div className="no-products">
              <div style={{ fontSize: '3rem' }}>🔍</div>
              <p>No designs found. Try another tab or search.</p>
            </div>
          ) : (
            <>
              <div className="products-grid">
                {displayedProducts.slice(0, showMoreLimit).map((product) => (
                  <ProductCard 
                    key={product.id || product._id} 
                    product={product} 
                    onSelect={setSelectedDetailProduct}
                  />
                ))}
              </div>
              
              {displayedProducts.length > showMoreLimit && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
                  <button 
                    className="submit-btn animate-fade-in"
                    onClick={() => setShowMoreLimit(prev => prev + 2)}
                    style={{ 
                      width: 'auto', 
                      padding: '14px 48px', 
                      background: 'transparent', 
                      color: 'var(--color-dark)', 
                      border: '2px solid var(--color-dark)',
                      fontWeight: 'bold',
                      fontSize: '0.95rem',
                      letterSpacing: '1px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    See More
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* How to Apply Section (Important for customer success) */}
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

      {/* Footer */}
      <footer className="footer-wrapper">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col">
              <h2 className="footer-logo">SEEDINK</h2>
              <p className="footer-text">
                India's first pain-free, commitment-free semi-permanent body art brand. Zero needles. Zero regrets. Just beautiful body art that lasts 2 weeks.
              </p>
            </div>
            
            <div className="footer-col">
              <h3 className="footer-heading">Collections</h3>
              <ul className="footer-links">
                <li><a href="#shop-all" onClick={() => handleFooterClick('all')}>Shop All</a></li>
                <li><a href="#shop-all" onClick={() => handleFooterClick('new-drops')}>New Arrivals</a></li>
                <li><a href="#shop-all" onClick={() => handleFooterClick('custom')}>Custom Tattoo</a></li>
                <li><a href="#shop-all" onClick={() => handleFooterClick('combo')}>Combo Deals</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h3 className="footer-heading">Company</h3>
              <ul className="footer-links">
                <li><a href="#how-to-apply">How It Works</a></li>
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
            <p>&copy; {new Date().getFullYear()} SEEDINK Body Art Inc. All rights reserved.</p>
            <p>Made with ❤️ in India. Semi-permanent MERN technology.</p>
          </div>
        </div>
      </footer>

      {/* Global Shopping Drawer & Checkout */}
      <CartDrawer />
      <CheckoutModal />

      {/* Floating Chatbot Assistant */}
      <Chatbot />

      {/* User Register/Login & Orders tracking portal */}
      <UserPortal 
        isOpen={userPortalOpen} 
        onClose={() => setUserPortalOpen(false)} 
        user={user} 
        onLoginSuccess={(u) => {
          setUser(u);
          setUserPortalOpen(false);
        }} 
        onLogout={() => {
          localStorage.removeItem('seedink_user_token');
          localStorage.removeItem('seedink_user_data');
          setUser(null);
          setUserPortalOpen(false);
        }} 
      />
      {/* Product Detail & Placement Preview Modal */}
      {selectedDetailProduct && (
        <ProductDetailModal 
          product={selectedDetailProduct} 
          onClose={() => setSelectedDetailProduct(null)} 
        />
      )}
    </div>
  );
}

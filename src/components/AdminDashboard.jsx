import React, { useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';


export default function AdminDashboard({ onClose }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(localStorage.getItem('inkup_admin_token') || '');
  const [activeTab, setActiveTab] = useState('products');
  
  // Data States
  const [products, setProducts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [payments, setPayments] = useState([]);

  // Product Form State
  const [prodForm, setProdForm] = useState({
    id: null,
    name: '',
    category: 'minimalist',
    price: '',
    originalPrice: '',
    size: '3 x 3 inches',
    description: '',
    image1: '',
    image2: '',
    isBestseller: false,
    isNew: false
  });
  const [isEditingProd, setIsEditingProd] = useState(false);

  // Validate session on load
  useEffect(() => {
    if (token) {
      setIsAuthenticated(true);
    }
  }, [token]);

  // Load data from backend using Bearer Token
  const fetchData = async (tabName) => {
    const headers = { 'Authorization': `Bearer ${token}` };
    try {
      if (tabName === 'products') {
        const res = await fetch(`${API_BASE}/products`);
        const data = await res.json();
        setProducts(data);
      } else if (tabName === 'testimonials') {
        const res = await fetch(`${API_BASE}/testimonials`);
        const data = await res.json();
        setTestimonials(data);
      } else if (tabName === 'inquiries') {
        const res = await fetch(`${API_BASE}/inquiries`, { headers });
        if (res.status === 401) {
          handleSessionExpired();
          return;
        }
        const data = await res.json();
        if (res.ok) setInquiries(data);
      } else if (tabName === 'payments') {
        const res = await fetch(`${API_BASE}/payments`, { headers });
        if (res.status === 401) {
          handleSessionExpired();
          return;
        }
        const data = await res.json();
        if (res.ok) setPayments(data);
      }
    } catch (err) {
      console.error(`Error loading data for ${tabName}:`, err);
    }
  };

  const handleSessionExpired = () => {
    alert('Admin session expired. Please log in again.');
    localStorage.removeItem('inkup_admin_token');
    setToken('');
    setIsAuthenticated(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('inkup_admin_token', data.token);
        setToken(data.token);
        setIsAuthenticated(true);
        setPassword('');
      } else {
        alert(data.message || 'Invalid admin credentials.');
      }
    } catch (err) {
      alert('Error connecting to authentication server.');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (e) {}
    localStorage.removeItem('inkup_admin_token');
    setToken('');
    setIsAuthenticated(false);
  };

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchData(activeTab);
    }
  }, [isAuthenticated, activeTab, token]);

  /* ==========================================
     PRODUCT HANDLERS
     ========================================== */
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
    
    try {
      let res;
      if (isEditingProd && prodForm.id) {
        res = await fetch(`${API_BASE}/products/${prodForm.id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(prodForm)
        });
      } else {
        res = await fetch(`${API_BASE}/products`, {
          method: 'POST',
          headers,
          body: JSON.stringify(prodForm)
        });
      }

      if (res.status === 401) {
        handleSessionExpired();
        return;
      }

      if (res.ok) {
        alert(isEditingProd ? 'Product updated successfully!' : 'Product added successfully!');
        setProdForm({
          id: null,
          name: '',
          category: 'minimalist',
          price: '',
          originalPrice: '',
          size: '3 x 3 inches',
          description: '',
          image1: '',
          image2: '',
          isBestseller: false,
          isNew: false
        });
        setIsEditingProd(false);
        fetchData('products');
      } else {
        const errData = await res.json();
        alert(`Error saving product: ${errData.message}`);
      }
    } catch (err) {
      alert('Network error while saving product.');
    }
  };

  const handleEditClick = (prod) => {
    setProdForm({
      id: prod._id,
      name: prod.name,
      category: prod.category,
      price: prod.price,
      originalPrice: prod.originalPrice || '',
      size: prod.size,
      description: prod.description,
      image1: prod.image1,
      image2: prod.image2,
      isBestseller: prod.isBestseller,
      isNew: prod.isNew
    });
    setIsEditingProd(true);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 401) {
        handleSessionExpired();
        return;
      }
      if (res.ok) {
        alert('Product deleted successfully.');
        fetchData('products');
      } else {
        alert('Error deleting product.');
      }
    } catch (err) {
      alert('Network error while deleting product.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="section-padding" style={{ background: '#fafafa', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
        <div className="bulk-container" style={{ maxWidth: '400px', margin: '0 auto', boxShadow: 'var(--shadow-md)' }}>
          <h2 className="section-title" style={{ fontSize: '1.5rem', textAlign: 'center', marginBottom: '24px' }}>
            Admin Portal
          </h2>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label" htmlFor="admin-pass">Enter Admin Password</label>
              <input
                type="password"
                id="admin-pass"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="e.g. admin123"
                required
              />
            </div>
            <button type="submit" className="submit-btn">Login</button>
            <button 
              type="button" 
              className="submit-btn" 
              style={{ background: 'transparent', color: '#71717a', marginTop: '10px', border: '1px solid var(--color-border)' }}
              onClick={onClose}
            >
              Back to Shop
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <section className="section-padding" style={{ background: '#fafafa', minHeight: '90vh' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <p className="section-subtitle">Management Console</p>
            <h2 className="section-title" style={{ textAlign: 'left' }}>Admin Panel</h2>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              className="submit-btn" 
              style={{ maxWidth: '120px', background: '#e11d48' }}
              onClick={handleLogout}
            >
              Logout
            </button>
            <button 
              className="submit-btn" 
              style={{ maxWidth: '150px', background: 'var(--color-muted)' }}
              onClick={onClose}
            >
              Back to Shop
            </button>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="collection-tabs" style={{ justifyContent: 'flex-start', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
          <button 
            className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            Products ({products.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'testimonials' ? 'active' : ''}`}
            onClick={() => setActiveTab('testimonials')}
          >
            Testimonials ({testimonials.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'inquiries' ? 'active' : ''}`}
            onClick={() => setActiveTab('inquiries')}
          >
            B2B Inquiries ({inquiries.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'payments' ? 'active' : ''}`}
            onClick={() => setActiveTab('payments')}
          >
            Payments/Orders ({payments.length})
          </button>
        </div>

        {/* TAB 1: PRODUCTS MANAGER */}
        {activeTab === 'products' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '32px', marginTop: '24px' }}>
            {/* Form */}
            <div className="bulk-container" style={{ margin: 0, padding: '24px' }}>
              <h3 className="footer-heading" style={{ color: 'var(--color-dark)', marginBottom: '16px' }}>
                {isEditingProd ? 'Edit Product' : 'Add New Product'}
              </h3>
              <form onSubmit={handleSaveProduct}>
                <div className="form-group">
                  <label className="form-label">Product Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={prodForm.name}
                    onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
                    required
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div className="form-group">
                    <label className="form-label">Category *</label>
                    <select
                      className="form-input"
                      value={prodForm.category}
                      onChange={(e) => setProdForm({ ...prodForm, category: e.target.value })}
                    >
                      <option value="minimalist">Minimalist</option>
                      <option value="spiritual">Spiritual</option>
                      <option value="anime">Anime & Pop</option>
                      <option value="gothic">Gothic & Dark</option>
                      <option value="typography">Typography</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Size *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={prodForm.size}
                      onChange={(e) => setProdForm({ ...prodForm, size: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div className="form-group">
                    <label className="form-label">Price (INR) *</label>
                    <input
                      type="number"
                      className="form-input"
                      value={prodForm.price}
                      onChange={(e) => setProdForm({ ...prodForm, price: parseFloat(e.target.value) })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Original Price (Strikethrough)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={prodForm.originalPrice}
                      onChange={(e) => setProdForm({ ...prodForm, originalPrice: parseFloat(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Description *</label>
                  <textarea
                    className="form-input"
                    style={{ minHeight: '60px' }}
                    value={prodForm.description}
                    onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Image 1 URL *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={prodForm.image1}
                    onChange={(e) => setProdForm({ ...prodForm, image1: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Image 2 URL (Hover State) *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={prodForm.image2}
                    onChange={(e) => setProdForm({ ...prodForm, image2: e.target.value })}
                    placeholder="https://example.com/hover.jpg"
                    required
                  />
                </div>

                <div style={{ display: 'flex', gap: '20px', margin: '14px 0' }}>
                  <label style={{ fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <input
                      type="checkbox"
                      checked={prodForm.isBestseller}
                      onChange={(e) => setProdForm({ ...prodForm, isBestseller: e.target.checked })}
                    />
                    Is Bestseller
                  </label>
                  <label style={{ fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <input
                      type="checkbox"
                      checked={prodForm.isNew}
                      onChange={(e) => setProdForm({ ...prodForm, isNew: e.target.checked })}
                    />
                    Is New Drop
                  </label>
                </div>

                <button type="submit" className="submit-btn">
                  {isEditingProd ? 'Update Product' : 'Add Product'}
                </button>
                {isEditingProd && (
                  <button
                    type="button"
                    className="submit-btn animate-fade-in"
                    style={{ background: 'transparent', color: '#71717a', marginTop: '10px', border: '1px solid var(--color-border)' }}
                    onClick={() => {
                      setIsEditingProd(false);
                      setProdForm({
                        id: null,
                        name: '',
                        category: 'minimalist',
                        price: '',
                        originalPrice: '',
                        size: '3 x 3 inches',
                        description: '',
                        image1: '',
                        image2: '',
                        isBestseller: false,
                        isNew: false
                      });
                    }}
                  >
                    Cancel Edit
                  </button>
                )}
              </form>
            </div>

            {/* List */}
            <div className="comparison-container" style={{ background: '#ffffff', maxHeight: '600px', overflowY: 'auto' }}>
              <table className="comp-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((prod) => (
                    <tr key={prod._id}>
                      <td style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img src={prod.image1} alt={prod.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                        <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{prod.name}</span>
                      </td>
                      <td style={{ textTransform: 'capitalize' }}>{prod.category}</td>
                      <td>₹{prod.price}</td>
                      <td>
                        <button 
                          style={{ color: 'blue', marginRight: '10px', textDecoration: 'underline' }}
                          onClick={() => handleEditClick(prod)}
                        >
                          Edit
                        </button>
                        <button 
                          style={{ color: 'red', textDecoration: 'underline' }}
                          onClick={() => handleDeleteProduct(prod._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: TESTIMONIALS MANAGER */}
        {activeTab === 'testimonials' && (
          <div className="comparison-container" style={{ background: '#ffffff', marginTop: '24px' }}>
            <table className="comp-table">
              <thead>
                <tr>
                  <th>Author</th>
                  <th>Stars</th>
                  <th>Review Text</th>
                  <th>Verified</th>
                </tr>
              </thead>
              <tbody>
                {testimonials.map((test) => (
                  <tr key={test._id}>
                    <td style={{ fontWeight: 'bold' }}>{test.name}</td>
                    <td style={{ color: 'var(--color-accent)' }}>{test.stars}</td>
                    <td style={{ fontSize: '0.85rem', fontStyle: 'italic' }}>"{test.text}"</td>
                    <td>{test.verified ? 'Verified Customer' : 'No'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 3: B2B INQUIRIES */}
        {activeTab === 'inquiries' && (
          <div className="comparison-container" style={{ background: '#ffffff', marginTop: '24px' }}>
            <table className="comp-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Email</th>
                  <th>Quantity Requested</th>
                  <th>Project Details</th>
                  <th>Received Date</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', color: '#71717a' }}>No bulk inquiries received yet.</td>
                  </tr>
                ) : (
                  inquiries.map((inq) => (
                    <tr key={inq._id}>
                      <td style={{ fontWeight: 'bold' }}>{inq.name}</td>
                      <td><a href={`mailto:${inq.email}`} style={{ textDecoration: 'underline' }}>{inq.email}</a></td>
                      <td>{inq.quantity} units</td>
                      <td style={{ fontSize: '0.85rem' }}>{inq.details}</td>
                      <td>{new Date(inq.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 4: PAYMENTS & ORDER LEDGER */}
        {activeTab === 'payments' && (
          <div className="comparison-container" style={{ background: '#ffffff', marginTop: '24px' }}>
            <table className="comp-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer Info</th>
                  <th>Items Bought</th>
                  <th>Total Amount</th>
                  <th>Payment Mode</th>
                  <th>Status</th>
                  <th>Stripe ID</th>
                </tr>
              </thead>
              <tbody>
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', color: '#71717a' }}>No order transactions recorded yet.</td>
                  </tr>
                ) : (
                  payments.map((pay) => (
                    <tr key={pay._id}>
                      <td style={{ fontWeight: 'bold', color: 'var(--color-dark)' }}>{pay.orderId}</td>
                      <td>
                        <div style={{ fontSize: '0.85rem' }}>
                          <p style={{ fontWeight: 'bold' }}>{pay.name}</p>
                          <p style={{ color: '#71717a' }}>{pay.email}</p>
                          <p style={{ color: '#71717a' }}>{pay.phone}</p>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.8rem', color: '#52525b' }}>
                          {pay.items.map((item, idx) => (
                            <p key={idx}>
                              - {item.name} {item.customLetter && `(${item.customLetter})`} [x{item.quantity}]
                            </p>
                          ))}
                        </div>
                      </td>
                      <td style={{ fontWeight: 'bold' }}>₹{pay.grandTotal}</td>
                      <td style={{ textTransform: 'uppercase', fontSize: '0.8rem' }}>{pay.paymentMethod}</td>
                      <td>
                        <span className={`comp-badge ${pay.paymentStatus === 'Paid' ? 'green' : 'gray'}`}>
                          {pay.paymentStatus}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.75rem', color: '#71717a' }}>
                        {pay.paymentIntentId || 'N/A'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

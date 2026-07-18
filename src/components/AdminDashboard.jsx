import React, { useState, useEffect } from 'react';

const IS_PROD = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
const API_BASE = IS_PROD
  ? 'https://tatto-backend-4axz.onrender.com/api'
  : 'http://localhost:5000/api';


export default function AdminDashboard({ onClose }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(localStorage.getItem('seedink_admin_token') || '');
  const [activeTab, setActiveTab] = useState('products');
  
  // Data States
  const [products, setProducts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [payments, setPayments] = useState([]);
  const [leads, setLeads] = useState([]);

  // Product Form State
  const [prodForm, setProdForm] = useState({
    id: null,
    name: '',
    category: 'hinduism',
    price: '',
    originalPrice: '',
    size: '3 x 3 inches',
    description: '',
    image1: '',
    image2: '',
    placementArm: '',
    placementChest: '',
    placementBack: '',
    placementNeck: '',
    placementHand: '',
    isBestseller: false,
    isNew: false
  });
  const [isEditingProd, setIsEditingProd] = useState(false);

  const handleFileUpload = (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      alert("Image is too large. Please upload an image smaller than 4MB.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setProdForm(prev => ({ ...prev, [fieldName]: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  // Validate session on load — clear old-format tokens (no dot = old random hex)
  useEffect(() => {
    if (token) {
      // New HMAC tokens contain a '.' separator. Old random hex tokens don't.
      if (!token.includes('.')) {
        localStorage.removeItem('seedink_admin_token');
        setToken('');
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
      }
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
      } else if (tabName === 'leads') {
        const res = await fetch(`${API_BASE}/leads`, { headers });
        if (res.status === 401) {
          handleSessionExpired();
          return;
        }
        const data = await res.json();
        if (res.ok) setLeads(data);
      }
    } catch (err) {
      console.error(`Error loading data for ${tabName}:`, err);
    }
  };

  const handleSessionExpired = () => {
    alert('Admin session expired. Please log in again.');
    localStorage.removeItem('seedink_admin_token');
    setToken('');
    setIsAuthenticated(false);
    onClose();
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
        localStorage.setItem('seedink_admin_token', data.token);
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
    localStorage.removeItem('seedink_admin_token');
    setToken('');
    setIsAuthenticated(false);
    onClose();
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
      const targetUrl = isEditingProd && prodForm.id
        ? `${API_BASE}/products/${prodForm.id}`
        : `${API_BASE}/products`;
      const method = isEditingProd && prodForm.id ? 'PUT' : 'POST';

      res = await fetch(targetUrl, {
        method,
        headers,
        body: JSON.stringify(prodForm)
      });

      if (res.status === 401) {
        handleSessionExpired();
        return;
      }

      if (res.ok) {
        alert(isEditingProd ? 'Product updated successfully!' : 'Product added successfully!');
        setProdForm({
          id: null,
          name: '',
          category: 'hinduism',
          price: '',
          originalPrice: '',
          size: '3 x 3 inches',
          description: '',
          image1: '',
          image2: '',
          placementArm: '',
          placementChest: '',
          placementBack: '',
          placementNeck: '',
          placementHand: '',
          isBestseller: false,
          isNew: false
        });
        setIsEditingProd(false);
        fetchData('products');
      } else {
        const errData = await res.json();
        alert(`Error saving product: ${errData.message}\n(HTTP ${res.status})`);
      }
    } catch (err) {
      alert(`Network error while saving product.\n\nURL: ${API_BASE}/products\nError: ${err.message}\n\nPlease check if your PowerShell deployment finished correctly.`);
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
      placementArm: prod.placementArm || '',
      placementChest: prod.placementChest || '',
      placementBack: prod.placementBack || '',
      placementNeck: prod.placementNeck || '',
      placementHand: prod.placementHand || '',
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
  };

  /* ==========================================
     ORDER & SHIPMENT HANDLERS
     ========================================== */
  const handleShipOrder = async (orderId) => {
    const carrier = prompt("Enter shipping carrier (e.g. Delhivery, BlueDart, Indian Post):", "Delhivery");
    if (!carrier) return;
    const trackingId = prompt("Enter Tracking ID / AWB Number:");
    if (!trackingId) return;

    try {
      const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          orderStatus: 'Shipped',
          carrier,
          trackingId
        })
      });
      if (res.ok) {
        alert('Order marked as Shipped!');
        fetchData('payments');
      } else {
        alert('Failed to update order shipment status.');
      }
    } catch (e) {
      alert('Network error updating shipment details.');
    }
  };

  const handleDeliverOrder = async (orderId) => {
    if (!confirm('Are you sure you want to mark this order as Delivered?')) return;
    try {
      const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          orderStatus: 'Delivered',
          paymentStatus: 'Paid'
        })
      });
      if (res.ok) {
        alert('Order marked as Delivered & Paid!');
        fetchData('payments');
      } else {
        alert('Failed to update delivery status.');
      }
    } catch (e) {
      alert('Network error updating delivery details.');
    }
  };
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
            className={`tab-btn ${activeTab === 'payments' ? 'active' : ''}`}
            onClick={() => setActiveTab('payments')}
          >
            Orders & Shipping ({payments.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'leads' ? 'active' : ''}`}
            onClick={() => setActiveTab('leads')}
          >
            Chatbot Leads ({leads.length})
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
                      <option value="hinduism">Hinduism</option>
                      <option value="islam">Islam</option>
                      <option value="sikhism">Sikhism</option>
                      <option value="buddhism">Buddhism</option>
                      <option value="judaism">Judaism</option>
                      <option value="christianity">Christianity</option>
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

                {/* Image upload section */}
                <h4 style={{ fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--color-dark)', margin: '20px 0 10px 0', borderBottom: '1px solid var(--color-border)', paddingBottom: '6px' }}>
                  🖼️ Product Images & Placements
                </h4>

                {/* 1. Main Image */}
                <div style={{ background: '#f9f9fb', border: '1px solid #e4e4e7', padding: '12px', borderRadius: '6px', marginBottom: '14px' }}>
                  <label className="form-label" style={{ fontWeight: 'bold' }}>Main Design Art (Image 1) *</label>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', margin: '6px 0' }}>
                    <input
                      type="text"
                      className="form-input"
                      style={{ margin: 0, flex: 1 }}
                      value={prodForm.image1}
                      onChange={(e) => setProdForm({ ...prodForm, image1: e.target.value })}
                      placeholder="Paste Image URL or select file →"
                      required
                    />
                    <label style={{ padding: '10px 14px', background: 'var(--color-dark)', color: '#fff', fontSize: '0.8rem', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer', display: 'inline-block', whiteSpace: 'nowrap' }}>
                      📁 Upload
                      <input 
                        type="file" 
                        accept="image/*" 
                        style={{ display: 'none' }} 
                        onChange={(e) => handleFileUpload(e, 'image1')} 
                      />
                    </label>
                  </div>
                  {prodForm.image1 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                      <img src={prodForm.image1} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ddd' }} />
                      <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 'bold' }}>✓ Loaded successfully</span>
                    </div>
                  )}
                </div>

                {/* 2. Hover Image */}
                <div style={{ background: '#f9f9fb', border: '1px solid #e4e4e7', padding: '12px', borderRadius: '6px', marginBottom: '14px' }}>
                  <label className="form-label" style={{ fontWeight: 'bold' }}>Hover View Art (Image 2) *</label>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', margin: '6px 0' }}>
                    <input
                      type="text"
                      className="form-input"
                      style={{ margin: 0, flex: 1 }}
                      value={prodForm.image2}
                      onChange={(e) => setProdForm({ ...prodForm, image2: e.target.value })}
                      placeholder="Paste Image URL or select file →"
                      required
                    />
                    <label style={{ padding: '10px 14px', background: 'var(--color-dark)', color: '#fff', fontSize: '0.8rem', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer', display: 'inline-block', whiteSpace: 'nowrap' }}>
                      📁 Upload
                      <input 
                        type="file" 
                        accept="image/*" 
                        style={{ display: 'none' }} 
                        onChange={(e) => handleFileUpload(e, 'image2')} 
                      />
                    </label>
                  </div>
                  {prodForm.image2 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                      <img src={prodForm.image2} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ddd' }} />
                      <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 'bold' }}>✓ Loaded successfully</span>
                    </div>
                  )}
                </div>

                {/* Body part placements sub-form */}
                <div style={{ background: '#f4f4f5', padding: '16px', borderRadius: '8px', border: '1px dashed #d4d4d8', marginBottom: '14px' }}>
                  <p style={{ fontSize: '0.78rem', fontWeight: '800', color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
                    💪 Model Body part Placements (Circles Preview)
                  </p>

                  {/* 1. Arm Placement */}
                  <div style={{ marginBottom: '10px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--color-dark)' }}>Forearm Preview</label>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
                      <input
                        type="text"
                        className="form-input"
                        style={{ margin: 0, flex: 1, padding: '8px 12px', fontSize: '0.85rem' }}
                        value={prodForm.placementArm}
                        onChange={(e) => setProdForm({ ...prodForm, placementArm: e.target.value })}
                        placeholder="Arm placement URL..."
                      />
                      <label style={{ padding: '8px 12px', background: '#3f3f46', color: '#fff', fontSize: '0.75rem', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                        📁 Upload
                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, 'placementArm')} />
                      </label>
                    </div>
                    {prodForm.placementArm && (
                      <img src={prodForm.placementArm} style={{ width: '32px', height: '32px', objectFit: 'cover', borderRadius: '50%', border: '1px solid #ccc', marginTop: '4px' }} />
                    )}
                  </div>

                  {/* 2. Chest Placement */}
                  <div style={{ marginBottom: '10px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--color-dark)' }}>Chest / Shoulder Preview</label>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
                      <input
                        type="text"
                        className="form-input"
                        style={{ margin: 0, flex: 1, padding: '8px 12px', fontSize: '0.85rem' }}
                        value={prodForm.placementChest}
                        onChange={(e) => setProdForm({ ...prodForm, placementChest: e.target.value })}
                        placeholder="Chest placement URL..."
                      />
                      <label style={{ padding: '8px 12px', background: '#3f3f46', color: '#fff', fontSize: '0.75rem', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                        📁 Upload
                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, 'placementChest')} />
                      </label>
                    </div>
                    {prodForm.placementChest && (
                      <img src={prodForm.placementChest} style={{ width: '32px', height: '32px', objectFit: 'cover', borderRadius: '50%', border: '1px solid #ccc', marginTop: '4px' }} />
                    )}
                  </div>

                  {/* 3. Back Placement */}
                  <div style={{ marginBottom: '10px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--color-dark)' }}>Back / Spine Preview</label>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
                      <input
                        type="text"
                        className="form-input"
                        style={{ margin: 0, flex: 1, padding: '8px 12px', fontSize: '0.85rem' }}
                        value={prodForm.placementBack}
                        onChange={(e) => setProdForm({ ...prodForm, placementBack: e.target.value })}
                        placeholder="Back placement URL..."
                      />
                      <label style={{ padding: '8px 12px', background: '#3f3f46', color: '#fff', fontSize: '0.75rem', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                        📁 Upload
                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, 'placementBack')} />
                      </label>
                    </div>
                    {prodForm.placementBack && (
                      <img src={prodForm.placementBack} style={{ width: '32px', height: '32px', objectFit: 'cover', borderRadius: '50%', border: '1px solid #ccc', marginTop: '4px' }} />
                    )}
                  </div>

                  {/* 4. Neck Placement */}
                  <div style={{ marginBottom: '10px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--color-dark)' }}>Neck Preview</label>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
                      <input
                        type="text"
                        className="form-input"
                        style={{ margin: 0, flex: 1, padding: '8px 12px', fontSize: '0.85rem' }}
                        value={prodForm.placementNeck}
                        onChange={(e) => setProdForm({ ...prodForm, placementNeck: e.target.value })}
                        placeholder="Neck placement URL..."
                      />
                      <label style={{ padding: '8px 12px', background: '#3f3f46', color: '#fff', fontSize: '0.75rem', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                        📁 Upload
                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, 'placementNeck')} />
                      </label>
                    </div>
                    {prodForm.placementNeck && (
                      <img src={prodForm.placementNeck} style={{ width: '32px', height: '32px', objectFit: 'cover', borderRadius: '50%', border: '1px solid #ccc', marginTop: '4px' }} />
                    )}
                  </div>

                  {/* 5. Hand Placement */}
                  <div style={{ marginBottom: '10px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--color-dark)' }}>Hand Back Preview</label>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
                      <input
                        type="text"
                        className="form-input"
                        style={{ margin: 0, flex: 1, padding: '8px 12px', fontSize: '0.85rem' }}
                        value={prodForm.placementHand}
                        onChange={(e) => setProdForm({ ...prodForm, placementHand: e.target.value })}
                        placeholder="Hand placement URL..."
                      />
                      <label style={{ padding: '8px 12px', background: '#3f3f46', color: '#fff', fontSize: '0.75rem', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                        📁 Upload
                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, 'placementHand')} />
                      </label>
                    </div>
                    {prodForm.placementHand && (
                      <img src={prodForm.placementHand} style={{ width: '32px', height: '32px', objectFit: 'cover', borderRadius: '50%', border: '1px solid #ccc', marginTop: '4px' }} />
                    )}
                  </div>
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
                        category: 'hinduism',
                        price: '',
                        originalPrice: '',
                        size: '3 x 3 inches',
                        description: '',
                        image1: '',
                        image2: '',
                        placementArm: '',
                        placementChest: '',
                        placementBack: '',
                        placementNeck: '',
                        placementHand: '',
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
                  <th>Payment Status</th>
                  <th>Shipment Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', color: '#71717a' }}>No order transactions recorded yet.</td>
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
                          <p style={{ color: '#71717a', fontSize: '0.8rem' }}>{pay.address}, {pay.city} - {pay.pincode}</p>
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
                      <td>
                        <span className={`comp-badge ${pay.orderStatus === 'Delivered' ? 'green' : pay.orderStatus === 'Shipped' ? 'blue' : 'gray'}`}>
                          {pay.orderStatus || 'Pending'}
                        </span>
                        {pay.orderStatus === 'Shipped' && (
                          <div style={{ fontSize: '0.75rem', color: '#71717a', marginTop: '4px' }}>
                            {pay.carrier}: {pay.trackingId}
                          </div>
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {(!pay.orderStatus || pay.orderStatus === 'Pending') && (
                            <button 
                              onClick={() => handleShipOrder(pay._id)}
                              style={{ padding: '6px 12px', background: 'var(--color-accent)', color: 'var(--color-dark)', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}
                            >
                              Ship Order
                            </button>
                          )}
                          {pay.orderStatus === 'Shipped' && (
                            <button 
                              onClick={() => handleDeliverOrder(pay._id)}
                              style={{ padding: '6px 12px', background: '#0ca678', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}
                            >
                              Deliver Order
                            </button>
                          )}
                          {pay.orderStatus === 'Delivered' && (
                            <span style={{ fontSize: '0.8rem', color: '#0ca678', fontWeight: 'bold' }}>Completed ✓</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 5: CHATBOT LEADS */}
        {activeTab === 'leads' && (
          <div className="comparison-container" style={{ background: '#ffffff', marginTop: '24px' }}>
            <table className="comp-table">
              <thead>
                <tr>
                  <th>Customer Info</th>
                  <th>Tattoo Request Idea</th>
                  <th>Size & Placement</th>
                  <th>Received Date</th>
                  <th>Conversation History</th>
                </tr>
              </thead>
              <tbody>
                {leads.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', color: '#71717a' }}>No chatbot leads captured yet.</td>
                  </tr>
                ) : (
                  leads.map((lead) => (
                    <tr key={lead._id}>
                      <td>
                        <div style={{ fontSize: '0.85rem' }}>
                          <p style={{ fontWeight: 'bold' }}>{lead.name}</p>
                          {lead.email && <p style={{ color: '#71717a' }}>{lead.email}</p>}
                          {lead.phone && <p style={{ color: '#71717a' }}>{lead.phone}</p>}
                        </div>
                      </td>
                      <td style={{ fontWeight: 'bold' }}>{lead.tattooIdea}</td>
                      <td>
                        <div style={{ fontSize: '0.8rem' }}>
                          {lead.size && <p>Size: {lead.size}</p>}
                          {lead.placement && <p>Placement: {lead.placement}</p>}
                        </div>
                      </td>
                      <td>{new Date(lead.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button 
                          onClick={() => {
                            const chatText = lead.chatHistory
                              .map(msg => `${msg.sender === 'user' ? 'Customer' : 'Bot'}: ${msg.text}`)
                              .join('\n\n');
                            alert(chatText || 'No chat transcript recorded.');
                          }}
                          style={{ padding: '6px 12px', background: 'rgba(0,0,0,0.06)', color: 'var(--color-dark)', border: '1px solid var(--color-border)', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                        >
                          View Chat History ({lead.chatHistory?.length || 0} messages)
                        </button>
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

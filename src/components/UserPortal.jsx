import React, { useState, useEffect } from 'react';

export default function UserPortal({ isOpen, onClose, user, onLoginSuccess, onLogout }) {
  const [isRegister, setIsRegister] = useState(false);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'profile'
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');

  // Error/Success alerts
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

  // Fetch orders when user is authenticated and tab is active
  useEffect(() => {
    if (user && activeTab === 'orders' && isOpen) {
      fetchOrders();
    }
  }, [user, activeTab, isOpen]);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const token = localStorage.getItem('seedink_user_token');
      const res = await fetch(`${API_BASE}/auth/user/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (e) {
      console.error('Error fetching user orders:', e);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);
    try {
      const res = await fetch(`${API_BASE}/auth/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('seedink_user_token', data.token);
        localStorage.setItem('seedink_user_data', JSON.stringify(data.user));
        onLoginSuccess(data.user);
        setMessage('Login successful!');
      } else {
        setIsError(true);
        setMessage(data.message || 'Login failed.');
      }
    } catch (err) {
      setIsError(true);
      setMessage('Network error connecting to auth server.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);
    try {
      const res = await fetch(`${API_BASE}/auth/user/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone, address, city, pincode })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('seedink_user_token', data.token);
        localStorage.setItem('seedink_user_data', JSON.stringify(data.user));
        onLoginSuccess(data.user);
        setMessage('Account registered successfully!');
      } else {
        setIsError(true);
        setMessage(data.message || 'Registration failed.');
      }
    } catch (err) {
      setIsError(true);
      setMessage('Network error during registration.');
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);
    try {
      const token = localStorage.getItem('seedink_user_token');
      const res = await fetch(`${API_BASE}/auth/user/profile`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ phone, address, city, pincode })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('seedink_user_data', JSON.stringify(data));
        onLoginSuccess(data); // update user context
        setMessage('Profile updated successfully!');
      } else {
        setIsError(true);
        setMessage('Failed to update profile.');
      }
    } catch (err) {
      setIsError(true);
      setMessage('Network error updating profile.');
    }
  };

  // Populate profile fields when user shifts to profile tab or logs in
  useEffect(() => {
    if (user) {
      setPhone(user.phone || '');
      setAddress(user.address || '');
      setCity(user.city || '');
      setPincode(user.pincode || '');
    }
  }, [user, activeTab]);

  if (!isOpen) return null;

  return (
    <div 
      className="modal-overlay" 
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0,0,0,0.6)',
        display: 'flex',
        justifyContent: 'flex-end',
        zIndex: 1000,
        backdropFilter: 'blur(4px)'
      }}
    >
      <div 
        className="user-portal-container"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '500px',
          height: '100%',
          background: 'var(--color-light)',
          boxShadow: '-10px 0 30px rgba(0,0,0,0.15)',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          overflowY: 'auto'
        }}
      >
        {/* Header */}
        <div style={{ padding: '24px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="section-title" style={{ margin: 0, fontSize: '1.4rem', textAlign: 'left' }}>
            {user ? `Welcome, ${user.name}` : isRegister ? 'Create Account' : 'Sign In'}
          </h2>
          <button onClick={onClose} style={{ fontSize: '1.5rem', color: 'var(--color-muted)', cursor: 'pointer' }}>&times;</button>
        </div>

        {/* Alerts */}
        {message && (
          <div style={{
            margin: '16px 24px 0',
            padding: '12px 16px',
            borderRadius: '8px',
            background: isError ? '#ffeef0' : '#e6fcf5',
            color: isError ? '#d93838' : '#0ca678',
            fontSize: '0.85rem',
            border: `1px solid ${isError ? '#ffd8d8' : '#c3fae8'}`
          }}>
            {message}
          </div>
        )}

        {/* Content body */}
        <div style={{ flex: 1, padding: '24px' }}>
          {!user ? (
            /* AUTH FORMS */
            <form onSubmit={isRegister ? handleRegister : handleLogin}>
              {isRegister && (
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label">Full Name *</label>
                  <input type="text" className="form-input" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
              )}
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label">Email Address *</label>
                <input type="email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="form-label">Password *</label>
                <input type="password" className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>

              {isRegister && (
                <>
                  <h3 style={{ fontSize: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px', margin: '24px 0 16px', color: 'var(--color-muted)' }}>
                    Shipping Address (Optional)
                  </h3>
                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label className="form-label">Phone Number</label>
                    <input type="tel" className="form-input" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>
                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label className="form-label">Address Line</label>
                    <input type="text" className="form-input" value={address} onChange={(e) => setAddress(e.target.value)} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="form-group" style={{ marginBottom: '16px' }}>
                      <label className="form-label">City</label>
                      <input type="text" className="form-input" value={city} onChange={(e) => setCity(e.target.value)} />
                    </div>
                    <div className="form-group" style={{ marginBottom: '16px' }}>
                      <label className="form-label">Pincode</label>
                      <input type="text" className="form-input" value={pincode} onChange={(e) => setPincode(e.target.value)} />
                    </div>
                  </div>
                </>
              )}

              <button type="submit" className="submit-btn" style={{ width: '100%', marginBottom: '16px' }}>
                {isRegister ? 'Register & Log In' : 'Sign In'}
              </button>

              <button 
                type="button" 
                onClick={() => setIsRegister(!isRegister)} 
                style={{ width: '100%', textAlign: 'center', fontSize: '0.85rem', color: 'var(--color-accent)', textDecoration: 'underline' }}
              >
                {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
              </button>
            </form>
          ) : (
            /* USER DASHBOARD */
            <div>
              {/* Dashboard Tabs */}
              <div className="collection-tabs" style={{ justifyContent: 'flex-start', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px', marginBottom: '24px' }}>
                <button 
                  className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
                  onClick={() => setActiveTab('orders')}
                >
                  My Orders
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
                  onClick={() => setActiveTab('profile')}
                >
                  Saved Shipping Address
                </button>
                <button 
                  className="tab-btn"
                  style={{ marginLeft: 'auto', color: '#e11d48' }}
                  onClick={onLogout}
                >
                  Logout
                </button>
              </div>

              {activeTab === 'profile' ? (
                /* SHIPPING PROFILE EDIT */
                <form onSubmit={handleUpdateProfile}>
                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label className="form-label">Phone Number</label>
                    <input type="tel" className="form-input" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                  </div>
                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label className="form-label">Street Address</label>
                    <input type="text" className="form-input" value={address} onChange={(e) => setAddress(e.target.value)} required />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="form-group" style={{ marginBottom: '16px' }}>
                      <label className="form-label">City</label>
                      <input type="text" className="form-input" value={city} onChange={(e) => setCity(e.target.value)} required />
                    </div>
                    <div className="form-group" style={{ marginBottom: '24px' }}>
                      <label className="form-label">Pincode</label>
                      <input type="text" className="form-input" value={pincode} onChange={(e) => setPincode(e.target.value)} required />
                    </div>
                  </div>
                  <button type="submit" className="submit-btn" style={{ width: '100%' }}>Update Address Profile</button>
                </form>
              ) : (
                /* ORDER HISTORY & SHIPMENT TRACKING */
                <div>
                  {loadingOrders ? (
                    <div style={{ textAlign: 'center', color: 'var(--color-muted)', padding: '40px 0' }}>Loading orders...</div>
                  ) : orders.length === 0 ? (
                    <div style={{ textAlign: 'center', color: 'var(--color-muted)', padding: '40px 0' }}>You haven't placed any orders yet.</div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                      {orders.map((order) => (
                        <div 
                          key={order._id}
                          style={{
                            border: '1px solid var(--color-border)',
                            borderRadius: '12px',
                            padding: '20px',
                            background: '#fcfcfc',
                            boxShadow: 'var(--shadow-sm)'
                          }}
                        >
                          {/* Order metadata header */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px', marginBottom: '16px' }}>
                            <div>
                              <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)', display: 'block' }}>Order ID</span>
                              <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{order.orderId}</span>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)', display: 'block' }}>Grand Total</span>
                              <span style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--color-accent)' }}>₹{order.grandTotal}</span>
                            </div>
                          </div>

                          {/* Items List */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                            {order.items.map((item, i) => (
                              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                <span>{item.name} <span style={{ color: 'var(--color-muted)' }}>({item.size}) x{item.quantity}</span></span>
                                <span>₹{item.price * item.quantity}</span>
                              </div>
                            ))}
                          </div>

                          {/* Flipkart-style Status Tracking Timeline */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', margin: '20px 10px 30px' }}>
                            {/* Connector Line */}
                            <div style={{
                              position: 'absolute',
                              top: '10px',
                              left: '10px',
                              right: '10px',
                              height: '3px',
                              background: '#e4e4e7',
                              zIndex: 0
                            }}>
                              <div style={{
                                width: order.orderStatus === 'Pending' ? '0%' : order.orderStatus === 'Shipped' ? '50%' : '100%',
                                height: '100%',
                                background: '#0ca678',
                                transition: 'width 0.5s ease'
                              }}></div>
                            </div>

                            {/* Node 1: Ordered */}
                            <div style={{ textAlign: 'center', zIndex: 1, background: '#fcfcfc', padding: '0 8px' }}>
                              <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#0ca678', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', margin: '0 auto 6px' }}>✓</div>
                              <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Ordered</span>
                            </div>

                            {/* Node 2: Shipped */}
                            <div style={{ textAlign: 'center', zIndex: 1, background: '#fcfcfc', padding: '0 8px' }}>
                              <div style={{ 
                                width: '22px', 
                                height: '22px', 
                                borderRadius: '50%', 
                                background: (order.orderStatus === 'Shipped' || order.orderStatus === 'Delivered') ? '#0ca678' : '#e4e4e7', 
                                color: '#fff', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                fontSize: '0.7rem', 
                                margin: '0 auto 6px' 
                              }}>{(order.orderStatus === 'Shipped' || order.orderStatus === 'Delivered') ? '✓' : ''}</div>
                              <span style={{ fontSize: '0.75rem', fontWeight: (order.orderStatus === 'Shipped' || order.orderStatus === 'Delivered') ? 'bold' : 'normal' }}>Shipped</span>
                            </div>

                            {/* Node 3: Delivered */}
                            <div style={{ textAlign: 'center', zIndex: 1, background: '#fcfcfc', padding: '0 8px' }}>
                              <div style={{ 
                                width: '22px', 
                                height: '22px', 
                                borderRadius: '50%', 
                                background: order.orderStatus === 'Delivered' ? '#0ca678' : '#e4e4e7', 
                                color: '#fff', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                fontSize: '0.7rem', 
                                margin: '0 auto 6px' 
                              }}>{order.orderStatus === 'Delivered' ? '✓' : ''}</div>
                              <span style={{ fontSize: '0.75rem', fontWeight: order.orderStatus === 'Delivered' ? 'bold' : 'normal' }}>Delivered</span>
                            </div>
                          </div>

                          {/* Shipment details */}
                          {order.orderStatus === 'Shipped' && order.trackingId && (
                            <div style={{
                              padding: '12px 16px',
                              background: '#fff9db',
                              borderRadius: '8px',
                              border: '1px solid #ffe3e3',
                              fontSize: '0.8rem',
                              color: '#664d03'
                            }}>
                              <strong>🚚 Shipping Details:</strong> Shipped via {order.carrier || 'Express Delivery'}. 
                              <br />Tracking ID: <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{order.trackingId}</span>
                            </div>
                          )}

                          {/* COD and Payment Status Badge */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', fontSize: '0.8rem' }}>
                            <span style={{ color: 'var(--color-muted)' }}>Payment: <strong style={{ color: '#000' }}>{order.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Card'}</strong></span>
                            <span style={{
                              padding: '4px 10px',
                              borderRadius: '20px',
                              fontWeight: 'bold',
                              background: order.paymentStatus === 'Paid' ? '#e6fcf5' : '#fff9db',
                              color: order.paymentStatus === 'Paid' ? '#0ca678' : '#f08c00'
                            }}>
                              {order.paymentStatus}
                            </span>
                          </div>

                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

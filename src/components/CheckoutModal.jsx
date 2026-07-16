import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

export default function CheckoutModal() {
  const { checkoutOpen, setCheckoutOpen, cartItems, cartTotal, clearCart, API_BASE } = useCart();
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    paymentMethod: 'cod',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: ''
  });
  const [status, setStatus] = useState('idle'); // idle | card-entry | loading | success
  const [orderId, setOrderId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Pre-fill user profile if logged in
  React.useEffect(() => {
    if (checkoutOpen) {
      const savedUserStr = localStorage.getItem('seedink_user_data');
      if (savedUserStr) {
        try {
          const user = JSON.parse(savedUserStr);
          setShippingInfo(prev => ({
            ...prev,
            name: user.name || prev.name,
            email: user.email || prev.email,
            phone: user.phone || prev.phone,
            address: user.address || prev.address,
            city: user.city || prev.city,
            pincode: user.pincode || prev.pincode
          }));
        } catch (e) {
          console.error('Error prefilling checkout:', e);
        }
      }
    }
  }, [checkoutOpen]);

  if (!checkoutOpen) return null;

  const shippingCost = cartTotal >= 499 ? 0 : 50;
  const grandTotal = cartTotal + shippingCost;

  const handleChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  // Step 1: Submit Order & Create Intent on Backend
  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (!shippingInfo.name || !shippingInfo.email || !shippingInfo.phone || !shippingInfo.address || !shippingInfo.city || !shippingInfo.pincode) {
      alert('Please fill in all delivery details.');
      return;
    }

    setErrorMessage('');

    // If card payment is selected, transition to card entry inputs first
    if (shippingInfo.paymentMethod === 'card' && status === 'idle') {
      setStatus('card-entry');
      return;
    }

    await processPaymentAndOrder();
  };

  // Step 2: Call backend API to create intent, authorize payment, and save to MongoDB
  const processPaymentAndOrder = async () => {
    setStatus('loading');
    
    // Get optional logged-in userId
    let loggedInUserId = undefined;
    try {
      const savedUserStr = localStorage.getItem('seedink_user_data');
      if (savedUserStr) {
        const u = JSON.parse(savedUserStr);
        loggedInUserId = u.id;
      }
    } catch (e) {}
    
    const payload = {
      userId: loggedInUserId,
      name: shippingInfo.name,
      email: shippingInfo.email,
      phone: shippingInfo.phone,
      address: shippingInfo.address,
      city: shippingInfo.city,
      pincode: shippingInfo.pincode,
      items: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        size: item.size,
        quantity: item.quantity,
        price: item.price,
        customLetter: item.customLetter
      })),
      subtotal: cartTotal,
      shippingCost: shippingCost,
      grandTotal: grandTotal,
      paymentMethod: shippingInfo.paymentMethod
    };

    try {
      // Create Payment Intent and Pending Order in Database
      const res = await fetch(`${API_BASE}/payments/create-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const orderData = await res.json();
      if (!res.ok) {
        throw new Error(orderData.message || 'Error creating order.');
      }

      setOrderId(orderData.orderId);
      setClientSecret(orderData.clientSecret);

      // If it is a card payment, simulate Stripe verification
      if (shippingInfo.paymentMethod === 'card' && orderData.clientSecret) {
        // Simulating the Stripe browser client authorizing payment
        setTimeout(async () => {
          try {
            // Send confirmation check to backend API to mark as Paid
            const confirmRes = await fetch(`${API_BASE}/payments/confirm`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId: orderData.orderId,
                paymentIntentId: 'pi_' + Math.random().toString(36).substring(2, 12)
              })
            });

            if (confirmRes.ok) {
              setStatus('success');
              clearCart();
            } else {
              throw new Error('Payment confirmation failed.');
            }
          } catch (err) {
            setErrorMessage('Stripe Payment Verification Failed.');
            setStatus('card-entry');
          }
        }, 2000);
      } else {
        // If COD or UPI, orders are recorded instantly in MongoDB
        setTimeout(() => {
          setStatus('success');
          clearCart();
        }, 1500);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Network error occurred during checkout.');
      setStatus('idle');
    }
  };

  return (
    <div className="modal-overlay animate-fade-in">
      <div className="modal-content" style={{ maxWidth: '650px' }}>
        <button 
          className="modal-close-btn" 
          onClick={() => {
            setCheckoutOpen(false);
            setStatus('idle');
          }}
          aria-label="Close checkout"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="checkout-modal-layout">
          {errorMessage && (
            <p style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '16px', fontWeight: 'bold', textAlign: 'center' }}>
              {errorMessage}
            </p>
          )}

          {/* STATE: INPUT FORM */}
          {status === 'idle' && (
            <>
              <h2 className="initial-title" style={{ fontSize: '1.6rem', marginBottom: '20px' }}>
                Secure Checkout
              </h2>
              
              <div className="checkout-grid">
                {/* Delivery Form */}
                <form onSubmit={handleCheckoutSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <h3 className="footer-heading" style={{ color: 'var(--color-dark)', fontSize: '0.85rem' }}>
                    Shipping Address
                  </h3>
                  
                  <input 
                    type="text" 
                    name="name" 
                    placeholder="Full Name" 
                    className="form-input"
                    value={shippingInfo.name} 
                    onChange={handleChange} 
                    required 
                  />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <input 
                      type="email" 
                      name="email" 
                      placeholder="Email Address" 
                      className="form-input"
                      value={shippingInfo.email} 
                      onChange={handleChange} 
                      required 
                    />
                    <input 
                      type="tel" 
                      name="phone" 
                      placeholder="Phone Number" 
                      className="form-input"
                      value={shippingInfo.phone} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                  <input 
                    type="text" 
                    name="address" 
                    placeholder="Street Address, Flat, Apartment" 
                    className="form-input"
                    value={shippingInfo.address} 
                    onChange={handleChange} 
                    required 
                  />
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10px' }}>
                    <input 
                      type="text" 
                      name="city" 
                      placeholder="City" 
                      className="form-input"
                      value={shippingInfo.city} 
                      onChange={handleChange} 
                      required 
                    />
                    <input 
                      type="text" 
                      name="pincode" 
                      placeholder="PIN Code" 
                      className="form-input"
                      value={shippingInfo.pincode} 
                      onChange={handleChange} 
                      maxLength="6"
                      required 
                    />
                  </div>

                  <h3 className="footer-heading" style={{ color: 'var(--color-dark)', fontSize: '0.85rem', marginTop: '10px' }}>
                    Payment Mode
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', cursor: 'pointer' }}>
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        value="cod" 
                        checked={shippingInfo.paymentMethod === 'cod'} 
                        onChange={handleChange} 
                      />
                      Cash on Delivery (COD)
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', cursor: 'pointer' }}>
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        value="card" 
                        checked={shippingInfo.paymentMethod === 'card'} 
                        onChange={handleChange} 
                      />
                      Credit/Debit Card (via Stripe Gateway)
                    </label>
                  </div>

                  <button type="submit" className="submit-btn" style={{ marginTop: '16px' }}>
                    Continue to Payment
                  </button>
                </form>

                {/* Summary Panel */}
                <div>
                  <h3 className="footer-heading" style={{ color: 'var(--color-dark)', fontSize: '0.85rem', marginBottom: '12px' }}>
                    Order Summary
                  </h3>
                  <div className="checkout-items-summary">
                    {cartItems.map((item) => (
                      <div className="checkout-item-mini" key={item.key}>
                        <img src={item.image} alt={item.name} className="checkout-item-mini-img" />
                        <div className="checkout-item-mini-details">
                          <p style={{ fontWeight: 'bold' }}>{item.name} {item.customLetter && `(${item.customLetter})`}</p>
                          <p style={{ color: '#71717a', fontSize: '0.75rem' }}>Qty: {item.quantity} • {item.size}</p>
                        </div>
                        <span style={{ fontWeight: 'bold' }}>₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                  <div className="checkout-totals-block" style={{ marginTop: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Subtotal</span>
                      <span style={{ marginLeft: 'auto' }}>₹{cartTotal}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Shipping Fee</span>
                      <span style={{ marginLeft: 'auto' }}>{shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1rem', borderTop: '1px dashed var(--color-border)', paddingTop: '10px', marginTop: '4px' }}>
                      <span>Grand Total</span>
                      <span style={{ marginLeft: 'auto' }}>₹{grandTotal}</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* STATE: CARD PAYMENT GATEWAY ENTRY */}
          {status === 'card-entry' && (
            <div className="animate-fade-in" style={{ maxWidth: '400px', margin: '0 auto', padding: '20px 0' }}>
              <h2 className="initial-title" style={{ fontSize: '1.4rem', marginBottom: '10px', textAlign: 'center' }}>
                Stripe Card Gateway
              </h2>
              <p style={{ fontSize: '0.85rem', color: '#71717a', textAlign: 'center', marginBottom: '24px' }}>
                Secure payment verification in progress. Enter credit card credentials:
              </p>

              <form onSubmit={(e) => { e.preventDefault(); processPaymentAndOrder(); }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Card Number</label>
                  <input 
                    type="text" 
                    name="cardNumber"
                    placeholder="4242 • 4242 • 4242 • 4242" 
                    className="form-input"
                    value={shippingInfo.cardNumber}
                    onChange={handleChange}
                    maxLength="19"
                    required
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '10px' }}>
                  <div className="form-group">
                    <label className="form-label">Expiration Date</label>
                    <input 
                      type="text" 
                      name="cardExpiry"
                      placeholder="MM / YY" 
                      className="form-input"
                      value={shippingInfo.cardExpiry}
                      onChange={handleChange}
                      maxLength="7"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">CVC</label>
                    <input 
                      type="password" 
                      name="cardCvc"
                      placeholder="•••" 
                      className="form-input"
                      value={shippingInfo.cardCvc}
                      onChange={handleChange}
                      maxLength="3"
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="submit-btn" style={{ marginTop: '12px' }}>
                  Pay ₹{grandTotal} Now
                </button>
                <button 
                  type="button" 
                  className="submit-btn"
                  style={{ background: 'transparent', color: '#71717a', border: '1px solid var(--color-border)' }}
                  onClick={() => setStatus('idle')}
                >
                  Cancel
                </button>
              </form>
            </div>
          )}

          {/* STATE: PAYMENT PROCESSING LOADER */}
          {status === 'loading' && (
            <div style={{ textAlign: 'center', padding: '60px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
              <div className="cir-loader" style={{ borderLeftColor: 'var(--color-dark)', width: '50px', height: '50px', display: 'block' }}></div>
              <h3 style={{ fontSize: '1.4rem' }}>Connecting to Payment Gateway...</h3>
              <p style={{ color: '#71717a' }}>Please do not close this window or refresh the page.</p>
            </div>
          )}

          {/* STATE: ORDER PLACEMENT SUCCESS */}
          {status === 'success' && (
            <div style={{ textAlign: 'center', padding: '40px 20px' }} className="animate-fade-in">
              <span style={{ fontSize: '4.5rem' }}>🎉</span>
              <h3 style={{ fontSize: '1.8rem', margin: '16px 0 8px 0', fontWeight: '800' }}>
                Order Confirmed!
              </h3>
              <p style={{ fontSize: '1.05rem', fontWeight: 'bold', color: '#10b981', marginBottom: '12px' }}>
                Order ID: {orderId}
              </p>
              <p style={{ color: '#71717a', fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto 24px auto' }}>
                Thank you for shopping with SEEDINK! Your plant-based, semi-permanent tattoos will arrive within 3-5 business days. A tracking link has been sent to <strong>{shippingInfo.email}</strong>.
              </p>
              <button 
                className="submit-btn" 
                style={{ maxWidth: '250px' }} 
                onClick={() => {
                  setCheckoutOpen(false);
                  setStatus('idle');
                }}
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

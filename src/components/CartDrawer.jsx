import React from 'react';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const { 
    cartItems, 
    isCartOpen, 
    setCartOpen, 
    setCheckoutOpen, 
    updateQuantity, 
    removeFromCart, 
    cartTotal 
  } = useCart();

  return (
    <>
      {/* Overlay Backdrop */}
      <div 
        className={`cart-overlay ${isCartOpen ? 'open' : ''}`} 
        onClick={() => setCartOpen(false)}
      />

      {/* Drawer Panel */}
      <div className={`cart-drawer ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h2 className="cart-title">Your Cart</h2>
          <button 
            className="cart-close-btn" 
            onClick={() => setCartOpen(false)}
            aria-label="Close cart"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="cart-items-list">
          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <span className="cart-empty-icon">🛒</span>
              <p>Your cart is empty.</p>
              <button 
                className="checkout-btn" 
                style={{ marginTop: '12px', fontSize: '0.85rem', padding: '12px' }}
                onClick={() => setCartOpen(false)}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div className="cart-item animate-fade-in" key={item.key}>
                <img src={item.image} alt={item.name} className="cart-item-img" />
                <div className="cart-item-details">
                  <h3 className="cart-item-name">
                    {item.name} {item.customLetter && `(${item.customLetter})`}
                  </h3>
                  <p className="cart-item-meta">Size: {item.size}</p>
                  
                  <div className="cart-item-qty-row">
                    <div className="qty-selector">
                      <button 
                        className="qty-btn" 
                        onClick={() => updateQuantity(item.key, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span className="qty-val">{item.quantity}</span>
                      <button 
                        className="qty-btn" 
                        onClick={() => updateQuantity(item.key, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <span className="cart-item-price">₹{item.price * item.quantity}</span>
                  </div>

                  <button 
                    className="cart-item-remove" 
                    onClick={() => removeFromCart(item.key)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer animate-fade-in">
            <div className="cart-subtotal-row">
              <span>Subtotal</span>
              <span>₹{cartTotal}</span>
            </div>
            <p className="cart-terms">
              Shipping & taxes calculated at checkout.
            </p>
            <button 
              className="checkout-btn"
              onClick={() => {
                setCartOpen(false);
                setCheckoutOpen(true);
              }}
            >
              Proceed To Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}

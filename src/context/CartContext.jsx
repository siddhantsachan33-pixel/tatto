import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();
const API_BASE = 'http://localhost:5000/api';

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('inkup_cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Error loading cart data', e);
      }
    }
  }, []);

  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('inkup_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1, customLetter = null) => {
    setCartItems((prevItems) => {
      // Unique key: product id + custom letter (if any)
      const itemKey = customLetter ? `${product.id}-${customLetter}` : product.id;
      const existingItem = prevItems.find((item) => item.key === itemKey);

      if (existingItem) {
        return prevItems.map((item) =>
          item.key === itemKey ? { ...item, quantity: item.quantity + quantity } : item
        );
      }

      return [
        ...prevItems,
        {
          key: itemKey,
          id: product.id || product._id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.image1 || product.image,
          size: product.size || '3 x 3 inches',
          customLetter: customLetter,
          quantity: quantity
        }
      ];
    });
    setCartOpen(true); // Automatically open cart drawer on add
  };

  const removeFromCart = (key) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.key !== key));
  };

  const updateQuantity = (key, quantity) => {
    if (quantity <= 0) {
      removeFromCart(key);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) => (item.key === key ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        setCartOpen,
        checkoutOpen,
        setCheckoutOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        API_BASE
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

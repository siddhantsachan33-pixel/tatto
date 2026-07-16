import express from 'express';
import Stripe from 'stripe';
import Order from '../models/Order.js';
import { checkAdmin } from './api.js';

const router = express.Router();

// Helper to sanitize customer inputs
const sanitizeString = (str) => typeof str === 'string' ? str.replace(/[$/{}]/g, '') : '';

// Create a new Stripe Payment Intent & Order record
router.post('/create-intent', async (req, res) => {
  const { name, email, phone, address, city, pincode, items, subtotal, shippingCost, grandTotal, paymentMethod } = req.body;
  
  if (!name || !email || !items || !items.length) {
    return res.status(400).json({ message: 'Missing order details' });
  }

  const orderId = 'SED-' + Math.floor(Math.random() * 900000 + 100000);

  try {
    let clientSecret = '';
    let paymentIntentId = '';

    // If card payment is selected, interface with Stripe API
    if (paymentMethod === 'card' && process.env.STRIPE_SECRET_KEY) {
      const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
      
      const paymentIntent = await stripeInstance.paymentIntents.create({
        amount: Math.round(grandTotal * 100), // Stripe expects amounts in cents
        currency: 'inr',
        metadata: { orderId, customerName: name, customerEmail: email },
        receipt_email: email,
      });

      clientSecret = paymentIntent.client_secret;
      paymentIntentId = paymentIntent.id;
    }

    // Save order details to MongoDB with a Pending state
    const order = new Order({
      orderId,
      name: sanitizeString(name),
      email: sanitizeString(email),
      phone: sanitizeString(phone),
      address: sanitizeString(address),
      city: sanitizeString(city),
      pincode: sanitizeString(pincode),
      items: items.map(item => ({
        id: sanitizeString(item.id),
        name: sanitizeString(item.name),
        size: sanitizeString(item.size),
        quantity: Number(item.quantity),
        price: Number(item.price),
        customLetter: item.customLetter ? sanitizeString(item.customLetter) : undefined
      })),
      subtotal: Number(subtotal),
      shippingCost: Number(shippingCost),
      grandTotal: Number(grandTotal),
      paymentMethod: sanitizeString(paymentMethod),
      paymentIntentId,
      paymentStatus: 'Pending'
    });

    await order.save();

    res.status(201).json({
      orderId,
      clientSecret,
      grandTotal
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Confirm payment and mark order as Paid
router.post('/confirm', async (req, res) => {
  const { orderId, paymentIntentId } = req.body;

  if (!orderId) {
    return res.status(400).json({ message: 'OrderId is required' });
  }

  try {
    const order = await Order.findOne({ orderId: sanitizeString(orderId) });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.paymentStatus = 'Paid';
    if (paymentIntentId) {
      order.paymentIntentId = sanitizeString(paymentIntentId);
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all orders/payments (Admin only - using secure checkAdmin import)
router.get('/', checkAdmin, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;

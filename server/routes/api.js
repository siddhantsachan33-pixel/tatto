import express from 'express';
import crypto from 'crypto';
import Product from '../models/Product.js';
import Testimonial from '../models/Testimonial.js';
import Inquiry from '../models/Inquiry.js';

const router = express.Router();

// Active administrative sessions store
const activeSessions = new Map();

// Helper to validate and clean incoming requests (prevent injection)
const sanitizeString = (str) => typeof str === 'string' ? str.replace(/[$/{}]/g, '') : '';

// Middleware to verify session tokens securely
export const checkAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization header missing or invalid' });
  }

  const token = authHeader.split(' ')[1];
  const session = activeSessions.get(token);

  if (!session) {
    return res.status(401).json({ message: 'Session expired or invalid' });
  }

  // Check if session has expired (e.g. 2 hours limit)
  if (Date.now() - session.createdAt > 2 * 60 * 60 * 1000) {
    activeSessions.delete(token);
    return res.status(401).json({ message: 'Session expired' });
  }

  // Session valid - proceed
  next();
};

/* ==========================================
   AUTH ROUTES
   ========================================== */

// Admin secure login using SHA-256 password hashing
router.post('/auth/login', (req, res) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ message: 'Password is required' });
  }

  const configuredPassword = process.env.ADMIN_PASSWORD || 'admin123';

  // Compare using timing-safe comparison to prevent side-channel attacks
  const inputHash = crypto.createHash('sha256').update(password).digest('hex');
  const targetHash = crypto.createHash('sha256').update(configuredPassword).digest('hex');

  const inputBuffer = Buffer.from(inputHash, 'utf-8');
  const targetBuffer = Buffer.from(targetHash, 'utf-8');

  if (inputBuffer.length === targetBuffer.length && crypto.timingSafeEqual(inputBuffer, targetBuffer)) {
    // Generate secure session token
    const sessionToken = crypto.randomBytes(32).toString('hex');
    activeSessions.set(sessionToken, {
      createdAt: Date.now()
    });
    
    return res.json({ token: sessionToken });
  }

  return res.status(401).json({ message: 'Invalid admin password' });
});

// Admin secure logout
router.post('/auth/logout', (req, res) => {
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    activeSessions.delete(token);
  }
  res.json({ message: 'Logged out successfully' });
});

/* ==========================================
   PRODUCTS ROUTES
   ========================================== */

// Get all products
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create product (Admin)
router.post('/products', checkAdmin, async (req, res) => {
  const { name, category, price, originalPrice, size, description, image1, image2, isBestseller, isNew } = req.body;
  
  if (!name || !category || !price || !description || !image1 || !image2) {
    return res.status(400).json({ message: 'Required fields are missing' });
  }

  const product = new Product({
    name: sanitizeString(name),
    category: sanitizeString(category),
    price: Number(price),
    originalPrice: originalPrice ? Number(originalPrice) : undefined,
    size: sanitizeString(size),
    description: sanitizeString(description),
    image1: image1,
    image2: image2,
    isBestseller: Boolean(isBestseller),
    isNew: Boolean(isNew)
  });

  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update product (Admin)
router.put('/products/:id', checkAdmin, async (req, res) => {
  try {
    // Sanitize updates if present
    const updates = { ...req.body };
    if (updates.name) updates.name = sanitizeString(updates.name);
    if (updates.category) updates.category = sanitizeString(updates.category);
    if (updates.size) updates.size = sanitizeString(updates.size);
    if (updates.description) updates.description = sanitizeString(updates.description);

    const updated = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!updated) return res.status(404).json({ message: 'Product not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete product (Admin)
router.delete('/products/:id', checkAdmin, async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ==========================================
   TESTIMONIALS ROUTES
   ========================================== */

router.get('/testimonials', async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/testimonials', async (req, res) => {
  const { name, stars, text, verified } = req.body;
  
  if (!name || !text) {
    return res.status(400).json({ message: 'Author name and review text are required' });
  }

  const testimonial = new Testimonial({
    name: sanitizeString(name),
    stars: sanitizeString(stars),
    text: sanitizeString(text),
    verified: Boolean(verified)
  });

  try {
    const newTestimonial = await testimonial.save();
    res.status(201).json(newTestimonial);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/testimonials/:id', checkAdmin, async (req, res) => {
  try {
    const deleted = await Testimonial.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Testimonial not found' });
    res.json({ message: 'Testimonial deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ==========================================
   INQUIRIES ROUTES
   ========================================== */

router.get('/inquiries', checkAdmin, async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/inquiries', async (req, res) => {
  const { name, email, quantity, details } = req.body;
  
  if (!name || !email || !details) {
    return res.status(400).json({ message: 'Name, email, and details are required' });
  }

  const inquiry = new Inquiry({
    name: sanitizeString(name),
    email: sanitizeString(email),
    quantity: sanitizeString(quantity),
    details: sanitizeString(details)
  });

  try {
    const newInquiry = await inquiry.save();
    res.status(201).json(newInquiry);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;

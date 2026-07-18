import express from 'express';
import crypto from 'crypto';
import Product from '../models/Product.js';
import Testimonial from '../models/Testimonial.js';
import Inquiry from '../models/Inquiry.js';
import User from '../models/User.js';
import Lead from '../models/Lead.js';
import Order from '../models/Order.js';

const router = express.Router();

// ── STATELESS HMAC TOKEN HELPERS ─────────────────────────────────────────────
// Tokens are self-validating (signed with a secret key).
// No server-side Map storage = sessions survive Render restarts/sleep cycles.

const TOKEN_SECRET = process.env.ADMIN_TOKEN_SECRET || process.env.ADMIN_PASSWORD || 'seedink_secret_2026';
const TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

function signAdminToken(payload) {
  const data = JSON.stringify(payload);
  const encoded = Buffer.from(data).toString('base64url');
  const sig = crypto.createHmac('sha256', TOKEN_SECRET).update(encoded).digest('base64url');
  return `${encoded}.${sig}`;
}

function verifyAdminToken(token) {
  try {
    const [encoded, sig] = token.split('.');
    if (!encoded || !sig) return null;
    const expectedSig = crypto.createHmac('sha256', TOKEN_SECRET).update(encoded).digest('base64url');
    const sigBuf = Buffer.from(sig, 'base64url');
    const expBuf = Buffer.from(expectedSig, 'base64url');
    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) return null;
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString());
    if (Date.now() > payload.exp) return null; // expired
    return payload;
  } catch {
    return null;
  }
}

// Helper to validate and clean incoming requests (prevent injection)
const sanitizeString = (str) => typeof str === 'string' ? str.replace(/[$/{}]/g, '') : '';

// In-memory user session store (customers only; these are short-lived)
const activeUserSessions = new Map();

// Middleware to verify customer session tokens
export const checkUser = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization header missing or invalid' });
  }
  const token = authHeader.split(' ')[1];
  const session = activeUserSessions.get(token);
  if (!session) {
    return res.status(401).json({ message: 'Session expired or invalid' });
  }
  req.userId = session.userId;
  next();
};

// Middleware to verify ADMIN tokens (stateless HMAC - survives restarts)
export const checkAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization header missing or invalid' });
  }
  const token = authHeader.split(' ')[1];
  const payload = verifyAdminToken(token);
  if (!payload) {
    return res.status(401).json({ message: 'Admin session expired or invalid. Please log in again.' });
  }
  next();
};

/* ==========================================
   AUTH ROUTES
   ========================================== */

// Admin login — returns a stateless HMAC-signed token valid for 30 days
router.post('/auth/login', (req, res) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ message: 'Password is required' });
  }

  const configuredPassword = process.env.ADMIN_PASSWORD || 'admin123';

  const inputHash = crypto.createHash('sha256').update(password).digest('hex');
  const targetHash = crypto.createHash('sha256').update(configuredPassword).digest('hex');
  const inputBuffer = Buffer.from(inputHash, 'utf-8');
  const targetBuffer = Buffer.from(targetHash, 'utf-8');

  if (inputBuffer.length === targetBuffer.length && crypto.timingSafeEqual(inputBuffer, targetBuffer)) {
    const token = signAdminToken({ role: 'admin', iat: Date.now(), exp: Date.now() + TOKEN_TTL_MS });
    return res.json({ token });
  }

  return res.status(401).json({ message: 'Invalid admin password' });
});

// Admin logout (client just discards the token; nothing to delete server-side)
router.post('/auth/logout', (req, res) => {
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
  const { 
    name, category, price, originalPrice, size, description, image1, image2, 
    isBestseller, isNew, placementArm, placementChest, placementBack, placementNeck, placementHand 
  } = req.body;
  
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
    isNew: Boolean(isNew),
    placementArm: placementArm ? String(placementArm) : '',
    placementChest: placementChest ? String(placementChest) : '',
    placementBack: placementBack ? String(placementBack) : '',
    placementNeck: placementNeck ? String(placementNeck) : '',
    placementHand: placementHand ? String(placementHand) : ''
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

});

/* ==========================================
   CUSTOMER AUTHENTICATION ROUTES
   ========================================== */

// Customer Registration
router.post('/auth/user/register', async (req, res) => {
  const { name, email, password, phone, address, city, pincode } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  try {
    const existing = await User.findOne({ email: sanitizeString(email.toLowerCase()) });
    if (existing) {
      return res.status(400).json({ message: 'Account with this email already exists' });
    }

    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
    const user = new User({
      name: sanitizeString(name),
      email: sanitizeString(email.toLowerCase()),
      password: hashedPassword,
      phone: phone ? sanitizeString(phone) : '',
      address: address ? sanitizeString(address) : '',
      city: city ? sanitizeString(city) : '',
      pincode: pincode ? sanitizeString(pincode) : ''
    });

    const newUser = await user.save();
    
    // Generate secure session token
    const sessionToken = crypto.randomBytes(32).toString('hex');
    activeUserSessions.set(sessionToken, {
      userId: newUser._id,
      createdAt: Date.now()
    });

    res.status(201).json({
      token: sessionToken,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        address: newUser.address,
        city: newUser.city,
        pincode: newUser.pincode
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Customer Login
router.post('/auth/user/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email: sanitizeString(email.toLowerCase()) });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
    if (user.password !== hashedPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate secure session token
    const sessionToken = crypto.randomBytes(32).toString('hex');
    activeUserSessions.set(sessionToken, {
      userId: user._id,
      createdAt: Date.now()
    });

    res.json({
      token: sessionToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        city: user.city,
        pincode: user.pincode
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Customer Profile
router.get('/auth/user/profile', checkUser, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      city: user.city,
      pincode: user.pincode
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update Customer Profile
router.put('/auth/user/profile', checkUser, async (req, res) => {
  const { phone, address, city, pincode } = req.body;
  try {
    const updates = {};
    if (phone !== undefined) updates.phone = sanitizeString(phone);
    if (address !== undefined) updates.address = sanitizeString(address);
    if (city !== undefined) updates.city = sanitizeString(city);
    if (pincode !== undefined) updates.pincode = sanitizeString(pincode);

    const user = await User.findByIdAndUpdate(req.userId, updates, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      city: user.city,
      pincode: user.pincode
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Customer Orders List
router.get('/auth/user/orders', checkUser, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ==========================================
   CHATBOT LEADS ROUTES
   ========================================== */

// Create a new lead from Chatbot
router.post('/leads', async (req, res) => {
  const { name, email, phone, tattooIdea, size, placement, chatHistory } = req.body;
  if (!tattooIdea) {
    return res.status(400).json({ message: 'Tattoo idea is required to capture lead.' });
  }

  try {
    const lead = new Lead({
      name: name ? sanitizeString(name) : 'Anonymous',
      email: email ? sanitizeString(email) : '',
      phone: phone ? sanitizeString(phone) : '',
      tattooIdea: sanitizeString(tattooIdea),
      size: size ? sanitizeString(size) : '',
      placement: placement ? sanitizeString(placement) : '',
      chatHistory: chatHistory || []
    });

    const newLead = await lead.save();
    res.status(201).json(newLead);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all leads (Admin)
router.get('/leads', checkAdmin, async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ==========================================
   ADMIN ORDERS / COD MANAGEMENT ROUTES
   ========================================== */

// Update Order Status & Shipping details (Admin)
router.put('/orders/:id/status', checkAdmin, async (req, res) => {
  const { orderStatus, paymentStatus, trackingId, carrier } = req.body;
  try {
    const updates = {};
    if (orderStatus) updates.orderStatus = sanitizeString(orderStatus);
    if (paymentStatus) updates.paymentStatus = sanitizeString(paymentStatus);
    if (trackingId !== undefined) updates.trackingId = sanitizeString(trackingId);
    if (carrier !== undefined) updates.carrier = sanitizeString(carrier);

    const updated = await Order.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!updated) return res.status(404).json({ message: 'Order not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;

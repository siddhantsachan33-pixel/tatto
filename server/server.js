import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.js';
import paymentRoutes from './routes/payments.js';

// Load environmental variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', apiRoutes);
app.use('/api/payments', paymentRoutes);

// Health check endpoint (used by Cloudflare keep-alive waker)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Database Seed Helper
import Product from './models/Product.js';
import Testimonial from './models/Testimonial.js';

const seedInitialData = async () => {
  try {
    const productsCount = await Product.countDocuments();
    if (productsCount === 0) {
      console.log('Database empty. Seeding initial products...');
      const defaultProducts = [
        {
          name: 'Mandala Harmony',
          category: 'spiritual',
          price: 349,
          originalPrice: 599,
          rating: 4.9,
          reviewsCount: 142,
          image1: 'https://images.unsplash.com/photo-1550537687-c91072c4792d?auto=format&fit=crop&q=80&w=600',
          image2: 'https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&q=80&w=600',
          size: '3 x 3 inches',
          description: 'A beautiful mandala design representing inner peace, unity, and balance. Perfect for wrists, forearms, or ankles.',
          isBestseller: true,
          isNew: false
        },
        {
          name: 'Dagger & Rose',
          category: 'gothic',
          price: 399,
          originalPrice: 699,
          rating: 4.8,
          reviewsCount: 96,
          image1: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&q=80&w=600',
          image2: 'https://images.unsplash.com/photo-1550537687-c91072c4792d?auto=format&fit=crop&q=80&w=600',
          size: '4 x 2.5 inches',
          description: 'An intricate gothic dagger entwined with a soft rose, symbolizing power, vulnerability, and resilience.',
          isBestseller: true,
          isNew: true
        },
        {
          name: 'Amour (Script Lettering)',
          category: 'typography',
          price: 249,
          originalPrice: 449,
          rating: 4.7,
          reviewsCount: 78,
          image1: 'https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&q=80&w=600',
          image2: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=600',
          size: '2 x 1 inches',
          description: 'Elegant French script tattoo reading "Amour" (Love). Minimalist, subtle, and incredibly chic.',
          isBestseller: false,
          isNew: false
        },
        {
          name: 'Nine-Tails Sigil',
          category: 'anime',
          price: 379,
          originalPrice: 599,
          rating: 4.9,
          reviewsCount: 188,
          image1: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=600',
          image2: 'https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&q=80&w=600',
          size: '3.5 x 3.5 inches',
          description: 'The iconic spiral seal of the Nine-Tailed Fox. Must-have body art for true anime fans.',
          isBestseller: true,
          isNew: false
        },
        {
          name: 'Constellation Stars',
          category: 'minimalist',
          price: 279,
          originalPrice: 499,
          rating: 4.9,
          reviewsCount: 215,
          image1: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=600',
          image2: 'https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&q=80&w=600',
          size: '2.5 x 1.5 inches',
          description: 'A cluster of fine line stars and sparkles to adorn your collarbone or wrist.',
          isBestseller: true,
          isNew: false
        },
        {
          name: 'Viper Strike',
          category: 'gothic',
          price: 349,
          originalPrice: 599,
          rating: 4.8,
          reviewsCount: 112,
          image1: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&q=80&w=600',
          image2: 'https://images.unsplash.com/photo-1550537687-c91072c4792d?auto=format&fit=crop&q=80&w=600',
          size: '4 x 2 inches',
          description: 'A sleek, coiled viper ready to strike. Bold black ink styling with sharp, dramatic detailing.',
          isBestseller: false,
          isNew: true
        }
      ];
      await Product.insertMany(defaultProducts);
      console.log('Products seeded successfully.');
    }

    const testimonialsCount = await Testimonial.countDocuments();
    if (testimonialsCount === 0) {
      console.log('Database empty. Seeding initial testimonials...');
      const defaultTestimonials = [
        {
          name: 'Ananya Roy',
          stars: '★★★★★',
          text: 'Literally looks so real! I got the Mandala Harmony and people keep asking me where I got it inked. Developing takes a day, but once it turns dark, it is perfect.',
          verified: true
        },
        {
          name: 'Rohit Sharma',
          stars: '★★★★★',
          text: 'I wanted to see if I liked a tattoo on my forearm before committing. This was a lifesaver. Kept it for 12 days, showered every day, and it did not fade. Highly recommend!',
          verified: true
        },
        {
          name: 'Meera Kapoor',
          stars: '★★★★★',
          text: 'Absolutely obsessed with the Custom Initial Heart Selector. Choose your letter and get it. Applies in 10 minutes. Will buy again!',
          verified: true
        }
      ];
      await Testimonial.insertMany(defaultTestimonials);
      console.log('Testimonials seeded successfully.');
    }
  } catch (err) {
    console.error('Error seeding data:', err);
  }
};

// Database Connection
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/seedink';
mongoose.connect(mongoURI)
  .then(() => {
    console.log('MongoDB connection established successfully.');
    seedInitialData();
    app.listen(PORT, () => {
      console.log(`Backend server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection failed:', err.message);
  });

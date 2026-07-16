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
    // Delete existing products to force database update with new tattoo-only images and Shiva collection
    await Product.deleteMany({});
    console.log('Cleared existing products for database refresh.');

    const defaultProducts = [
      {
        name: 'Mandala Harmony',
        category: 'spiritual',
        price: 349,
        originalPrice: 599,
        rating: 4.9,
        reviewsCount: 142,
        image1: 'https://images.unsplash.com/photo-1508186227448-7a6cf6f6572e?auto=format&fit=crop&q=80&w=600',
        image2: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=600',
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
        image1: 'https://images.unsplash.com/photo-1594385208974-2e75f9d8ab48?auto=format&fit=crop&q=80&w=600',
        image2: 'https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?auto=format&fit=crop&q=80&w=600',
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
        image1: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&q=80&w=600',
        image2: 'https://images.unsplash.com/photo-1581898716766-3d748f3227eb?auto=format&fit=crop&q=80&w=600',
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
        image1: 'https://images.unsplash.com/photo-1560707303-4e980c87f8af?auto=format&fit=crop&q=80&w=600',
        image2: 'https://images.unsplash.com/photo-1512413313760-441fc5042d15?auto=format&fit=crop&q=80&w=600',
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
        image1: 'https://images.unsplash.com/photo-1533158326339-7f3cf2404354?auto=format&fit=crop&q=80&w=600',
        image2: 'https://images.unsplash.com/photo-1611601679655-7c8bc197f0c6?auto=format&fit=crop&q=80&w=600',
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
        image1: 'https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?auto=format&fit=crop&q=80&w=600',
        image2: 'https://images.unsplash.com/photo-1594385208974-2e75f9d8ab48?auto=format&fit=crop&q=80&w=600',
        size: '4 x 2 inches',
        description: 'A sleek, coiled viper ready to strike. Bold black ink styling with sharp, dramatic detailing.',
        isBestseller: false,
        isNew: true
      },
      {
        name: 'Cosmic Unalome',
        category: 'spiritual',
        price: 299,
        originalPrice: 499,
        rating: 4.8,
        reviewsCount: 65,
        image1: 'https://images.unsplash.com/photo-1512413313760-441fc5042d15?auto=format&fit=crop&q=80&w=600',
        image2: 'https://images.unsplash.com/photo-1508186227448-7a6cf6f6572e?auto=format&fit=crop&q=80&w=600',
        size: '3 x 1.5 inches',
        description: 'The Unalome symbol representing the path to enlightenment, crowned with a crescent moon and stars.',
        isBestseller: false,
        isNew: false
      },
      {
        name: 'Wildflower (Script)',
        category: 'typography',
        price: 249,
        originalPrice: 449,
        rating: 4.6,
        reviewsCount: 43,
        image1: 'https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&q=80&w=600',
        image2: 'https://images.unsplash.com/photo-1542727313-4f3e99aa2568?auto=format&fit=crop&q=80&w=600',
        size: '3 x 1 inches',
        description: 'Elegant script lettering reading "wildflower" with a tiny blooming flower stem at the end.',
        isBestseller: false,
        isNew: true
      },
      {
        name: 'Shiva Trishul',
        category: 'spiritual',
        price: 399,
        originalPrice: 699,
        rating: 4.9,
        reviewsCount: 234,
        image1: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=600',
        image2: 'https://images.unsplash.com/photo-1560707303-4e980c87f8af?auto=format&fit=crop&q=80&w=600',
        size: '4 x 2 inches',
        description: 'The sacred Trishul (Trident) of Lord Shiva with damaru drum and serpent coiled around it. Symbol of destruction of evil and cosmic power.',
        isBestseller: true,
        isNew: true
      },
      {
        name: 'Nataraja Dance',
        category: 'spiritual',
        price: 449,
        originalPrice: 799,
        rating: 4.9,
        reviewsCount: 178,
        image1: 'https://images.unsplash.com/photo-1508186227448-7a6cf6f6572e?auto=format&fit=crop&q=80&w=600',
        image2: 'https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?auto=format&fit=crop&q=80&w=600',
        size: '5 x 4 inches',
        description: 'Lord Shiva as Nataraja performing the cosmic dance of creation and destruction. Intricate linework capturing divine energy and movement.',
        isBestseller: true,
        isNew: false
      },
      {
        name: "Shiva's Third Eye",
        category: 'spiritual',
        price: 329,
        originalPrice: 599,
        rating: 4.8,
        reviewsCount: 156,
        image1: 'https://images.unsplash.com/photo-1512413313760-441fc5042d15?auto=format&fit=crop&q=80&w=600',
        image2: 'https://images.unsplash.com/photo-1533158326339-7f3cf2404354?auto=format&fit=crop&q=80&w=600',
        size: '3 x 2 inches',
        description: "The all-seeing third eye of Mahadev with crescent moon and sacred Om symbol. Represents inner wisdom, enlightenment, and divine consciousness.",
        isBestseller: false,
        isNew: true
      },
      {
        name: 'Mahadev Tilak',
        category: 'spiritual',
        price: 279,
        originalPrice: 499,
        rating: 4.7,
        reviewsCount: 98,
        image1: 'https://images.unsplash.com/photo-1581898716766-3d748f3227eb?auto=format&fit=crop&q=80&w=600',
        image2: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&q=80&w=600',
        size: '2 x 1.5 inches',
        description: 'Sacred tripundra tilak lines with rudraksha beads and Om symbol. A minimalist tribute to Mahadev, perfect for forearms and wrists.',
        isBestseller: false,
        isNew: false
      }
    ];

    await Product.insertMany(defaultProducts);
    console.log('Products seeded successfully.');

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

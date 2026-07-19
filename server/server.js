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

// CORS — dynamically mirror request origin to allow all sites (localhost, CF pages, etc.)
app.use(cors({
  origin: (origin, callback) => {
    // Mirror the requesting origin dynamically so all domains can fetch & upload
    callback(null, true);
  },
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ limit: '15mb', extended: true }));

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
      // 1. Hinduism
      {
        name: "Shiva Tandava Trishul",
        category: "hinduism",
        price: 349,
        originalPrice: 499,
        size: "M — 4 x 2.5 in (10 x 6 cm)",
        description: "The powerful trident of Lord Shiva, adorned with a damaru drum and a coiled sacred cobra representing divine energy.",
        image1: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=600",
        image2: "https://images.unsplash.com/photo-1560707303-4e980c87f8af?auto=format&fit=crop&q=80&w=600",
        placementArm: "https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&q=80&w=600",
        placementChest: "https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&q=80&w=600",
        placementBack: "https://images.unsplash.com/photo-1542382156909-9ae37b3f56fd?auto=format&fit=crop&q=80&w=600",
        placementNeck: "https://images.unsplash.com/photo-1533158326339-7f3cf2404354?auto=format&fit=crop&q=80&w=600",
        placementHand: "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&q=80&w=600",
        isBestseller: true,
        isNew: true,
        rating: 4.9,
        reviewsCount: 245
      },
      {
        name: "Ganesha Vignaharta",
        category: "hinduism",
        price: 299,
        originalPrice: 399,
        size: "S — 2.5 x 2.5 in (6 x 6 cm)",
        description: "A minimalist silhouette of Lord Ganesha, the remover of obstacles, holding a sweet modak. Brings success and peace.",
        image1: "https://images.unsplash.com/photo-1508186227448-7a6cf6f6572e?auto=format&fit=crop&q=80&w=600",
        image2: "https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?auto=format&fit=crop&q=80&w=600",
        placementArm: "https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&q=80&w=600",
        placementChest: "https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&q=80&w=600",
        placementBack: "https://images.unsplash.com/photo-1542382156909-9ae37b3f56fd?auto=format&fit=crop&q=80&w=600",
        placementNeck: "https://images.unsplash.com/photo-1533158326339-7f3cf2404354?auto=format&fit=crop&q=80&w=600",
        placementHand: "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&q=80&w=600",
        isBestseller: false,
        isNew: false,
        rating: 4.8,
        reviewsCount: 130
      },
      {
        name: "Mahamrityunjaya Mantra",
        category: "hinduism",
        price: 399,
        originalPrice: 599,
        size: "L — 5 x 1.5 in (12 x 4 cm)",
        description: "The ultimate victory-over-death mantra written in classic calligraphic Devanagari Sanskrit lettering.",
        image1: "https://images.unsplash.com/photo-1594385208974-2e75f9d8ab48?auto=format&fit=crop&q=80&w=600",
        image2: "https://images.unsplash.com/photo-1512413313760-441fc5042d15?auto=format&fit=crop&q=80&w=600",
        placementArm: "https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&q=80&w=600",
        placementChest: "https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&q=80&w=600",
        placementBack: "https://images.unsplash.com/photo-1542382156909-9ae37b3f56fd?auto=format&fit=crop&q=80&w=600",
        placementNeck: "https://images.unsplash.com/photo-1533158326339-7f3cf2404354?auto=format&fit=crop&q=80&w=600",
        placementHand: "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&q=80&w=600",
        isBestseller: true,
        isNew: false,
        rating: 4.9,
        reviewsCount: 320
      },
      {
        name: "Radha Krishna Love",
        category: "hinduism",
        price: 329,
        originalPrice: 450,
        size: "M — 3.5 x 2 in (9 x 5 cm)",
        description: "The divine flute of Lord Krishna resting on a soft peacock feather, symbolizing infinite love and supreme devotion.",
        image1: "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&q=80&w=600",
        image2: "https://images.unsplash.com/photo-1581898716766-3d748f3227eb?auto=format&fit=crop&q=80&w=600",
        placementArm: "https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&q=80&w=600",
        placementChest: "https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&q=80&w=600",
        placementBack: "https://images.unsplash.com/photo-1542382156909-9ae37b3f56fd?auto=format&fit=crop&q=80&w=600",
        placementNeck: "https://images.unsplash.com/photo-1533158326339-7f3cf2404354?auto=format&fit=crop&q=80&w=600",
        placementHand: "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&q=80&w=600",
        isBestseller: false,
        isNew: true,
        rating: 4.7,
        reviewsCount: 88
      },
      // 2. Islam
      {
        name: "Calligraphic Shahada",
        category: "islam",
        price: 399,
        originalPrice: 599,
        size: "L — 4.5 x 2 in (11 x 5 cm)",
        description: "The Islamic declaration of faith written in beautiful Arabic Thuluth calligraphy, symbolizing divine light.",
        image1: "https://images.unsplash.com/photo-1508186227448-7a6cf6f6572e?auto=format&fit=crop&q=80&w=600",
        image2: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=600",
        placementArm: "https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&q=80&w=600",
        placementChest: "https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&q=80&w=600",
        placementBack: "https://images.unsplash.com/photo-1542382156909-9ae37b3f56fd?auto=format&fit=crop&q=80&w=600",
        placementNeck: "https://images.unsplash.com/photo-1533158326339-7f3cf2404354?auto=format&fit=crop&q=80&w=600",
        placementHand: "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&q=80&w=600",
        isBestseller: true,
        isNew: true,
        rating: 4.9,
        reviewsCount: 198
      },
      {
        name: "Crescent & Star Geometry",
        category: "islam",
        price: 299,
        originalPrice: 399,
        size: "S — 2 x 2 in (5 x 5 cm)",
        description: "A modern geometric crescent moon cradling a minimalist central star, representing spiritual guidance.",
        image1: "https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?auto=format&fit=crop&q=80&w=600",
        image2: "https://images.unsplash.com/photo-1594385208974-2e75f9d8ab48?auto=format&fit=crop&q=80&w=600",
        placementArm: "https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&q=80&w=600",
        placementChest: "https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&q=80&w=600",
        placementBack: "https://images.unsplash.com/photo-1542382156909-9ae37b3f56fd?auto=format&fit=crop&q=80&w=600",
        placementNeck: "https://images.unsplash.com/photo-1533158326339-7f3cf2404354?auto=format&fit=crop&q=80&w=600",
        placementHand: "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&q=80&w=600",
        isBestseller: false,
        isNew: false,
        rating: 4.8,
        reviewsCount: 140
      },
      {
        name: "Bismillah Calligraphy",
        category: "islam",
        price: 349,
        originalPrice: 499,
        size: "M — 3.5 x 1.5 in (9 x 4 cm)",
        description: "The opening holy verse 'In the name of Allah, the Beneficent, the Merciful' rendered in elegant Arabic cursive.",
        image1: "https://images.unsplash.com/photo-1512413313760-441fc5042d15?auto=format&fit=crop&q=80&w=600",
        image2: "https://images.unsplash.com/photo-1533158326339-7f3cf2404354?auto=format&fit=crop&q=80&w=600",
        placementArm: "https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&q=80&w=600",
        placementChest: "https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&q=80&w=600",
        placementBack: "https://images.unsplash.com/photo-1542382156909-9ae37b3f56fd?auto=format&fit=crop&q=80&w=600",
        placementNeck: "https://images.unsplash.com/photo-1533158326339-7f3cf2404354?auto=format&fit=crop&q=80&w=600",
        placementHand: "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&q=80&w=600",
        isBestseller: true,
        isNew: false,
        rating: 4.9,
        reviewsCount: 165
      },
      {
        name: "Sufi Whirling Dervish",
        category: "islam",
        price: 329,
        originalPrice: 459,
        size: "M — 4 x 2 in (10 x 5 cm)",
        description: "A continuous line-art silhouette of a whirling Sufi dervish, capturing spiritual ecstasy and cosmic union.",
        image1: "https://images.unsplash.com/photo-1542727313-4f3e99aa2568?auto=format&fit=crop&q=80&w=600",
        image2: "https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&q=80&w=600",
        placementArm: "https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&q=80&w=600",
        placementChest: "https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&q=80&w=600",
        placementBack: "https://images.unsplash.com/photo-1542382156909-9ae37b3f56fd?auto=format&fit=crop&q=80&w=600",
        placementNeck: "https://images.unsplash.com/photo-1533158326339-7f3cf2404354?auto=format&fit=crop&q=80&w=600",
        placementHand: "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&q=80&w=600",
        isBestseller: false,
        isNew: true,
        rating: 4.7,
        reviewsCount: 92
      },
      // 3. Sikhism
      {
        name: "Ik Onkar Divine Unity",
        category: "sikhism",
        price: 299,
        originalPrice: 399,
        size: "S — 2.5 x 2.5 in (6 x 6 cm)",
        description: "The core Sikh symbol representing One Supreme Creator who resides within all creation. Elegant Gurmukhi script.",
        image1: "https://images.unsplash.com/photo-1581898716766-3d748f3227eb?auto=format&fit=crop&q=80&w=600",
        image2: "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&q=80&w=600",
        placementArm: "https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&q=80&w=600",
        placementChest: "https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&q=80&w=600",
        placementBack: "https://images.unsplash.com/photo-1542382156909-9ae37b3f56fd?auto=format&fit=crop&q=80&w=600",
        placementNeck: "https://images.unsplash.com/photo-1533158326339-7f3cf2404354?auto=format&fit=crop&q=80&w=600",
        placementHand: "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&q=80&w=600",
        isBestseller: true,
        isNew: true,
        rating: 4.9,
        reviewsCount: 212
      },
      {
        name: "Khanda Crest of Courage",
        category: "sikhism",
        price: 349,
        originalPrice: 499,
        size: "M — 3 x 3 in (8 x 8 cm)",
        description: "The powerful Khanda crest: a double-edged sword, a circle representing eternity, and twin curved daggers of sovereignty.",
        image1: "https://images.unsplash.com/photo-1560707303-4e980c87f8af?auto=format&fit=crop&q=80&w=600",
        image2: "https://images.unsplash.com/photo-1508186227448-7a6cf6f6572e?auto=format&fit=crop&q=80&w=600",
        placementArm: "https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&q=80&w=600",
        placementChest: "https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&q=80&w=600",
        placementBack: "https://images.unsplash.com/photo-1542382156909-9ae37b3f56fd?auto=format&fit=crop&q=80&w=600",
        placementNeck: "https://images.unsplash.com/photo-1533158326339-7f3cf2404354?auto=format&fit=crop&q=80&w=600",
        placementHand: "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&q=80&w=600",
        isBestseller: false,
        isNew: false,
        rating: 4.8,
        reviewsCount: 176
      },
      {
        name: "Golden Temple Silhouette",
        category: "sikhism",
        price: 399,
        originalPrice: 599,
        size: "L — 4 x 3 in (10 x 8 cm)",
        description: "An intricate, fine-line silhouette of Sri Harmandir Sahib reflecting over the holy pool of nectar.",
        image1: "https://images.unsplash.com/photo-1512413313760-441fc5042d15?auto=format&fit=crop&q=80&w=600",
        image2: "https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?auto=format&fit=crop&q=80&w=600",
        placementArm: "https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&q=80&w=600",
        placementChest: "https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&q=80&w=600",
        placementBack: "https://images.unsplash.com/photo-1542382156909-9ae37b3f56fd?auto=format&fit=crop&q=80&w=600",
        placementNeck: "https://images.unsplash.com/photo-1533158326339-7f3cf2404354?auto=format&fit=crop&q=80&w=600",
        placementHand: "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&q=80&w=600",
        isBestseller: true,
        isNew: false,
        rating: 4.9,
        reviewsCount: 154
      },
      {
        name: "Nirbhau Nirvair Calligraphy",
        category: "sikhism",
        price: 329,
        originalPrice: 459,
        size: "M — 3.5 x 1.2 in (9 x 3 cm)",
        description: "The sacred Mul Mantar words 'Without Fear, Without Hate' written in fluid Gurmukhi brush calligraphy.",
        image1: "https://images.unsplash.com/photo-1533158326339-7f3cf2404354?auto=format&fit=crop&q=80&w=600",
        image2: "https://images.unsplash.com/photo-1594385208974-2e75f9d8ab48?auto=format&fit=crop&q=80&w=600",
        placementArm: "https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&q=80&w=600",
        placementChest: "https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&q=80&w=600",
        placementBack: "https://images.unsplash.com/photo-1542382156909-9ae37b3f56fd?auto=format&fit=crop&q=80&w=600",
        placementNeck: "https://images.unsplash.com/photo-1533158326339-7f3cf2404354?auto=format&fit=crop&q=80&w=600",
        placementHand: "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&q=80&w=600",
        isBestseller: false,
        isNew: true,
        rating: 4.9,
        reviewsCount: 189
      },
      // 4. Buddhism
      {
        name: "Lotus Rebirth Mandala",
        category: "buddhism",
        price: 349,
        originalPrice: 499,
        size: "M — 3 x 3 in (8 x 8 cm)",
        description: "A gorgeous blooming lotus emerging from detailed geometric mandala lines, representing rebirth and pure mind.",
        image1: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=600",
        image2: "https://images.unsplash.com/photo-1508186227448-7a6cf6f6572e?auto=format&fit=crop&q=80&w=600",
        placementArm: "https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&q=80&w=600",
        placementChest: "https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&q=80&w=600",
        placementBack: "https://images.unsplash.com/photo-1542382156909-9ae37b3f56fd?auto=format&fit=crop&q=80&w=600",
        placementNeck: "https://images.unsplash.com/photo-1533158326339-7f3cf2404354?auto=format&fit=crop&q=80&w=600",
        placementHand: "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&q=80&w=600",
        isBestseller: true,
        isNew: true,
        rating: 4.9,
        reviewsCount: 280
      },
      {
        name: "Dharmachakra Eightfold Wheel",
        category: "buddhism",
        price: 299,
        originalPrice: 399,
        size: "S — 2.5 x 2.5 in (6 x 6 cm)",
        description: "The Wheel of Dharma, with eight spokes representing the Buddha's Noble Eightfold Path to liberation and wisdom.",
        image1: "https://images.unsplash.com/photo-1611601679655-7c8bc197f0c6?auto=format&fit=crop&q=80&w=600",
        image2: "https://images.unsplash.com/photo-1533158326339-7f3cf2404354?auto=format&fit=crop&q=80&w=600",
        placementArm: "https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&q=80&w=600",
        placementChest: "https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&q=80&w=600",
        placementBack: "https://images.unsplash.com/photo-1542382156909-9ae37b3f56fd?auto=format&fit=crop&q=80&w=600",
        placementNeck: "https://images.unsplash.com/photo-1533158326339-7f3cf2404354?auto=format&fit=crop&q=80&w=600",
        placementHand: "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&q=80&w=600",
        isBestseller: false,
        isNew: false,
        rating: 4.8,
        reviewsCount: 165
      },
      {
        name: "Zen Meditating Buddha",
        category: "buddhism",
        price: 399,
        originalPrice: 599,
        size: "L — 4.5 x 3.5 in (11 x 9 cm)",
        description: "A zen-style minimalist brush silhouette of the Buddha sitting in deep meditation with a tiny gold leaf accent.",
        image1: "https://images.unsplash.com/photo-1508186227448-7a6cf6f6572e?auto=format&fit=crop&q=80&w=600",
        image2: "https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&q=80&w=600",
        placementArm: "https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&q=80&w=600",
        placementChest: "https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&q=80&w=600",
        placementBack: "https://images.unsplash.com/photo-1542382156909-9ae37b3f56fd?auto=format&fit=crop&q=80&w=600",
        placementNeck: "https://images.unsplash.com/photo-1533158326339-7f3cf2404354?auto=format&fit=crop&q=80&w=600",
        placementHand: "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&q=80&w=600",
        isBestseller: true,
        isNew: false,
        rating: 4.9,
        reviewsCount: 210
      },
      {
        name: "Om Mani Padme Hum Script",
        category: "buddhism",
        price: 329,
        originalPrice: 459,
        size: "M — 4 x 1 in (10 x 2.5 cm)",
        description: "The classic Tibetan Buddhist mantra of infinite compassion, calligraphed in vertical Sanskrit calligraphy.",
        image1: "https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?auto=format&fit=crop&q=80&w=600",
        image2: "https://images.unsplash.com/photo-1512413313760-441fc5042d15?auto=format&fit=crop&q=80&w=600",
        placementArm: "https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&q=80&w=600",
        placementChest: "https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&q=80&w=600",
        placementBack: "https://images.unsplash.com/photo-1542382156909-9ae37b3f56fd?auto=format&fit=crop&q=80&w=600",
        placementNeck: "https://images.unsplash.com/photo-1533158326339-7f3cf2404354?auto=format&fit=crop&q=80&w=600",
        placementHand: "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&q=80&w=600",
        isBestseller: false,
        isNew: true,
        rating: 4.9,
        reviewsCount: 172
      },
      // 5. Judaism
      {
        name: "Magen David Geometric",
        category: "judaism",
        price: 299,
        originalPrice: 399,
        size: "S — 2 x 2 in (5 x 5 cm)",
        description: "The Star of David, created with twin interlaced fine line geometric triangles. A classic symbol of protection and faith.",
        image1: "https://images.unsplash.com/photo-1533158326339-7f3cf2404354?auto=format&fit=crop&q=80&w=600",
        image2: "https://images.unsplash.com/photo-1611601679655-7c8bc197f0c6?auto=format&fit=crop&q=80&w=600",
        placementArm: "https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&q=80&w=600",
        placementChest: "https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&q=80&w=600",
        placementBack: "https://images.unsplash.com/photo-1542382156909-9ae37b3f56fd?auto=format&fit=crop&q=80&w=600",
        placementNeck: "https://images.unsplash.com/photo-1533158326339-7f3cf2404354?auto=format&fit=crop&q=80&w=600",
        placementHand: "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&q=80&w=600",
        isBestseller: false,
        isNew: false,
        rating: 4.8,
        reviewsCount: 124
      },
      {
        name: "Hamsa Hand of Protection",
        category: "judaism",
        price: 349,
        originalPrice: 499,
        size: "M — 3.5 x 2.5 in (9 x 6 cm)",
        description: "The hand of Miriam, filled with intricate Hebrew geometric detailing and a central eye of protection.",
        image1: "https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&q=80&w=600",
        image2: "https://images.unsplash.com/photo-1542727313-4f3e99aa2568?auto=format&fit=crop&q=80&w=600",
        placementArm: "https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&q=80&w=600",
        placementChest: "https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&q=80&w=600",
        placementBack: "https://images.unsplash.com/photo-1542382156909-9ae37b3f56fd?auto=format&fit=crop&q=80&w=600",
        placementNeck: "https://images.unsplash.com/photo-1533158326339-7f3cf2404354?auto=format&fit=crop&q=80&w=600",
        placementHand: "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&q=80&w=600",
        isBestseller: true,
        isNew: true,
        rating: 4.9,
        reviewsCount: 195
      },
      {
        name: "Kabbalistic Tree of Life",
        category: "judaism",
        price: 399,
        originalPrice: 599,
        size: "L — 4.5 x 2.5 in (11 x 6 cm)",
        description: "The ten Sephirot spheres of divine creation, connected by sacred geometric paths from Kabbalistic mysticism.",
        image1: "https://images.unsplash.com/photo-1542382156909-9ae37b3f56fd?auto=format&fit=crop&q=80&w=600",
        image2: "https://images.unsplash.com/photo-1508186227448-7a6cf6f6572e?auto=format&fit=crop&q=80&w=600",
        placementArm: "https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&q=80&w=600",
        placementChest: "https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&q=80&w=600",
        placementBack: "https://images.unsplash.com/photo-1542382156909-9ae37b3f56fd?auto=format&fit=crop&q=80&w=600",
        placementNeck: "https://images.unsplash.com/photo-1533158326339-7f3cf2404354?auto=format&fit=crop&q=80&w=600",
        placementHand: "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&q=80&w=600",
        isBestseller: true,
        isNew: false,
        rating: 4.9,
        reviewsCount: 143
      },
      {
        name: "Hebrew Shalom Script",
        category: "judaism",
        price: 249,
        originalPrice: 349,
        size: "S — 2.5 x 1 in (6 x 2.5 cm)",
        description: "The Hebrew word for Peace, Wholeness, and Harmony, calligraphed with elegant, flowing modern script flourishes.",
        image1: "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&q=80&w=600",
        image2: "https://images.unsplash.com/photo-1581898716766-3d748f3227eb?auto=format&fit=crop&q=80&w=600",
        placementArm: "https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&q=80&w=600",
        placementChest: "https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&q=80&w=600",
        placementBack: "https://images.unsplash.com/photo-1542382156909-9ae37b3f56fd?auto=format&fit=crop&q=80&w=600",
        placementNeck: "https://images.unsplash.com/photo-1533158326339-7f3cf2404354?auto=format&fit=crop&q=80&w=600",
        placementHand: "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&q=80&w=600",
        isBestseller: false,
        isNew: true,
        rating: 4.7,
        reviewsCount: 86
      },
      // 6. Christianity
      {
        name: "Crucifix Cross of Faith",
        category: "christianity",
        price: 299,
        originalPrice: 399,
        size: "S — 2.5 x 1.5 in (6 x 4 cm)",
        description: "A clean, minimalist cross representing unwavering faith, eternal grace, and spiritual guidance. Thin linework.",
        image1: "https://images.unsplash.com/photo-1594385208974-2e75f9d8ab48?auto=format&fit=crop&q=80&w=600",
        image2: "https://images.unsplash.com/photo-1508186227448-7a6cf6f6572e?auto=format&fit=crop&q=80&w=600",
        placementArm: "https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&q=80&w=600",
        placementChest: "https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&q=80&w=600",
        placementBack: "https://images.unsplash.com/photo-1542382156909-9ae37b3f56fd?auto=format&fit=crop&q=80&w=600",
        placementNeck: "https://images.unsplash.com/photo-1533158326339-7f3cf2404354?auto=format&fit=crop&q=80&w=600",
        placementHand: "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&q=80&w=600",
        isBestseller: true,
        isNew: true,
        rating: 4.9,
        reviewsCount: 340
      },
      {
        name: "Crown of Thorns & Rose",
        category: "christianity",
        price: 349,
        originalPrice: 499,
        size: "M — 3 x 3 in (8 x 8 cm)",
        description: "An intricate crown of thorns wrapped around a blooming red rose, symbolizing absolute sacrifice and eternal love.",
        image1: "https://images.unsplash.com/photo-1560707303-4e980c87f8af?auto=format&fit=crop&q=80&w=600",
        image2: "https://images.unsplash.com/photo-1512413313760-441fc5042d15?auto=format&fit=crop&q=80&w=600",
        placementArm: "https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&q=80&w=600",
        placementChest: "https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&q=80&w=600",
        placementBack: "https://images.unsplash.com/photo-1542382156909-9ae37b3f56fd?auto=format&fit=crop&q=80&w=600",
        placementNeck: "https://images.unsplash.com/photo-1533158326339-7f3cf2404354?auto=format&fit=crop&q=80&w=600",
        placementHand: "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&q=80&w=600",
        isBestseller: false,
        isNew: false,
        rating: 4.8,
        reviewsCount: 205
      },
      {
        name: "Alpha & Omega Monogram",
        category: "christianity",
        price: 329,
        originalPrice: 459,
        size: "S — 2 x 2 in (5 x 5 cm)",
        description: "The Greek monogram Alpha (Α) and Omega (Ω), representing the Beginning and the End in early Christian icon art.",
        image1: "https://images.unsplash.com/photo-1611601679655-7c8bc197f0c6?auto=format&fit=crop&q=80&w=600",
        image2: "https://images.unsplash.com/photo-1533158326339-7f3cf2404354?auto=format&fit=crop&q=80&w=600",
        placementArm: "https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&q=80&w=600",
        placementChest: "https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&q=80&w=600",
        placementBack: "https://images.unsplash.com/photo-1542382156909-9ae37b3f56fd?auto=format&fit=crop&q=80&w=600",
        placementNeck: "https://images.unsplash.com/photo-1533158326339-7f3cf2404354?auto=format&fit=crop&q=80&w=600",
        placementHand: "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&q=80&w=600",
        isBestseller: false,
        isNew: true,
        rating: 4.7,
        reviewsCount: 94
      },
      {
        name: "Sacred Heart of Jesus",
        category: "christianity",
        price: 399,
        originalPrice: 599,
        size: "M — 3.5 x 2.5 in (9 x 6 cm)",
        description: "A burning, thorn-wrapped heart with a miniature cross radiating divine light, symbolizing infinite mercy.",
        image1: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=600",
        image2: "https://images.unsplash.com/photo-1560707303-4e980c87f8af?auto=format&fit=crop&q=80&w=600",
        placementArm: "https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&q=80&w=600",
        placementChest: "https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&q=80&w=600",
        placementBack: "https://images.unsplash.com/photo-1542382156909-9ae37b3f56fd?auto=format&fit=crop&q=80&w=600",
        placementNeck: "https://images.unsplash.com/photo-1533158326339-7f3cf2404354?auto=format&fit=crop&q=80&w=600",
        placementHand: "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&q=80&w=600",
        isBestseller: true,
        isNew: false,
        rating: 4.9,
        reviewsCount: 168
      },
      // 7. Combo Deals
      {
        name: "Dharmic Trinity Combo Pack",
        category: "combo",
        price: 799,
        originalPrice: 1047,
        size: "3 Tattoos Pack",
        description: "Our top three best-selling spiritual designs (Shiva Tandava Trishul, Lotus Rebirth Mandala, and Ik Onkar) bundled in one pack. Save 25% off regular pricing.",
        image1: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=600",
        image2: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=600",
        placementArm: "https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&q=80&w=600",
        placementChest: "https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&q=80&w=600",
        placementBack: "https://images.unsplash.com/photo-1542382156909-9ae37b3f56fd?auto=format&fit=crop&q=80&w=600",
        placementNeck: "https://images.unsplash.com/photo-1533158326339-7f3cf2404354?auto=format&fit=crop&q=80&w=600",
        placementHand: "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&q=80&w=600",
        isBestseller: true,
        isNew: false,
        rating: 4.9,
        reviewsCount: 154
      },
      {
        name: "Abrahamic Harmony Combo Pack",
        category: "combo",
        price: 699,
        originalPrice: 897,
        size: "3 Tattoos Pack",
        description: "A gorgeous collection of minimalist faith symbols: Crucifix Cross of Faith, Star of David, and Crescent Geometry. Gift it to loved ones.",
        image1: "https://images.unsplash.com/photo-1533158326339-7f3cf2404354?auto=format&fit=crop&q=80&w=600",
        image2: "https://images.unsplash.com/photo-1611601679655-7c8bc197f0c6?auto=format&fit=crop&q=80&w=600",
        placementArm: "https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&q=80&w=600",
        placementChest: "https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&q=80&w=600",
        placementBack: "https://images.unsplash.com/photo-1542382156909-9ae37b3f56fd?auto=format&fit=crop&q=80&w=600",
        placementNeck: "https://images.unsplash.com/photo-1533158326339-7f3cf2404354?auto=format&fit=crop&q=80&w=600",
        placementHand: "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&q=80&w=600",
        isBestseller: true,
        isNew: false,
        rating: 4.8,
        reviewsCount: 110
      },
      // 8. Custom Category
      {
        name: "Sanskrit Initials custom letter",
        category: "custom",
        price: 399,
        originalPrice: 499,
        size: "Custom Sizing",
        description: "Get your initials or favorite word custom designed in elegant Sanskrit Devanagari calligraphy script.",
        image1: "https://images.unsplash.com/photo-1581898716766-3d748f3227eb?auto=format&fit=crop&q=80&w=600",
        image2: "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&q=80&w=600",
        placementArm: "https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&q=80&w=600",
        placementChest: "https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&q=80&w=600",
        placementBack: "https://images.unsplash.com/photo-1542382156909-9ae37b3f56fd?auto=format&fit=crop&q=80&w=600",
        placementNeck: "https://images.unsplash.com/photo-1533158326339-7f3cf2404354?auto=format&fit=crop&q=80&w=600",
        placementHand: "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&q=80&w=600",
        isBestseller: false,
        isNew: true,
        rating: 4.9,
        reviewsCount: 142
      },
      {
        name: "Sacred Runes Personalized",
        category: "custom",
        price: 349,
        originalPrice: 449,
        size: "Custom Sizing",
        description: "Write your name in ancient sacred Elder Futhark runes. Choose 3-8 letters to be designed for your forearm or wrist.",
        image1: "https://images.unsplash.com/photo-1533158326339-7f3cf2404354?auto=format&fit=crop&q=80&w=600",
        image2: "https://images.unsplash.com/photo-1611601679655-7c8bc197f0c6?auto=format&fit=crop&q=80&w=600",
        placementArm: "https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&q=80&w=600",
        placementChest: "https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&q=80&w=600",
        placementBack: "https://images.unsplash.com/photo-1542382156909-9ae37b3f56fd?auto=format&fit=crop&q=80&w=600",
        placementNeck: "https://images.unsplash.com/photo-1533158326339-7f3cf2404354?auto=format&fit=crop&q=80&w=600",
        placementHand: "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&q=80&w=600",
        isBestseller: true,
        isNew: false,
        rating: 4.8,
        reviewsCount: 88
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
    const server = app.listen(PORT, () => {
      console.log(`Backend server is running on port ${PORT}`);

      // ── SELF-PING KEEP-ALIVE ────────────────────────────────────────────────
      // Render free tier sleeps after 15 min of inactivity.
      // This pings the server's own /health endpoint every 2 minutes so it
      // NEVER sleeps — even when the admin PC is off.
      const RENDER_BASE = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;
      const PING_URL = `${RENDER_BASE}/health`;
      
      setInterval(async () => {
        try {
          const res = await fetch(PING_URL, { signal: AbortSignal.timeout(10000) });
          console.log(`[keep-alive] Self-ping OK: ${res.status} at ${new Date().toISOString()}`);
        } catch (err) {
          console.log(`[keep-alive] Self-ping failed: ${err.message}`);
        }
      }, 2 * 60 * 1000); // every 2 minutes

      console.log(`[keep-alive] Started self-ping every 2 min → ${PING_URL}`);
    });
  })
  .catch((err) => {
    console.error('Database connection failed:', err.message);
  });


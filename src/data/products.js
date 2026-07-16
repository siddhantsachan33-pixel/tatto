export const categories = [
  { id: 'all', name: 'All Drops', icon: '✨' },
  { id: 'bestsellers', name: 'Bestsellers', icon: '🔥' },
  { id: 'typography', name: 'Typography', icon: '✍️' },
  { id: 'spiritual', name: 'Spiritual', icon: '🧘' },
  { id: 'anime', name: 'Anime & Pop', icon: '👾' },
  { id: 'gothic', name: 'Gothic & Dark', icon: '💀' },
  { id: 'minimalist', name: 'Minimalist', icon: '🌱' }
];

export const products = [
  // Bestsellers & Spiritual
  {
    id: 'p1',
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
    id: 'p2',
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
  // Typography
  {
    id: 'p3',
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
  // Anime
  {
    id: 'p4',
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
  // Minimalist
  {
    id: 'p5',
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
  // Gothic
  {
    id: 'p6',
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
  },
  // Spiritual
  {
    id: 'p7',
    name: 'Cosmic Unalome',
    category: 'spiritual',
    price: 299,
    originalPrice: 499,
    rating: 4.8,
    reviewsCount: 65,
    image1: 'https://images.unsplash.com/photo-1550537687-c91072c4792d?auto=format&fit=crop&q=80&w=600',
    image2: 'https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&q=80&w=600',
    size: '3 x 1.5 inches',
    description: 'The Unalome symbol representing the path to enlightenment, crowned with a crescent moon and stars.',
    isBestseller: false,
    isNew: false
  },
  // Typography
  {
    id: 'p8',
    name: 'Wildflower (Script)',
    category: 'typography',
    price: 249,
    originalPrice: 449,
    rating: 4.6,
    reviewsCount: 43,
    image1: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=600',
    image2: 'https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&q=80&w=600',
    size: '3 x 1 inches',
    description: 'Elegant script lettering reading "wildflower" with a tiny blooming flower stem at the end.',
    isBestseller: false,
    isNew: true
  }
];

export const bundles = [
  {
    id: 'b1',
    name: 'Spiritual Awakening Pack',
    price: 799,
    originalPrice: 1497,
    itemsCount: 3,
    rating: 4.9,
    reviewsCount: 88,
    image: 'https://images.unsplash.com/photo-1550537687-c91072c4792d?auto=format&fit=crop&q=80&w=600',
    description: 'Includes Mandala Harmony, Cosmic Unalome, and Lotus Bloom semi-permanent tattoos.'
  },
  {
    id: 'b2',
    name: 'Gothic Noir Bundle',
    price: 849,
    originalPrice: 1597,
    itemsCount: 3,
    rating: 4.8,
    reviewsCount: 64,
    image: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&q=80&w=600',
    description: 'Includes Dagger & Rose, Viper Strike, and Raven Skull semi-permanent tattoos.'
  },
  {
    id: 'b3',
    name: 'Minimalist Dream Pack',
    price: 699,
    originalPrice: 1297,
    itemsCount: 3,
    rating: 4.9,
    reviewsCount: 120,
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=600',
    description: 'Includes Constellation Stars, Amour Script, and Petite Crescent Moon tattoos.'
  }
];

export const faqs = [
  {
    question: 'How long do SEEDINK semi-permanent tattoos last?',
    answer: 'Our tattoos last anywhere from 1 to 2 weeks (10-14 days). The longevity depends on where you apply the tattoo and how well you take care of it during the first 24 hours.'
  },
  {
    question: 'Are the tattoos safe for my skin?',
    answer: 'Absolutely! Our ink is made from a plant-based, organic formulation (derived from the Genipa Americana fruit). It is 100% skin-safe, non-toxic, and hypoallergenic.'
  },
  {
    question: 'How does it work? Is there a needle involved?',
    answer: 'No needles, zero pain! It applies like a regular temporary sticker using water. However, the ink reacts with the first layer of your skin (epidermis) and darkens over 24-36 hours into a deep dark blue/black tattoo that looks completely real.'
  },
  {
    question: 'Is it waterproof?',
    answer: 'Yes! Once fully developed (after 24 hours), our tattoos are 100% waterproof. You can shower, swim, exercise, and go about your daily activities without any issues.'
  },
  {
    question: 'How do I remove the tattoo early?',
    answer: 'Since the ink sinks into the top layer of your skin, it cannot be rubbed off immediately. However, you can accelerate the fading process by gently scrubbing it daily with warm soapy water, baby oil, or an exfoliating scrub.'
  }
];

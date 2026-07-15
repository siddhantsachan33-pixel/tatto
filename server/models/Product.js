import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  rating: { type: Number, default: 5 },
  reviewsCount: { type: Number, default: 0 },
  image1: { type: String, required: true },
  image2: { type: String, required: true },
  size: { type: String, default: '3 x 3 inches' },
  description: { type: String, required: true },
  isBestseller: { type: Boolean, default: false },
  isNew: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);

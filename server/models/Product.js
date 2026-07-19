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
  placementArm: { type: String, default: '' },
  placementChest: { type: String, default: '' },
  placementBack: { type: String, default: '' },
  placementNeck: { type: String, default: '' },
  placementHand: { type: String, default: '' },
  size: { type: String, default: '3 x 3 inches' },
  description: { type: String, required: true },
  isBestseller: { type: Boolean, default: false },
  isNew: { type: Boolean, default: false },
  variants: [
    {
      size: { type: String, required: true }, // e.g. "S — 2 x 2 in"
      price: { type: Number, required: true }, // e.g. 299
      originalPrice: { type: Number }, // e.g. 399
      placement: { type: String, required: true } // e.g. "Arm", "Chest", "Back", "Neck", "Hand"
    }
  ]
}, { timestamps: true });

export default mongoose.model('Product', productSchema);

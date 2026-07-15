import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  quantity: { type: String, required: true },
  details: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('Inquiry', inquirySchema);

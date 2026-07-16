import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  name: { type: String, default: 'Anonymous' },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  tattooIdea: { type: String, required: true },
  size: { type: String, default: '' },
  placement: { type: String, default: '' },
  chatHistory: [
    {
      sender: { type: String, required: true }, // 'user' or 'bot'
      text: { type: String, required: true },
      timestamp: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

export default mongoose.model('Lead', leadSchema);

import mongoose from 'mongoose';

const teamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  bio: { type: String, required: true },
  image: { type: String, required: true } // Base64 image payload or URL
}, { timestamps: true });

export default mongoose.model('TeamMember', teamMemberSchema);

import mongoose from 'mongoose';
const schema = new mongoose.Schema({ slug: { type: String, required: true, unique: true }, title: String, category: String, durationMinutes: Number, price: Number, level: String, format: String, tutor: String, rating: Number, reviews: Number, color: String, description: String, tags: [String], nextSlot: String, icon: String }, { timestamps: true });
export const Service = mongoose.models.Service || mongoose.model('Service', schema);

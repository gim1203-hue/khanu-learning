import mongoose from 'mongoose';
const schema = new mongoose.Schema({ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }, serviceSlug: { type: String, required: true }, serviceTitle: { type: String, required: true }, tutor: { type: String, required: true }, startsAt: { type: Date, required: true }, notes: { type: String, maxlength: 500, default: '' }, status: { type: String, enum: ['upcoming', 'completed', 'cancelled'], default: 'upcoming' } }, { timestamps: true });
export const Booking = mongoose.models.Booking || mongoose.model('Booking', schema);

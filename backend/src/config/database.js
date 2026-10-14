import mongoose from 'mongoose';
import { catalog } from '../data.js';
import { Service } from '../models/Service.js';

export async function connectDatabase(uri = process.env.MONGODB_URI) {
  if (!uri) {
    console.log('MONGODB_URI is missing; using demo memory mode. Set it to persist accounts and bookings.');
    return false;
  }
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    for (const service of catalog) {
      await Service.updateOne({ slug: service.slug }, { $setOnInsert: service }, { upsert: true });
    }
    console.log('Connected to MongoDB and checked the seed catalog.');
    return true;
  } catch (error) {
    console.warn(`MongoDB unavailable; using demo memory mode: ${error.message}`);
    return false;
  }
}

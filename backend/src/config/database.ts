import mongoose from 'mongoose';
import College from '../models/College';
import { TOP_COLLEGES } from '../data/colleges';

mongoose.set('bufferCommands', false);

async function seedCollegesIfNeeded() {
  if (mongoose.connection.readyState !== 1) return;

  const target = TOP_COLLEGES.length;
  const count = await College.countDocuments();
  if (count >= target) return;

  const existing = await College.find({}, { name: 1 }).lean();
  const names = new Set(existing.map((c) => c.name));
  const toInsert = TOP_COLLEGES.filter((c) => !names.has(c.name));
  if (toInsert.length === 0) return;

  await College.insertMany(toInsert);
  console.log(`Seeded ${toInsert.length} colleges (dataset has ${target}; DB now has at least ${count + toInsert.length}).`);
}

export const connectDB = async () => {
  if (process.env.SKIP_MONGODB === 'true') {
    console.log('MongoDB skipped. Using local in-memory storage for this session.');
    return;
  }

  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/college-chatbot';
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('MongoDB connected successfully');
    await seedCollegesIfNeeded();
  } catch (error) {
    console.warn('MongoDB connection failed. Using local in-memory storage for this session.');
  }
};

import mongoose, { Schema, Document } from 'mongoose';

export interface ICollege extends Document {
  name: string;
  type: 'government' | 'private';
  state: string;
  city: string;
  courses: string[];
  avgFees: number;
  placementRate: number;
  avgPackage: number;
  ranking: number;
  established: number;
  affiliatedUniversity: string;
  website: string;
  cutoff: number;
}

const CollegeSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['government', 'private'], required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  courses: { type: [String], required: true },
  avgFees: { type: Number, required: true },
  placementRate: { type: Number, required: true },
  avgPackage: { type: Number, required: true },
  ranking: { type: Number, required: true },
  established: { type: Number, required: true },
  affiliatedUniversity: { type: String, required: true },
  website: { type: String, required: true },
  cutoff: { type: Number, required: true },
});

export default mongoose.model<ICollege>('College', CollegeSchema);

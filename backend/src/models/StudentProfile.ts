import mongoose, { Schema, Document } from 'mongoose';

export interface IStudentProfile extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  course: string;
  entranceExam: string;
  entranceScore: number | null;
  class10Marks: number;
  class12Marks: number;
  hobbies: string[];
  goals: string[];
  dreams: string;
  budget: number;
  preferredCities: string[];
  preferredStates: string[];
  createdAt: Date;
  updatedAt: Date;
}

const StudentProfileSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: String, required: true },
    entranceExam: { type: String, default: '' },
    entranceScore: { type: Number, default: null },
    class10Marks: { type: Number, required: true, min: 0, max: 100 },
    class12Marks: { type: Number, required: true, min: 0, max: 100 },
    hobbies: { type: [String], default: [] },
    goals: { type: [String], default: [] },
    dreams: { type: String, default: '' },
    budget: { type: Number, required: true },
    preferredCities: { type: [String], default: [] },
    preferredStates: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model<IStudentProfile>('StudentProfile', StudentProfileSchema);

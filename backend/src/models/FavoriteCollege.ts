import mongoose, { Schema, Document } from 'mongoose';

export interface IFavoriteCollege extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  collegeId: mongoose.Schema.Types.ObjectId;
  addedAt: Date;
}

const FavoriteCollegeSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  collegeId: { type: Schema.Types.ObjectId, ref: 'College', required: true },
  addedAt: { type: Date, default: Date.now },
});

export default mongoose.model<IFavoriteCollege>('FavoriteCollege', FavoriteCollegeSchema);

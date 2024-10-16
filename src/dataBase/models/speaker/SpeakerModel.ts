import mongoose from 'mongoose';

export type Speaker = {
  ownerId: mongoose.Schema.Types.ObjectId;
  name: string;
  email?: string;
  phone?: string;
};

const SpeakerSchema = new mongoose.Schema<Speaker>(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    email: String,
    phone: String,
  },
  { timestamps: true },
);

export default mongoose.models.Speaker || mongoose.model('Speaker', SpeakerSchema);

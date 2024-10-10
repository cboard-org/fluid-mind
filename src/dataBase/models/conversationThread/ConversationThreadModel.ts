import mongoose from 'mongoose';
import type { ChatHistory } from '@/src/commonTypes/communicatorModelsOptions';

export type ConversationThread = {
  ownerId: mongoose.Schema.Types.ObjectId;
  speakersIds: mongoose.Schema.Types.ObjectId[];
  chatHistory: ChatHistory;
};

const ConversationThreadSchema = new mongoose.Schema<ConversationThread>(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    speakersIds: {
      type: [mongoose.Schema.Types.ObjectId],
      required: true,
      unique: true,
    },
  },
  { timestamps: true },
);

export default mongoose.models.ConversationThread ||
  mongoose.model('ConversationThread', ConversationThreadSchema);

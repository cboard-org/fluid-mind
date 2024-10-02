import type { ObjectId } from 'mongodb';
import { Schema, model, models } from 'mongoose';

type User = {
  _id: ObjectId;
  username: string;
  email: string;
  password: string;
};

const UserSchema = new Schema<User>(
  {
    email: {
      type: String,
      required: [true, 'Please provide an email'],
    },
    username: {
      type: String,
      required: [true, 'Please provide a username'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
    },
  },
  { timestamps: true },
);

const User = models.User || model<User>('User', UserSchema);

export default User;

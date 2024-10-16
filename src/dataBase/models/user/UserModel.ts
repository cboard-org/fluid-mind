import { Schema, model, models } from 'mongoose';

export type UserSettings = {
  appLocale: string;
  sttLocale: string;
  ttsVoice: string;
};

export type User = {
  username: string;
  email: string;
  password: string;
  settings: UserSettings;
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
    settings: {
      type: Object,
    },
  },
  { timestamps: true },
);

const User = models.User || model<User>('User', UserSchema);

export default User;

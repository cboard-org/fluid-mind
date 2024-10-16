import { getServerSession } from 'next-auth';
import type { User } from './UserModel';
import UserSchema from './UserModel';
import authConfig from '@/src/lib/next-auth/config';
import dbConnect from '@/src/lib/dbConnect';

export type UpdateSettingsParams = {
  settings: Partial<User['settings']>;
};

export const updateSettings = async ({ settings }: UpdateSettingsParams): Promise<User> => {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user) throw new Error('Unauthenticated');

    await dbConnect();
    const userId = session.user.id;

    const user = await UserSchema.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    const currentSettings = user.settings;
    console.log('currentSettings', currentSettings);

    const updatedSettings = currentSettings
      ? {
          ...currentSettings,
          ...Object.entries(settings).reduce((acc, [key, value]) => {
            return { ...acc, [key]: value };
          }, {}),
        }
      : settings;

    const savedUser = await UserSchema.findByIdAndUpdate(
      userId,
      { $set: { settings: updatedSettings } },
      { new: true, runValidators: true },
    );

    if (!savedUser) {
      throw new Error('Failed to save updated user');
    }

    return savedUser.toObject();
  } catch (error) {
    console.error('Error updating user settings:', error);
    throw error;
  }
};

export const getSettings = async (): Promise<User['settings']> => {
  try {
    const session = await getServerSession(authConfig);

    if (!session?.user) throw new Error('Unauthenticated');

    await dbConnect();
    const userId = session.user.id;

    const user = await UserSchema.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    const userSettings = user.settings;
    console.log('userSettings', userSettings);

    if (!userSettings) {
      throw new Error('User settings not found');
    }

    return userSettings;
  } catch (error) {
    console.error('Error retrieving user settings:', error);
    throw error;
  }
};

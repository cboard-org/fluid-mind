import { getServerSession } from 'next-auth/next';
import authConfig from '@/src/lib/next-auth/config';
import dbConnect from '@/src/lib/dbConnect';
import type { Speaker } from './SpeakerModel';
import SpeakerSchema from './SpeakerModel';

export const createSpeaker = async (speaker: { name: string }) => {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user) throw new Error('Unauthenticated');

    await dbConnect();

    const userId = session.user.id;

    const newSpeaker = await SpeakerSchema.create({
      ...speaker,
      ownerId: userId,
    });
    return newSpeaker;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      if (error.name === 'MongoError') throw new Error('name already used');
    }
    throw new Error('Server error');
  }
};

export const getSpeaker = async (id: string) => {
  const session = await getServerSession(authConfig);
  if (!session?.user) throw new Error('Unauthenticated');

  await dbConnect();

  const userId = session.user.id;
  const speaker = await SpeakerSchema.findOne({ _id: id, ownerId: userId });
  if (!speaker) {
    throw new Error('Speaker not found or not owned by user');
  }

  return speaker;
};

export const updateSpeaker = async (id: string, updates: Speaker) => {
  const session = await getServerSession(authConfig);
  if (!session) throw new Error('Unauthenticated');

  await dbConnect();

  const userId = session.user.id;

  try {
    const updatedSpeaker = await SpeakerSchema.findOneAndUpdate(
      { _id: id, ownerId: userId },
      updates,
      {
        new: true,
        runValidators: true,
      },
    );
    if (!updatedSpeaker) throw new Error('Speaker not found or not owned by user');
    return updatedSpeaker;
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    return error;
  }
};

export const deleteSpeaker = async (id: string) => {
  const session = await getServerSession(authConfig);
  if (!session) throw new Error('Unauthenticated');

  await dbConnect();

  const userId = session.user.id;

  try {
    const deletedSpeaker = await SpeakerSchema.findOneAndDelete({ _id: id, ownerId: userId });
    if (!deletedSpeaker) throw new Error('Speaker not found or not owned by user');

    return deletedSpeaker;
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    throw error;
  }
};

export const getAllSpeakers = async () => {
  const session = await getServerSession(authConfig);
  if (!session?.user) throw new Error('Unauthenticated');

  await dbConnect();

  const userId = session.user.id;

  try {
    const speakers = await SpeakerSchema.find({ ownerId: userId });
    if (!speakers) throw new Error('Speaker not found or not owned by user');
    return speakers;
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    throw error;
  }
};

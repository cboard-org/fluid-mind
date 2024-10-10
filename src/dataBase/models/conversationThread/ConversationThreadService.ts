import { getServerSession } from 'next-auth/next';
import authConfig from '@/src/lib/next-auth/config';
import dbConnect from '@/src/lib/dbConnect';
import type { ConversationThread } from './ConversationThreadModel';
import ConversationThreadSchema from './ConversationThreadModel';

export const createConversationThread = async (conversationThread: ConversationThread) => {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user) throw new Error('Unauthenticated');

    await dbConnect();

    const userId = session.user.id;

    const newConversationThread = await ConversationThreadSchema.create({
      ...conversationThread,
      ownerId: userId,
    });
    return newConversationThread;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      if (error.name === 'MongoError') throw new Error('name already used');
    }
    throw new Error('Server error');
  }
};

export const getConversationThread = async (id: string) => {
  const session = await getServerSession(authConfig);
  if (!session?.user) throw new Error('Unauthenticated');

  await dbConnect();

  const userId = session.user.id;
  const conversationThread = await ConversationThreadSchema.findOne({ _id: id, ownerId: userId });
  if (!conversationThread) {
    throw new Error('Conversation thread not found or not owned by user');
  }

  return conversationThread;
};

export const updateConversationThread = async (id: string, updates: ConversationThread) => {
  const session = await getServerSession(authConfig);
  if (!session) throw new Error('Unauthenticated');

  await dbConnect();

  const userId = session.user.id;

  try {
    const updatedConversationThread = await ConversationThreadSchema.findOneAndUpdate(
      { _id: id, ownerId: userId },
      updates,
      {
        new: true,
        runValidators: true,
      },
    );
    if (!updatedConversationThread)
      throw new Error('Conversation thread not found or not owned by user');
    return updatedConversationThread;
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    return error;
  }
};

export const deleteConversationThread = async (id: string) => {
  const session = await getServerSession(authConfig);
  if (!session) throw new Error('Unauthenticated');

  await dbConnect();

  const userId = session.user.id;

  try {
    const deletedConversationThread = await ConversationThreadSchema.findOneAndDelete({
      _id: id,
      ownerId: userId,
    });
    if (!deletedConversationThread)
      throw new Error('Conversation thread not found or not owned by user');

    return deletedConversationThread;
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    throw error;
  }
};

export const getAllConversationThreads = async () => {
  const session = await getServerSession(authConfig);
  if (!session?.user) throw new Error('Unauthenticated');

  await dbConnect();

  const userId = session.user.id;

  try {
    const conversationThreads = await ConversationThreadSchema.find({ ownerId: userId });
    if (!conversationThreads) throw new Error('Conversation thread not found or not owned by user');
    return conversationThreads;
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    throw error;
  }
};

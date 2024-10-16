import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import {
  deleteConversationThread,
  updateConversationThread,
  getConversationThread,
} from '@/src/dataBase/models/conversationThread/ConversationThreadService';

export async function GET(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  try {
    const conversationThread = await getConversationThread(id);
    return NextResponse.json(conversationThread, {
      status: 200,
      statusText: 'OK',
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      if (error.message === 'Unauthenticated')
        return NextResponse.json(
          { error: 'Authentication required to access this resource' },
          { status: 401, statusText: 'Unauthorized' },
        );

      if (error.message === 'Conversation thread not found or not owned by user')
        return NextResponse.json(
          {
            error:
              'The requested conversation thread does not exist or you do not have permission to view it',
          },
          { status: 404, statusText: 'Not Found' },
        );
    }
    return NextResponse.json(
      { error: 'An unexpected error occurred while processing your request' },
      { status: 500, statusText: 'Internal Server Error' },
    );
  }
}

export async function PUT(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  const updates = await req.json();
  try {
    const updatedConversationThread = await updateConversationThread(id, updates);
    return NextResponse.json(updatedConversationThread);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      if (error.message === 'Unauthenticated')
        return NextResponse.json(
          { error: 'Authentication required to access this resource' },
          { status: 401, statusText: 'Unauthorized' },
        );
      if (error.message === 'Conversation thread not found or not owned by user')
        return NextResponse.json(
          {
            error:
              'The requested conversation thread does not exist or you do not have permission to update it',
          },
          { status: 404, statusText: 'Not Found' },
        );
    }
    return NextResponse.json(
      { error: 'An unexpected error occurred while processing your request' },
      { status: 500, statusText: 'Internal Server Error' },
    );
  }
}

export async function DELETE(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  try {
    const deletedConversationThread = await deleteConversationThread(id);
    return NextResponse.json(deletedConversationThread);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      if (error.message === 'Unauthenticated')
        return NextResponse.json(
          { error: 'Authentication required to access this resource' },
          { status: 401, statusText: 'Unauthorized' },
        );
      if (error.message === 'Conversation thread not found or not owned by user')
        return NextResponse.json(
          {
            error:
              'The requested conversation thread does not exist or you do not have permission to delete it',
          },
          { status: 404, statusText: 'Not Found' },
        );
    }
    return NextResponse.json(
      { error: 'An unexpected error occurred while processing your request' },
      { status: 500, statusText: 'Internal Server Error' },
    );
  }
}

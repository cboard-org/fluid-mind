import { createSpeaker } from '@/databaseModels/speaker/speakerService';
import { NextResponse, type NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const contact = await req.json();
    const newContact = await createSpeaker(contact);
    return NextResponse.json(newContact);
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      console.error(error.message);
      if (error.message === 'Unauthenticated')
        return NextResponse.json(
          { error: 'Authentication required to access this resource' },
          { status: 401, statusText: 'Unauthorized' },
        );
      if (error.message === 'name already used')
        return NextResponse.json(
          { error: 'The contact name is already used' },
          { status: 409, statusText: 'name already used' },
        );
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

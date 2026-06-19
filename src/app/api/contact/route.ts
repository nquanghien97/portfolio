import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { contactFormSchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = contactFormSchema.parse(body);

    const message = await prisma.contactMessage.create({
      data: validated,
    });

    return NextResponse.json(
      { success: true, id: message.id },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Invalid form data' },
        { status: 400 }
      );
    }
    console.error('Contact form error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';
import { projectSchema } from '@/lib/validations';

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    console.error('Projects GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const validated = projectSchema.parse(body);
    const project = await prisma.project.create({ data: validated });
    return NextResponse.json({ success: true, data: project }, { status: 201 });
  } catch (error) {
    console.error('Projects POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create project' },
      { status: 400 }
    );
  }
}

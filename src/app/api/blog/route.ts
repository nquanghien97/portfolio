import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';
import { blogPostSchema } from '@/lib/validations';

export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, data: posts });
  } catch (error) {
    console.error('Blog GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch posts' },
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
    const validated = blogPostSchema.parse(body);
    const post = await prisma.blogPost.create({ data: validated });
    return NextResponse.json({ success: true, data: post }, { status: 201 });
  } catch (error) {
    console.error('Blog POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create post' },
      { status: 400 }
    );
  }
}

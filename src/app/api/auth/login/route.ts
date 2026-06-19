import { NextRequest, NextResponse } from 'next/server';
import { generateToken, hashPassword, verifyPassword } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { loginSchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = loginSchema.parse(body);

    // Find admin user
    let admin = await prisma.adminUser.findUnique({ where: { username } });

    // If no admin user exists, create one from env vars (first-time setup)
    if (!admin && username === process.env.ADMIN_USERNAME) {
      if (password === process.env.ADMIN_PASSWORD) {
        admin = await prisma.adminUser.create({
          data: {
            username,
            passwordHash: hashPassword(password),
          },
        });
      }
    }

    if (!admin || !verifyPassword(password, admin.passwordHash)) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = generateToken({ username: admin.username });

    const response = NextResponse.json({
      success: true,
      token,
    });

    // Also set as httpOnly cookie
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Invalid request' },
      { status: 400 }
    );
  }
}

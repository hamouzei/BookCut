import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { getSql } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'You must be logged in to use this setup route.' },
        { status: 401 }
      );
    }

    const sql = getSql();

    // Update the user's role to 'admin'
    await sql`
      UPDATE "user"
      SET role = 'admin'
      WHERE id = ${session.user.id}
    `;

    return NextResponse.json({
      success: true,
      message: `User ${session.user.email} has been promoted to ADMIN. Please refresh the page or go to /admin.`
    });
  } catch (error) {
    console.error('Error promoting user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to promote user' },
      { status: 500 }
    );
  }
}

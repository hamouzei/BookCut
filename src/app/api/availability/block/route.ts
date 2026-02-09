import { NextResponse } from 'next/server';
import { createBlockedTime, deleteBlockedTime } from '@/lib/db/blocked-times';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// POST /api/availability/block - Block a time range
export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session || (session.user.role !== 'admin' && session.user.role !== 'barber')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { barberId, date, startTime, endTime, reason, isAllDay } = body;

    if (!barberId || !date || !startTime || !endTime) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const blockedTime = await createBlockedTime({
      barberId,
      date,
      startTime,
      endTime,
      reason,
      isAllDay
    });

    return NextResponse.json({ success: true, data: blockedTime }, { status: 201 });
  } catch (error) {
    console.error('Error blocking time:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to block time' },
      { status: 500 }
    );
  }
}

// DELETE /api/availability/block?id=1 - Unblock a time range
export async function DELETE(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session || (session.user.role !== 'admin' && session.user.role !== 'barber')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'id is required' },
        { status: 400 }
      );
    }

    const success = await deleteBlockedTime(parseInt(id));

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Blocked time not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error unblocking time:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to unblock time' },
      { status: 500 }
    );
  }
}

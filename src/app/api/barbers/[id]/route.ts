import { NextResponse } from 'next/server';
import { getBarberById, updateBarber, deleteBarber } from '@/lib/db/barbers';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

// PUT /api/barbers/[id] - Update a barber
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const barber = await updateBarber(Number(id), body);

    if (!barber) {
      return NextResponse.json({ success: false, error: 'Barber not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: barber });
  } catch (error) {
    console.error('Error updating barber:', error);
    return NextResponse.json({ success: false, error: 'Failed to update barber' }, { status: 500 });
  }
}

// DELETE /api/barbers/[id] - Soft-delete a barber
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const deleted = await deleteBarber(Number(id));

    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Barber not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting barber:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete barber' }, { status: 500 });
  }
}

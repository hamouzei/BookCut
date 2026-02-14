import { NextResponse } from 'next/server';
import { updateService, deleteService } from '@/lib/db/services';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

// PUT /api/services/[id] - Update a service
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const service = await updateService(Number(id), body);

    if (!service) {
      return NextResponse.json({ success: false, error: 'Service not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: service });
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json({ success: false, error: 'Failed to update service' }, { status: 500 });
  }
}

// DELETE /api/services/[id] - Soft-delete a service
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const deleted = await deleteService(Number(id));

    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Service not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete service' }, { status: 500 });
  }
}

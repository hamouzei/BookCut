import { NextResponse } from 'next/server';
import { calculateAvailability, calculateAllBarbersAvailability } from '@/lib/engine/availability';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const barberId = searchParams.get('barberId');
    const date = searchParams.get('date');
    const serviceId = searchParams.get('serviceId');

    if (!date) {
      return NextResponse.json({ success: false, error: 'date is required' }, { status: 400 });
    }

    if (barberId) {
      try {
        const result = await calculateAvailability({
          barberId: parseInt(barberId),
          date,
          serviceId: serviceId ? parseInt(serviceId) : undefined
        });

        if (!result) {
          return NextResponse.json({ success: false, error: 'Barber not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: result });
      } catch (err) {
        // Handle specific errors from engine if any, or general 'not found' / 'error'
        console.error("Availability calc error", err);
        return NextResponse.json({ success: false, error: 'Failed to calculate availability' }, { status: 500 });
      }
    } else {
      // Fetch availability for all active barbers
      try {
        const results = await calculateAllBarbersAvailability(
          date,
          serviceId ? parseInt(serviceId) : undefined
        );

        return NextResponse.json({
          success: true,
          data: results
        });
      } catch (err) {
        console.error("All barbers availability calc error", err);
        return NextResponse.json({ success: false, error: 'Failed to calculate availability' }, { status: 500 });
      }
    }
  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch availability' }, { status: 500 });
  }
}

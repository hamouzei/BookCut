import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const to = searchParams.get('to');

  if (!to) {
    return NextResponse.json({ error: 'Missing "to" query parameter' }, { status: 400 });
  }

  try {
    const result = await sendEmail({
      to,
      subject: 'Test Email from Barbershop Booking',
      html: '<p>If you see this, email sending is working!</p>'
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

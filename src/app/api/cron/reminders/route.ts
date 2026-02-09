import { NextResponse } from 'next/server';
import { getSql } from '@/lib/db';
import { sendEmail } from '@/lib/email';
import { format } from 'date-fns';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // Verify Cron Secret to prevent unauthorized access
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const sql = getSql();

    // Find bookings for tomorrow that haven't been reminded yet
    // Assuming we have a 'reminded_at' column or similar, otherwise we just query based on date for now
    // For MVP, let's query bookings happening tomorrow

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateString = tomorrow.toISOString().split('T')[0];

    const bookings = await sql`
        SELECT b.id, b.date, b.start_time, b.customer_name, b.customer_email, s.name as service_name
        FROM bookings b
        JOIN services s ON b.service_id = s.id
        WHERE b.date = ${dateString} 
        AND b.status = 'confirmed'
    `;

    const results = await Promise.all(bookings.map(async (booking) => {
      const html = `
            <p>Hi ${booking.customer_name},</p>
            <p>This is a reminder for your appointment tomorrow!</p>
            <p><strong>Service:</strong> ${booking.service_name}</p>
            <p><strong>Time:</strong> ${booking.start_time}</p>
            <p>See you soon!</p>
        `;

      return sendEmail({
        to: booking.customer_email,
        subject: 'Appointment Reminder - Tomorrow',
        html
      });
    }));

    return NextResponse.json({
      success: true,
      remindersSent: results.length,
      details: results
    });

  } catch (error) {
    console.error('Error sending reminders:', error);
    return NextResponse.json({ success: false, error: 'Failed to send reminders' }, { status: 500 });
  }
}

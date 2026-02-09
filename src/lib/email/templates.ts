import { Booking } from '@/types';
import { format } from 'date-fns';

export function getBookingConfirmationTemplate(booking: Booking) {
  const date = format(new Date(booking.date), 'EEEE, MMMM do, yyyy');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px; }
          .header { background-color: #f8fafc; padding: 20px; text-align: center; border-bottom: 1px solid #eee; }
          .content { padding: 30px 20px; }
          .details { background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .footer { text-align: center; font-size: 12px; color: #999; margin-top: 30px; }
          .button { display: inline-block; background-color: #0f172a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Booking Confirmed! ✅</h2>
          </div>
          <div class="content">
            <p>Hi ${booking.customerName},</p>
            <p>Your appointment has been successfully booked. We're looking forward to seeing you!</p>
            
            <div class="details">
              <p><strong>Service:</strong> ${booking.serviceName}</p>
              <p><strong>Barber:</strong> ${booking.barberName}</p>
              <p><strong>Date:</strong> ${date}</p>
              <p><strong>Time:</strong> ${booking.startTime}</p>
              <p><strong>Reference:</strong> BC-${booking.id.toString().padStart(6, '0')}</p>
            </div>

            <p>If you need to reschedule or cancel, please contact us or visit your bookings page.</p>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/bookings/${booking.id}/confirmation" class="button">View Booking Details</a>
            </div>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Barbershop Booking. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

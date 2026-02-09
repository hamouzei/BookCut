import { Resend } from 'resend';

// Initialize Resend with API key
// If key is missing, operations will fail gracefully
const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = 'bookings@barbershop.com'; // Or a verified domain like 'onboarding@resend.dev' for testing

export interface EmailData {
  to: string;
  subject: string;
  html: string;
}

/**
 * Send an email using Resend
 */
export async function sendEmail({ to, subject, html }: EmailData) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY is not set. Email not sent.');
    return { success: false, error: 'Missing API Key' };
  }

  try {
    const response = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>', // Default testing domain
      to,
      subject,
      html,
    });

    if (response.error) {
      console.error('Resend API Error:', response.error);
      return { success: false, error: response.error };
    }

    return { success: true, data: response.data };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
}

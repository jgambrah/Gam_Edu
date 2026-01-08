'use server';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function submitSchoolLead(formData: FormData) {
  const schoolName = formData.get('schoolName') as string;
  const contactName = formData.get('contactName') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const studentCount = formData.get('studentCount') as string;

  if (!schoolName || !email || !contactName) {
    return { error: 'Missing required fields' };
  }

  try {
    // 1. Send Email to YOU (The CEO)
    await resend.emails.send({
      from: 'GAM Sales <info@gam-it-service.app>', // Must be your verified domain
      to: 'jamesgambrah@gmail.com', // Your personal email
      subject: `🚀 New Lead: ${schoolName}`,
      html: `
        <h1>New School Registration Request</h1>
        <p><strong>School:</strong> ${schoolName}</p>
        <p><strong>Contact Person:</strong> ${contactName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Est. Students:</strong> ${studentCount}</p>
        <br/>
        <p><i>Go to your CEO Portal to create this school if approved.</i></p>
      `
    });

    // 2. (Optional) Send Confirmation to the Client
    await resend.emails.send({
      from: 'GAM Edu <info@gam-it-service.app>',
      to: email,
      subject: 'We received your request - GAM Edu',
      html: `
        <p>Hi ${contactName},</p>
        <p>Thank you for your interest in GAM Edu for <strong>${schoolName}</strong>.</p>
        <p>Our team will review your details and contact you shortly to set up your school's portal.</p>
        <br/>
        <p>Best regards,<br/>The GAM Edu Team</p>
      `
    });

    return { success: true };

  } catch (error) {
    console.error('Lead Email Failed:', error);
    return { error: 'Failed to submit request. Please try again.' };
  }
}

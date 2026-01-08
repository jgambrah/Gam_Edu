import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(email: string, name: string) {
  try {
    await resend.emails.send({
      from: 'GAM Edu <info@gam-it-service.app>', // Changed this to your domain later (e.g. hello@gam-edu.com)
      to: email,
      subject: 'Welcome to GAM Edu!',
      html: `
        <h1>Welcome, ${name}!</h1>
        <p>Thank you for joining GAM Edu. We are excited to help you learn.</p>
        <p>Click here to start: <a href="https://gam-it-service.app/dashboard">Go to Dashboard</a></p>
      `
    });
    console.log('Email sent to:', email);
  } catch (error) {
    console.error('Email failed:', error);
  }
}


export async function sendSchoolCredentialsEmail(email: string, name: string, schoolName: string, password: string) {
  try {
    await resend.emails.send({
      from: 'GAM Edu <info@gam-it-service.app>',
      to: email,
      subject: `Welcome to GAM Edu - ${schoolName} Portal Access`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Welcome to GAM Edu!</h1>
          <p>Dear ${name},</p>
          <p>We are thrilled to announce that the portal for <strong>${schoolName}</strong> has been successfully created.</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-weight: bold;">Your Director Credentials:</p>
            <p><strong>Login URL:</strong> <a href="https://gam-it-service.app">https://gam-it-service.app</a></p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Temporary Password:</strong> ${password}</p>
          </div>

          <p>Please log in and change your password immediately for security.</p>
          <p>If you have any questions, simply reply to this email.</p>
          <br/>
          <p>Best regards,<br/>The GAM Edu Team</p>
        </div>
      `
    });
    console.log(`Credentials email sent to ${email}`);
  } catch (error) {
    console.error('Failed to send credentials email:', error);
  }
}

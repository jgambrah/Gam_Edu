import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(email: string, name: string) {
  try {
    await resend.emails.send({
      from: 'GAM Edu <onboarding@resend.dev>', // Change this to your domain later (e.g. hello@gam-edu.com)
      to: email,
      subject: 'Welcome to GAM Edu!',
      html: `
        <h1>Welcome, ${name}!</h1>
        <p>Thank you for joining GAM Edu. We are excited to help you learn.</p>
        <p>Click here to start: <a href="https://gam-edu.vercel.app">Go to Dashboard</a></p>
      `
    });
    console.log('Email sent to:', email);
  } catch (error) {
    console.error('Email failed:', error);
  }
}

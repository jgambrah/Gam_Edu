import { Resend } from 'resend';

// 1. REMOVED the top-level initialization
// const resend = new Resend(...) <--- THIS WAS CAUSING THE CRASH

// 2. Created a helper to load it ONLY when needed (Lazy Loading)
const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY;
  
  if (!apiKey) {
    // This error will now only happen on the server, where it belongs
    throw new Error("RESEND_API_KEY is missing in environment variables.");
  }
  
  return new Resend(apiKey);
};

export async function sendWelcomeEmail(email: string, name: string) {
  try {
    const resend = getResendClient(); // <--- Initialize here

    await resend.emails.send({
      from: 'GAM Edu <info@gam-it-service.app>',
      to: email,
      subject: 'Welcome to GAM Edu!',
      html: `
        <h1>Welcome, ${name}!</h1>
        <p>Thank you for joining GAM Edu.</p>
        <p>Click here to start: <a href="https://gam-it-service.app/dashboard">Go to Dashboard</a></p>
      `
    });
  } catch (error) {
    console.error('Email failed:', error);
  }
}

export async function sendSchoolCredentialsEmail(email: string, name: string, schoolName: string, password: string) {
  try {
    const resend = getResendClient(); // <--- Initialize here

    await resend.emails.send({
      from: 'GAM Edu <info@gam-it-service.app>',
      to: email,
      subject: `Welcome to GAM Edu - ${schoolName} Portal Access`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Welcome to GAM Edu!</h1>
          <p>The portal for <strong>${schoolName}</strong> is ready.</p>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px;">
            <p><strong>URL:</strong> https://gam-it-service.app</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Password:</strong> ${password}</p>
          </div>
        </div>
      `
    });
  } catch (error) {
    console.error('Failed to send credentials email:', error);
  }
}

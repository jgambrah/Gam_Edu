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
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
    
    <!-- HEADER -->
    <div style="background-color: #2563eb; padding: 24px; text-align: center;">
       <h1 style="color: #ffffff; margin: 0; font-size: 24px;">GAM Edu</h1>
       <p style="color: #bfdbfe; margin: 4px 0 0; font-size: 14px;">School Management Platform</p>
    </div>

    <!-- BODY -->
    <div style="padding: 32px 24px;">
      <h2 style="color: #1e293b; margin-top: 0;">Portal Ready: ${schoolName}</h2>
      <p style="color: #475569; line-height: 1.6;">Dear ${name},</p>
      <p style="color: #475569; line-height: 1.6;">
        We are excited to welcome you aboard. Your dedicated school portal has been successfully provisioned and is ready for use.
      </p>

      <!-- CREDENTIALS CARD -->
      <div style="background-color: #f8fafc; border-left: 4px solid #2563eb; padding: 16px; margin: 24px 0; border-radius: 4px;">
        <p style="margin: 0 0 8px; font-weight: bold; color: #334155;">Director Login Details:</p>
        <ul style="margin: 0; padding-left: 20px; color: #475569;">
          <li style="margin-bottom: 4px;"><strong>URL:</strong> <a href="https://gam-it-service.app" style="color: #2563eb;">https://gam-it-service.app</a></li>
          <li style="margin-bottom: 4px;"><strong>Email:</strong> ${email}</li>
          <li><strong>Password:</strong> ${password}</li>
        </ul>
      </div>

      <p style="color: #475569; line-height: 1.6;">
        <strong>Next Steps:</strong> Log in and follow the Setup Wizard to create your first class and invite your staff.
      </p>
      
      <div style="text-align: center; margin-top: 32px;">
        <a href="https://gam-it-service.app" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold;">Login to Dashboard</a>
      </div>
    </div>

    <!-- FOOTER -->
    <div style="background-color: #f1f5f9; padding: 24px; text-align: center; color: #64748b; font-size: 12px;">
      <p style="margin: 0;">&copy; 2025 GAM IT Solutions. All rights reserved.</p>
      <p style="margin: 8px 0 0;">Need help? Reply to this email.</p>
    </div>
  </div>
`
    });
  } catch (error) {
    console.error('Failed to send credentials email:', error);
  }
}

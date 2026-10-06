'use server';

import { Resend } from 'resend';
import { getAdminDb, FieldValue } from '@/lib/firebaseAdmin';

export type SubmitLeadParams = {
  schoolName: string;
  contactName: string;
  email?: string;
  phone: string;
  location?: string;
  primaryInterest?: string;
  studentCount?: string;
};

/**
 * Handles incoming school leads from the landing page.
 * 1. Saves to the Firestore 'leads' collection so it appears in the CEO Command Center Incoming Requests tab.
 * 2. Sends an instant email alert to jamesgambrah@gmail.com via Resend.
 */
export async function submitSchoolLead(input: FormData | SubmitLeadParams) {
  let schoolName = '';
  let contactName = '';
  let email = '';
  let phone = '';
  let location = '';
  let primaryInterest = '';
  let studentCount = '';

  if (input instanceof FormData) {
    schoolName = (input.get('schoolName') as string) || '';
    contactName = (input.get('contactName') as string) || (input.get('fullName') as string) || '';
    email = (input.get('email') as string) || '';
    phone = (input.get('phone') as string) || '';
    location = (input.get('location') as string) || '';
    primaryInterest = (input.get('primaryInterest') as string) || '';
    studentCount = (input.get('studentCount') as string) || '';
  } else {
    schoolName = input.schoolName || '';
    contactName = input.contactName || (input as any).fullName || '';
    email = input.email || '';
    phone = input.phone || '';
    location = input.location || '';
    primaryInterest = input.primaryInterest || '';
    studentCount = input.studentCount || '';
  }

  schoolName = schoolName.trim();
  contactName = contactName.trim();
  phone = phone.trim();
  location = location.trim();
  primaryInterest = primaryInterest.trim();
  email = email.trim();

  if (!schoolName || !contactName) {
    return { error: 'Missing required school or contact name' };
  }

  // If email was not provided, generate a clean placeholder so that provisioning always works
  const cleanPhoneDigits = phone.replace(/\D/g, '');
  const effectiveEmail = email || `${cleanPhoneDigits || 'lead'}@gam-edu.temp`;

  try {
    const db = getAdminDb();
    
    // Save to Firestore 'leads' collection (used by CEO Command Center Incoming Requests)
    const leadDocRef = await db.collection('leads').add({
      schoolName,
      contactName,
      email: effectiveEmail,
      rawEmail: email || null,
      phone,
      location: location || 'Ghana',
      primaryInterest: primaryInterest || 'Full School Management',
      studentCount: studentCount || '100 - 500',
      status: 'pending', // pending, approved, rejected
      source: 'website_demo_request',
      createdAt: FieldValue.serverTimestamp()
    });

    // Also write a copy to 'demo_requests'
    try {
      await db.collection('demo_requests').add({
        leadId: leadDocRef.id,
        schoolName,
        contactName,
        email: effectiveEmail,
        phone,
        location,
        primaryInterest,
        status: 'pending',
        createdAt: FieldValue.serverTimestamp()
      });
    } catch (e) {
      // non-critical
    }

    // Send Email Alert to James (CEO)
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      try {
        const resend = new Resend(apiKey);
        await resend.emails.send({
          from: 'GAM Sales <info@gam-it-service.app>',
          to: 'jamesgambrah@gmail.com',
          subject: `🚨 New School Demo Request: ${schoolName}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
              <h2 style="color: #1e293b; margin-top: 0;">New School Demo Request Received!</h2>
              <p style="color: #64748b;">A Ghanaian school head/proprietor has requested a demo via the landing page:</p>
              <div style="background: #f8fafc; padding: 16px; border-radius: 6px; margin: 16px 0; border-left: 4px solid #2563eb;">
                <p style="margin: 4px 0;"><strong>School:</strong> ${schoolName}</p>
                <p style="margin: 4px 0;"><strong>Contact Name:</strong> ${contactName}</p>
                <p style="margin: 4px 0;"><strong>Phone / WhatsApp:</strong> <a href="tel:${phone}">${phone}</a></p>
                <p style="margin: 4px 0;"><strong>Location:</strong> ${location || 'N/A'}</p>
                <p style="margin: 4px 0;"><strong>Primary Interest:</strong> ${primaryInterest || 'Full School Management'}</p>
                <p style="margin: 4px 0;"><strong>Email:</strong> ${email || 'None provided'}</p>
              </div>
              <p><a href="https://gam-it-service.app/dashboard/super-admin" style="display:inline-block;background:#2563eb;color:#ffffff;padding:12px 20px;text-decoration:none;border-radius:6px;font-weight:bold;">Open CEO Command Center to Provision</a></p>
            </div>
          `
        });
      } catch (emailErr) {
        console.error("Resend email delivery failed:", emailErr);
      }
    }

    return { success: true, leadId: leadDocRef.id };
  } catch (error: any) {
    console.error('Lead Submission Failed:', error);
    return { error: error.message || 'Failed to submit request.' };
  }
}

export async function sendSchoolCredentialsEmail(email: string, name: string, schoolName: string, password: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY missing, skipping credentials email.");
    return;
  }

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: 'GAM Edu <info@gam-it-service.app>',
      to: email,
      subject: `Welcome to GAM Edu - ${schoolName} Portal Access`,
      html: `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
    <div style="background-color: #2563eb; padding: 24px; text-align: center;">
       <h1 style="color: #ffffff; margin: 0; font-size: 24px;">GAM Edu</h1>
       <p style="color: #bfdbfe; margin: 4px 0 0; font-size: 14px;">School Management Platform</p>
    </div>
    <div style="padding: 32px 24px;">
      <h2 style="color: #1e293b; margin-top: 0;">Portal Ready: ${schoolName}</h2>
      <p style="color: #475569; line-height: 1.6;">Dear ${name},</p>
      <p style="color: #475569; line-height: 1.6;">
        We are excited to welcome you aboard. Your dedicated school portal has been successfully provisioned and is ready for use.
      </p>
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
    <div style="background-color: #f1f5f9; padding: 24px; text-align: center; color: #64748b; font-size: 12px;">
      <p style="margin: 0;">&copy; 2026 GAM IT Solutions. All rights reserved.</p>
    </div>
  </div>
`
    });
  } catch (error) {
    console.error('Failed to send credentials email:', error);
  }
}

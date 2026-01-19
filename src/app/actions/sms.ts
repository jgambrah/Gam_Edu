
'use server';

// You will need to sign up with Arkesel/Hubtel to get this key
const SMS_API_KEY = process.env.SMS_API_KEY; 
const SENDER_ID = "GAM Edu"; // Limit to 11 chars

export async function sendSMSAction(phone: string, message: string) {
  if (!SMS_API_KEY) {
    console.error("SMS API Key missing");
    return { success: false, error: "SMS System not configured" };
  }

  // Sanitize Phone (Ghana format: 0244... -> 233244...)
  let cleanPhone = phone.replace(/\s+/g, '');
  if (cleanPhone.startsWith('0')) {
      cleanPhone = '233' + cleanPhone.substring(1);
  }

  try {
    // Example using a generic GET/POST request (Works for Arkesel/mNotify)
    // Replace URL with your actual provider's endpoint
    const url = `https://sms.arkesel.com/api/v2/sms/send`;
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'api-key': SMS_API_KEY,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            sender: SENDER_ID,
            message: message,
            recipients: [cleanPhone]
        })
    });

    const data = await response.json();

    if (data.status === 'success' || data.code === '1000') {
        return { success: true };
    } else {
        console.error("SMS Provider Error:", data);
        return { success: false, error: "Provider failed to send" };
    }

  } catch (error) {
    console.error("SMS Network Error:", error);
    return { success: false, error: "Network error" };
  }
}

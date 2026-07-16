/**
 * Centralized error sanitizing utility for GAM Edu.
 * Logs raw exceptions securely to console/telemetry and filters out sensitive 
 * driver details, tokens, and database errors before returning to users.
 */
export function sanitizeErrorMessage(error: any, fallback = "An unexpected error occurred."): string {
    if (!error) return fallback;

    // Securely log the raw error message to standard console output
    console.error("[Logged Exception Details]:", error);

    const message = error.message || String(error);
    const code = error.code || "";

    // Firebase Auth codes lookup mapping
    if (code.startsWith('auth/')) {
        switch (code) {
            case 'auth/invalid-credential':
            case 'auth/wrong-password':
            case 'auth/user-not-found':
            case 'auth/invalid-email':
                return "The email or password you entered is incorrect. Please check your credentials and try again.";
            case 'auth/too-many-requests':
                return "Too many failed attempts. Your account is temporarily locked for security. Please try again later.";
            case 'auth/network-request-failed':
                return "Network connection issue. Please check your internet connection and try again.";
            case 'auth/email-already-in-use':
                return "This email address is already in use by another account.";
            case 'auth/weak-password':
                return "Password must be at least 6 characters long.";
            default:
                return "Authentication failed. Please verify your credentials.";
        }
    }

    // Identify sensitive database/system terminology
    const sensitiveKeywords = [
        "firebase", 
        "credential", 
        "private_key", 
        "privatekey",
        "client_email",
        "project_id",
        "permission-denied",
        "permission_denied",
        "insufficient permissions",
        "quota",
        "resource exhausted",
        "unauthorized",
        "token required",
        "verifyidtoken",
        "verify-id-token"
    ];

    const lowerMessage = message.toLowerCase();
    const containsSensitive = sensitiveKeywords.some(keyword => lowerMessage.includes(keyword));

    if (containsSensitive) {
        return "A secure server connection issue occurred. Please contact the administrator.";
    }

    return message;
}

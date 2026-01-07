'use client';

import React from 'react';
import { PaystackButton } from 'react-paystack';

interface PayButtonProps {
  amount: number; // Amount in GHS (e.g. 50 for 50 GHS)
  email: string;
  userId: string; // Needed to update the database via Webhook
  onSuccess?: () => void;
  onClose?: () => void;
}

const PayButton = ({ amount, email, userId, onSuccess, onClose }: PayButtonProps) => {
  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

  if (!publicKey) {
    console.error("Paystack Public Key is missing!");
    return <button disabled>Configuration Error</button>;
  }

  const componentProps = {
    email,
    amount: amount * 100, // Paystack expects amount in kobo (multiply GHS by 100)
    currency: 'GHS',
    metadata: {
      userId, // <--- CRITICAL: This allows the Webhook to find the user in Firebase
      custom_fields: []
    },
    publicKey,
    text: "Upgrade Now",
    onSuccess: () => {
      alert("Payment Successful! Your account will be upgraded momentarily.");
      if (onSuccess) onSuccess();
    },
    onClose: () => {
      alert("Transaction canceled");
      if (onClose) onClose();
    },
  };

  return (
    <div className="mt-4">
      {/* @ts-ignore - The library types can sometimes be strict */}
      <PaystackButton 
        className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 transition shadow-lg w-full md:w-auto" 
        {...componentProps} 
      />
    </div>
  );
};

export default PayButton;

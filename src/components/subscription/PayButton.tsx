
'use client';

import React from 'react';
import { usePaystackPayment } from 'react-paystack';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface PayButtonProps {
  amount: number;
  email: string;
  userId: string;
  metadata: any;
}

const PayButton = ({ amount, email, userId, metadata }: PayButtonProps) => {
  const { toast } = useToast();

  const config = {
    reference: new Date().getTime().toString(),
    email,
    amount: amount * 100, // Amount in pesewas
    currency: 'GHS',
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
    metadata: {
      userId,
      ...metadata,
    },
  };

  const initializePayment = usePaystackPayment(config);

  const onSuccess = (reference: any) => {
    toast({
      title: 'Payment Successful',
      description: `Transaction Reference: ${reference.reference}. Refreshing your dashboard...`,
    });
    
    // Force a full reload to clear the trial lock and fetch updated school data
    setTimeout(() => {
        window.location.href = '/dashboard';
    }, 2000);
  };

  const onClose = () => {
    toast({
      variant: 'destructive',
      title: 'Payment Closed',
      description: 'The transaction was cancelled.',
    });
  };

  return (
    <Button 
        type="button" 
        onClick={() => {
            // @ts-ignore
            initializePayment(onSuccess, onClose);
        }}
        className="w-full h-12 bg-green-600 hover:bg-green-700 text-lg font-bold"
    >
         Pay GHS {amount.toLocaleString()}
    </Button>
  );
};

export default PayButton;

'use client';

import React, { useState } from 'react';
import { usePaystackPayment } from 'react-paystack';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CreditCard } from 'lucide-react';

interface PayButtonProps {
  amount: number;
  email: string;
  userId: string;
  metadata: any;
}

const PayButton = ({ amount, email, userId, metadata }: PayButtonProps) => {
  const { toast } = useToast();
  const [cardDetails, setCardDetails] = useState({
    number: '',
    cvc: '',
    expiry_month: '',
    expiry_year: '',
  });

  const config = {
    reference: new Date().getTime().toString(),
    email,
    amount: amount * 100, // Amount in kobo
    currency: 'GHS',
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
    metadata: {
      userId,
      ...metadata,
    },
    card: cardDetails,
  };

  const initializePayment = usePaystackPayment(config);

  const onSuccess = (reference: any) => {
    toast({
      title: 'Payment Successful',
      description: `Your plan has been upgraded. Reference: ${reference.reference}`,
    });
    // You can add redirection logic here
  };

  const onClose = () => {
    toast({
      variant: 'destructive',
      title: 'Payment Closed',
      description: 'The payment process was cancelled.',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // @ts-ignore
    initializePayment(onSuccess, onClose);
  };

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label htmlFor="number">Card Number</Label>
          <div className="relative">
             <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
             <Input
                id="number"
                name="number"
                type="tel"
                placeholder="0000 0000 0000 0000"
                value={cardDetails.number}
                onChange={handleCardChange}
                className="pl-10"
                required
            />
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-1/2">
            <Label htmlFor="expiry_month">Expiry Month</Label>
            <Input
              id="expiry_month"
              name="expiry_month"
              type="number"
              placeholder="MM"
              value={cardDetails.expiry_month}
              onChange={handleCardChange}
              required
            />
          </div>
          <div className="w-1/2">
            <Label htmlFor="expiry_year">Expiry Year</Label>
            <Input
              id="expiry_year"
              name="expiry_year"
              type="number"
              placeholder="YYYY"
              value={cardDetails.expiry_year}
              onChange={handleCardChange}
              required
            />
          </div>
        </div>
        <div>
          <Label htmlFor="cvc">CVC</Label>
          <Input
            id="cvc"
            name="cvc"
            type="number"
            placeholder="123"
            value={cardDetails.cvc}
            onChange={handleCardChange}
            required
          />
        </div>
      </div>
      <Button type="submit" className="w-full h-12 bg-green-600 hover:bg-green-700 text-lg font-bold">
         Pay GHS {amount.toFixed(2)}
      </Button>
    </form>
  );
};

export default PayButton;

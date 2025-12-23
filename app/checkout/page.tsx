'use client';

import { Suspense } from 'react';
import { CheckoutForm } from './CheckoutForm';

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>}>
      <CheckoutForm />
    </Suspense>
  );
}

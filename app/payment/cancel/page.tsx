'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { XCircleIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

function CancelContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams?.get('order');

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
            <XCircleIcon className="h-10 w-10 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-navy mb-2">Subscription Cancelled</h1>
          <p className="text-gray-600">
            Your subscription checkout was cancelled. No charges have been made.
          </p>
        </div>

        {orderId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-1">Order ID</p>
            <p className="font-mono text-sm font-semibold text-navy">{orderId}</p>
          </div>
        )}

        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            If you experienced any issues, please contact our support team.
          </p>

          <div className="flex flex-col gap-3">
            <Link
              href="/checkout"
              className="inline-block w-full bg-teal text-white font-semibold py-3 rounded-md hover:bg-teal/90 transition-all duration-200"
            >
              Try Again
            </Link>
            
            <Link
              href="/"
              className="inline-block w-full bg-gray-200 text-navy font-semibold py-3 rounded-md hover:bg-gray-300 transition-all duration-200"
            >
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <CancelContent />
    </Suspense>
  );
}

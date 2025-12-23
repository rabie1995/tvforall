/**
 * CHECKOUT PAGE DISABLED
 * 
 * This page has been disabled because the site now uses DIRECT payment links.
 * All subscription buttons redirect directly to NOWPayments.
 * 
 * If you landed here by mistake, please go back to the homepage.
 */

'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function CheckoutPageDisabled() {
  useEffect(() => {
    // Redirect to homepage after 3 seconds
    const timer = setTimeout(() => {
      window.location.href = '/';
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
            <svg className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-navy mb-4">Checkout Disabled</h1>
          <p className="text-gray-600 mb-6">
            This page is no longer available. All payments are now handled directly through NOWPayments.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Redirecting to homepage in 3 seconds...
          </p>
          <Link
            href="/"
            className="inline-block w-full bg-primary text-white font-semibold py-3 rounded-md hover:bg-primary/90 transition-all duration-200"
          >
            Go to Homepage Now
          </Link>
        </div>
      </div>
    </div>
  );
}

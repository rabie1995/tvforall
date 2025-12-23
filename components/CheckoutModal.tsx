'use client';

import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  planId: string;
  planName: string;
  planPrice: number;
}

const PAYMENT_LINKS: Record<string, string> = {
  'plan_3m': 'https://nowpayments.io/payment/?iid=6334134208',
  'plan_6m': 'https://nowpayments.io/payment/?iid=6035616621',
  'plan_12m': 'https://nowpayments.io/payment/?iid=5981936582'
};

export function CheckoutModal({ isOpen, onClose, planId, planName, planPrice }: CheckoutModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [region, setRegion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate inputs
      if (!name.trim()) {
        throw new Error('Name is required');
      }
      if (!email.trim() || !email.includes('@')) {
        throw new Error('Valid email is required');
      }
      if (!region.trim()) {
        throw new Error('Region is required');
      }

      // Save customer data
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          region: region.trim(),
          planId,
          planName,
          planPrice
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save customer data');
      }

      const data = await response.json();

      // Redirect to NOWPayments with customer ID in URL
      const paymentUrl = PAYMENT_LINKS[planId];
      if (paymentUrl) {
        window.location.href = `${paymentUrl}&ref=${data.customerId}`;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-2xl border border-border/50 bg-surface/95 backdrop-blur-xl p-6 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg hover:bg-surface-light p-2 transition-colors"
        >
          <XMarkIcon className="h-6 w-6 text-text" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-text mb-2">Complete Your Order</h2>
          <p className="text-sm text-text-muted">
            {planName} – ${planPrice}/year
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-text mb-2">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full rounded-lg border border-border/50 bg-surface/50 px-4 py-2.5 text-text placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
              disabled={loading}
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full rounded-lg border border-border/50 bg-surface/50 px-4 py-2.5 text-text placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
              disabled={loading}
            />
          </div>

          {/* Region */}
          <div>
            <label htmlFor="region" className="block text-sm font-medium text-text mb-2">
              Region/Country
            </label>
            <input
              id="region"
              type="text"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder="e.g., United States, France"
              className="w-full rounded-lg border border-border/50 bg-surface/50 px-4 py-2.5 text-text placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
              disabled={loading}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-3">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 rounded-lg border border-border/50 bg-surface/50 px-4 py-2.5 text-text font-medium hover:border-border hover:bg-surface transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg bg-gradient-to-r from-primary to-secondary px-4 py-2.5 text-white font-medium hover:shadow-lg hover:shadow-primary/25 transition-all disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Proceed to Payment'}
            </button>
          </div>
        </form>

        {/* Info */}
        <p className="text-xs text-text-muted text-center mt-4">
          You'll be redirected to NOWPayments to complete your secure payment.
        </p>
      </div>
    </div>
  );
}

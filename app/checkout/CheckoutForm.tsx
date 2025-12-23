'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { CheckCircleIcon, ArrowLeftIcon, ShieldCheckIcon, SparklesIcon } from '@heroicons/react/24/solid';
import { plans, type Plan } from '@/lib/plans';

export function CheckoutForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const planId = searchParams?.get('plan') || 'plan_12m';
  
  const [plan, setPlan] = useState<Plan | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [region, setRegion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const selectedPlan = plans.find(p => p.id === planId);
    setPlan(selectedPlan || plans[2]); // Default to 12m if not found
  }, [planId]);

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

      if (!plan) {
        throw new Error('Plan not found');
      }

      // Save customer data
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          region: region.trim(),
          planId: plan.id,
          planName: plan.name,
          planPrice: plan.priceUsd
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save customer data');
      }

      const data = await response.json();

      // Redirect to NOWPayments
      const paymentLinks: Record<string, string> = {
        'plan_3m': 'https://nowpayments.io/payment/?iid=6334134208',
        'plan_6m': 'https://nowpayments.io/payment/?iid=6035616621',
        'plan_12m': 'https://nowpayments.io/payment/?iid=5981936582'
      };

      const paymentUrl = paymentLinks[plan.id];
      if (paymentUrl) {
        window.location.href = `${paymentUrl}&ref=${data.customerId}`;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  if (!plan) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-surface pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-text-muted hover:text-primary transition-colors mb-8"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          Back to Home
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Plan Details */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-border/50 bg-surface/50 backdrop-blur-sm p-8 shadow-xl mb-8">
              {/* Plan Header */}
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-sm font-semibold text-primary mb-4">
                  <ShieldCheckIcon className="h-4 w-4" />
                  Selected Plan
                </div>
                <h1 className="text-4xl font-black text-text mb-2">{plan.name}</h1>
                
                {/* Price Display */}
                <div className="flex items-baseline gap-2 mb-8">
                  <span className="text-5xl font-black text-primary">${plan.priceUsd}</span>
                  <span className="text-text-muted">/year</span>
                </div>

                {/* Instant Activation Badge */}
                <div className="inline-flex items-center gap-2 rounded-lg bg-green-500/10 border border-green-500/30 px-4 py-2 text-sm font-semibold text-green-400">
                  <CheckCircleIcon className="h-5 w-5" />
                  Instant Activation After Payment
                </div>
              </div>

              {/* Plan Features */}
              <div className="border-t border-border/50 pt-8">
                <h2 className="text-xl font-bold text-text mb-6">What's Included</h2>
                <ul className="space-y-4">
                  {plan.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1">
                        <CheckCircleIcon className="h-5 w-5 text-primary" />
                      </div>
                      <span className="text-text-muted">{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Additional Benefits */}
              <div className="border-t border-border/50 pt-8 mt-8">
                <h2 className="text-xl font-bold text-text mb-6">Additional Benefits</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { icon: '🌍', title: 'Global Access', desc: 'Thousands of channels worldwide' },
                    { icon: '⚡', title: 'Ultra HD Quality', desc: '4K crystal-clear streaming' },
                    { icon: '🔒', title: 'Secure Payment', desc: 'Encrypted crypto transactions' },
                    { icon: '📱', title: 'Multi-Device', desc: 'Watch on phone, tablet, TV' },
                    { icon: '🎬', title: 'Instant Activation', desc: 'Start watching immediately' },
                    { icon: '💬', title: '24/7 Support', desc: 'Expert help anytime' }
                  ].map((benefit) => (
                    <div key={benefit.title} className="rounded-lg bg-surface/50 p-4 border border-border/50">
                      <div className="text-2xl mb-2">{benefit.icon}</div>
                      <h3 className="font-semibold text-text">{benefit.title}</h3>
                      <p className="text-sm text-text-muted mt-1">{benefit.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Methods */}
              <div className="border-t border-border/50 pt-8 mt-8">
                <h2 className="text-xl font-bold text-text mb-4">Payment Methods</h2>
                <p className="text-text-muted mb-4">We securely accept cryptocurrency payments via NOWPayments:</p>
                <div className="flex flex-wrap gap-3">
                  {['Bitcoin', 'Ethereum', 'USDT', 'USDC', 'BNB', 'XRP'].map((method) => (
                    <div key={method} className="rounded-lg bg-primary/10 border border-primary/30 px-4 py-2 text-sm font-medium text-primary">
                      {method}
                    </div>
                  ))}
                </div>
              </div>

              {/* Money Back Guarantee */}
              <div className="border-t border-border/50 pt-8 mt-8 bg-green-500/5 rounded-lg p-6 border border-green-500/20">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <ShieldCheckIcon className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-green-400 mb-1">30-Day Money Back Guarantee</h3>
                    <p className="text-sm text-text-muted">Not satisfied? Get a full refund within 30 days, no questions asked.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Checkout Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-border/50 bg-surface/50 backdrop-blur-sm p-8 shadow-xl">
              <h2 className="text-2xl font-bold text-text mb-6">Complete Your Order</h2>

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
                    placeholder="John Doe"
                    className="w-full rounded-lg border border-border/50 bg-surface/50 px-4 py-3 text-text placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
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
                    className="w-full rounded-lg border border-border/50 bg-surface/50 px-4 py-3 text-text placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
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
                    placeholder="e.g., United States"
                    className="w-full rounded-lg border border-border/50 bg-surface/50 px-4 py-3 text-text placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                    disabled={loading}
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-4">
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                )}

                {/* Order Summary */}
                <div className="border-t border-border/50 pt-4 mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-text-muted">Subtotal</span>
                    <span className="text-text font-medium">${plan.priceUsd}</span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-text-muted">Tax</span>
                    <span className="text-text font-medium">$0 (Crypto)</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-border/50 pt-4 font-bold text-lg">
                    <span className="text-text">Total</span>
                    <span className="text-primary">${plan.priceUsd}</span>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-gradient-to-r from-primary to-secondary px-4 py-3.5 text-white font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                >
                  {loading ? 'Processing...' : 'Proceed to Payment'}
                </button>

                {/* Secure Badge */}
                <div className="flex items-center justify-center gap-2 text-xs text-text-muted mt-4">
                  <SparklesIcon className="h-4 w-4" />
                  Secure cryptocurrency checkout
                </div>

                {/* Info */}
                <p className="text-xs text-text-muted text-center mt-4">
                  You'll be redirected to NOWPayments to complete your secure payment in your preferred cryptocurrency.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

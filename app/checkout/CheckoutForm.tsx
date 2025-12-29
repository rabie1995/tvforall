'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { CheckCircleIcon, ArrowLeftIcon, ShieldCheckIcon, SparklesIcon } from '@heroicons/react/24/solid';
import { plans, type Plan } from '@/lib/plans';
import { trackEvent } from '@/lib/analytics';

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
      const subscriptionLinks: Record<string, string> = {
        plan_3m: 'https://nowpayments.io/payment/?iid=6334134208',
        plan_6m: 'https://nowpayments.io/payment/?iid=6035616621',
        plan_12m: 'https://nowpayments.io/payment/?iid=5981936582'
      };

      const subscriptionUrl = subscriptionLinks[plan.id];
      if (!subscriptionUrl) {
        throw new Error('Subscription link unavailable');
      }

      let ref = 'guest';

      trackEvent('subscription_checkout_started', {
        plan_id: plan.id,
        plan_name: plan.name,
        plan_duration_months: plan.durationMonths,
        price_usd: plan.priceUsd
      });

      try {
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
        ref = data.customerId || ref;
      } catch (requestError) {
        // Continue to payment even if saving fails
        console.error('Checkout save error:', requestError);
        setError('We could not save your info, but you can still subscribe securely.');
      }

      trackEvent('subscription_started', {
        plan_id: plan.id,
        plan_name: plan.name,
        plan_duration_months: plan.durationMonths,
        price_usd: plan.priceUsd,
        reference: ref
      });

      window.location.href = `${subscriptionUrl}&ref=${encodeURIComponent(ref)}`;
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

        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10">
          {/* Left: Plan Details */}
          <div className="order-2 lg:order-1">
            <div className="rounded-2xl border border-border/50 bg-surface/50 backdrop-blur-sm p-7 shadow-lg mb-10">
              {/* Plan Header */}
              <div className="mb-7">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-semibold text-primary mb-3">
                  <ShieldCheckIcon className="h-4 w-4" />
                  Selected Plan
                </div>
                <h1 className="text-3xl font-black text-text mb-2">{plan.name}</h1>
                
                {/* Price Display */}
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-4xl font-black text-primary">${plan.priceUsd}</span>
                  <span className="text-text-muted/80">/year</span>
                </div>

                {/* Instant Activation Badge */}
                <div className="inline-flex items-center gap-2 rounded-lg bg-green-500/10 border border-green-500/30 px-3.5 py-2 text-xs font-semibold text-green-400">
                  <CheckCircleIcon className="h-4 w-4" />
                  Instant Activation After Subscription Confirmation
                </div>
              </div>

              {/* Plan Features */}
              <div className="border-t border-border/50 pt-7">
                <h2 className="text-lg font-bold text-text mb-5">What's Included</h2>
                <ul className="space-y-3.5">
                  {plan.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1">
                        <CheckCircleIcon className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-text-muted/80">{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Additional Benefits */}
              <div className="border-t border-border/50 pt-7 mt-7">
                <h2 className="text-lg font-bold text-text mb-5">Additional Benefits</h2>
                <div className="grid sm:grid-cols-2 gap-3.5">
                  {[
                    { icon: '🌍', title: 'Global Access', desc: 'Thousands of channels worldwide' },
                    { icon: '⚡', title: 'Ultra HD Quality', desc: '4K crystal-clear streaming' },
                    { icon: '🔒', title: 'Secure Subscription Billing', desc: 'Encrypted crypto transactions' },
                    { icon: '📱', title: 'Multi-Device', desc: 'Watch on phone, tablet, TV' },
                    { icon: '🎬', title: 'Instant Activation', desc: 'Start watching immediately' },
                    { icon: '💬', title: '24/7 Support', desc: 'Expert help anytime' }
                  ].map((benefit) => (
                    <div key={benefit.title} className="rounded-lg bg-surface/50 p-3.5 border border-border/50">
                      <div className="text-xl mb-1.5">{benefit.icon}</div>
                      <h3 className="font-semibold text-text text-sm">{benefit.title}</h3>
                      <p className="text-xs text-text-muted/80 mt-1">{benefit.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Subscription Billing */}
              <div className="border-t border-border/50 pt-7 mt-7">
                <h2 className="text-lg font-bold text-text mb-3.5">Subscription Billing</h2>
                <p className="text-text-muted/80 mb-3.5">We securely accept cryptocurrency subscriptions via NOWPayments:</p>
                <div className="flex flex-wrap gap-2.5">
                  {['Bitcoin', 'Ethereum', 'USDT', 'USDC', 'BNB', 'XRP'].map((method) => (
                    <div key={method} className="rounded-lg bg-primary/10 border border-primary/30 px-3.5 py-2 text-xs font-semibold text-primary">
                      {method}
                    </div>
                  ))}
                </div>
              </div>

              {/* Money Back Guarantee */}
              <div className="border-t border-border/50 pt-7 mt-7 bg-green-500/5 rounded-lg p-5 border border-green-500/20">
                <div className="flex gap-3.5">
                  <div className="flex-shrink-0">
                    <ShieldCheckIcon className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-green-400 mb-1 text-sm">30-Day Money Back Guarantee</h3>
                    <p className="text-xs text-text-muted/80">Not satisfied? Get a full refund within 30 days, no questions asked.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Checkout Form */}
          <div className="order-1 lg:order-2">
            <div className="sticky top-20 rounded-2xl border border-border/50 bg-surface/60 backdrop-blur-lg p-10 shadow-2xl shadow-primary/25">
              <h2 className="text-3xl font-bold text-text mb-7">Complete Your Subscription</h2>

              <form onSubmit={handleSubmit} className="space-y-5">
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
                    className="w-full rounded-lg border border-border/50 bg-surface/50 px-4 py-3.5 text-text placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
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
                    className="w-full rounded-lg border border-border/50 bg-surface/50 px-4 py-3.5 text-text placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
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
                    className="w-full rounded-lg border border-border/50 bg-surface/50 px-4 py-3.5 text-text placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
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
                <div className="border-t border-border/50 pt-4 mt-4 space-y-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-text-muted/80">Subtotal</span>
                    <span className="text-text font-medium">${plan.priceUsd}</span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-text-muted/80">Tax</span>
                    <span className="text-text font-medium text-sm">$0 (Crypto)</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-border/50 pt-4 font-bold text-xl">
                    <span className="text-text">Total</span>
                    <span className="text-primary">${plan.priceUsd}</span>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-gradient-to-r from-primary to-secondary px-5 py-4 text-white font-semibold text-base hover:shadow-xl hover:shadow-primary/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                >
                  {loading ? 'Processing...' : 'Confirm Subscription'}
                </button>

                {/* Secure Badge */}
                <div className="flex items-center justify-center gap-2 text-xs text-text-muted/80 mt-3">
                  <SparklesIcon className="h-4 w-4" />
                  Secure cryptocurrency subscription checkout
                </div>

                {/* Info */}
                <p className="text-xs text-text-muted/80 text-center mt-3">
                  You'll be redirected to NOWPayments to complete your secure subscription in your preferred cryptocurrency.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

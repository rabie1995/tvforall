'use client';

import { CheckCircleIcon, StarIcon, CalendarIcon, SparklesIcon, FireIcon, BoltIcon, TrophyIcon, PaperAirplaneIcon, ShieldCheckIcon } from '@heroicons/react/24/solid';
import { plans, type Plan } from '@/lib/plans';
import { CURRENT_PROMO, hasActivePromo } from '@/lib/promo';
import { useState, useEffect } from 'react';

const planIcons: Record<string, React.ReactNode> = {
  'plan_3m': <CalendarIcon className="h-6 w-6" />,
  'plan_6m': <BoltIcon className="h-6 w-6" />,
  'plan_12m': <TrophyIcon className="h-6 w-6" />
};

// Simple reusable pricing card component for subscription plans
export function PricingCard({ plan }: { plan: Plan }) {
  const icon = planIcons[plan.id] || <SparklesIcon className="h-6 w-6" />;
  const [isPromoActive, setIsPromoActive] = useState(false);

  useEffect(() => {
    // Check if this plan has active promo
    setIsPromoActive(hasActivePromo(plan.id));

    // Update every second to handle promo expiration
    const interval = setInterval(() => {
      setIsPromoActive(hasActivePromo(plan.id));
    }, 1000);

    return () => clearInterval(interval);
  }, [plan.id]);

  const displayPrice = isPromoActive ? CURRENT_PROMO.promoPrice : plan.priceUsd;
  const hasDiscount = isPromoActive && CURRENT_PROMO.originalPrice > CURRENT_PROMO.promoPrice;

  return (
    <div className={`group relative rounded-2xl border border-border/50 bg-surface/50 backdrop-blur-sm p-8 shadow-xl shadow-primary/5 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/15 hover:border-primary/30 hover:scale-105 animate-fade-in ${plan.popular ? 'ring-2 ring-primary shadow-primary/20' : ''} ${isPromoActive ? 'ring-2 ring-accent shadow-accent/20' : ''}`}>
      {/* Gradient overlay for popular plans */}
      {plan.popular && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 opacity-50"></div>
      )}

      {isPromoActive ? (
        <span className="absolute -top-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent to-orange-500 px-4 py-2 text-sm font-bold text-white shadow-xl animate-bounce-subtle">
          <FireIcon className="h-4 w-4" />
          {CURRENT_PROMO.label}
        </span>
      ) : plan.popular ? (
        <span className="absolute -top-4 right-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-secondary px-4 py-2 text-sm font-bold text-white shadow-xl">
          <StarIcon className="h-4 w-4" />
          Most Popular
        </span>
      ) : null}

      <div className="relative flex items-start justify-between mb-6">
        <div>
          <div className={`mb-4 inline-flex rounded-2xl ${plan.popular ? 'bg-gradient-to-br from-primary to-secondary' : 'bg-gradient-to-br from-surface to-surface/80'} p-4 text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            {icon}
          </div>
          <h3 className="text-2xl font-bold text-text mb-2">{plan.name}</h3>
          <p className="text-sm text-text-muted">Instant activation • No hidden fees</p>
        </div>
        <div className="text-right">
          {hasDiscount && (
            <p className="text-sm text-text-muted/60 line-through">${CURRENT_PROMO.originalPrice}</p>
          )}
          <p className={`text-4xl font-bold ${isPromoActive ? 'text-accent' : 'text-primary'}`}>
            ${displayPrice}
          </p>
          {isPromoActive && (
            <p className="text-sm font-bold text-accent">
              Save ${CURRENT_PROMO.originalPrice - CURRENT_PROMO.promoPrice}!
            </p>
          )}
        </div>
      </div>

      <ul className="mb-8 space-y-3 text-sm text-text-muted">
        {plan.perks.map((perk) => (
          <li key={perk} className="flex items-center gap-3">
            <CheckCircleIcon className="h-5 w-5 flex-shrink-0 text-green-500" />
            <span>{perk}</span>
          </li>
        ))}
      </ul>

      <a
        href={`/checkout?plan=${plan.id}`}
        className={`inline-flex w-full items-center justify-center gap-3 rounded-xl px-6 py-4 text-lg font-bold text-white shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer ${plan.popular ? 'bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-primary/25' : 'bg-gradient-to-r from-surface to-surface/80 hover:from-primary hover:to-secondary'}`}
      >
        <PaperAirplaneIcon className="h-5 w-5" />
        Start Streaming Now
      </a>

      <div className="mt-4 flex items-center justify-center gap-4 text-xs text-text-muted">
        <div className="flex items-center gap-1">
          <ShieldCheckIcon className="h-4 w-4 text-green-500" />
          Secure Payment
        </div>
        <div className="flex items-center gap-1">
          <SparklesIcon className="h-4 w-4 text-blue-500" />
          24/7 Support
        </div>
      </div>
    </div>
  );
}

export function PricingGrid() {
  return (
    <div className="grid gap-8 md:grid-cols-3">
      {plans.map((plan, index) => (
        <div key={plan.id} style={{ animationDelay: `${index * 200}ms` }}>
          <PricingCard plan={plan} />
        </div>
      ))}
    </div>
  );
}

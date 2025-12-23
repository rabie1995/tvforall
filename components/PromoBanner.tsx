'use client';

import { useState, useEffect } from 'react';
import { ClockIcon, FireIcon } from '@heroicons/react/24/solid';
import { CountdownTimer } from './CountdownTimer';
import { CURRENT_PROMO, isPromoActive } from '@/lib/promo';

export function PromoBanner() {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Check promo status on mount and set up interval
    setIsActive(isPromoActive());
    
    const interval = setInterval(() => {
      setIsActive(isPromoActive());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleExpire = () => {
    setIsActive(false);
  };

  if (!isActive) return null;

  return (
    <div className="mx-auto mb-6 max-w-2xl">
      <div className="relative overflow-hidden rounded-2xl border border-orange/20 bg-gradient-to-r from-orange/10 via-orange/5 to-transparent p-4 shadow-sm">
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange/20">
              <FireIcon className="h-5 w-5 text-orange" />
            </div>
            <div>
              <p className="text-sm font-semibold text-navy" style={{ fontFamily: 'var(--font-poppins)' }}>
                Hot deal 🔥 Only 24 hours left
              </p>
              <p className="text-xs text-slate-600">{CURRENT_PROMO.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ClockIcon className="h-4 w-4 text-orange" />
            <CountdownTimer 
              endDate={CURRENT_PROMO.endDate} 
              onExpire={handleExpire}
              className="text-orange"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

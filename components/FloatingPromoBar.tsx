'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon, SparklesIcon } from '@heroicons/react/24/solid';
import { CountdownTimer } from './CountdownTimer';
import { CURRENT_PROMO, isPromoActive } from '@/lib/promo';
import Link from 'next/link';

export function FloatingPromoBar() {
  const [isActive, setIsActive] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check promo status on mount
    setIsActive(isPromoActive());
    
    // Check if user dismissed it in this session
    const dismissed = sessionStorage.getItem('promo-dismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
    }
    
    const interval = setInterval(() => {
      setIsActive(isPromoActive());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('promo-dismissed', 'true');
  };

  const handleExpire = () => {
    setIsActive(false);
  };

  if (!isActive || isDismissed) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-orange to-orange/90 text-white shadow-lg">
      <div className="mx-auto max-w-6xl px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <SparklesIcon className="h-5 w-5 flex-shrink-0" />
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
              <span className="text-sm font-semibold" style={{ fontFamily: 'var(--font-poppins)' }}>
                Limited-time offer:
              </span>
              <span className="text-xs sm:text-sm">
                Get 1 Year for <strong>59 USDT</strong> (was 89 USDT)
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <CountdownTimer 
              endDate={CURRENT_PROMO.endDate} 
              onExpire={handleExpire}
              className="hidden text-white sm:flex"
            />
            <Link 
              href="/#plans"
              className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-orange transition hover:bg-slate-100"
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              Get it now
            </Link>
            <button
              onClick={handleDismiss}
              className="rounded p-1 transition hover:bg-white/20"
              aria-label="Dismiss promo"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

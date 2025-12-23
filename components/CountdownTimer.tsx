'use client';

import { useEffect, useState } from 'react';

interface CountdownTimerProps {
  endDate: Date;
  onExpire?: () => void;
  className?: string;
}

export function CountdownTimer({ endDate, onExpire, className = '' }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const end = endDate.getTime();
      const difference = end - now;
      
      if (difference <= 0) {
        onExpire?.();
        return 0;
      }
      
      return difference;
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);
      
      if (remaining <= 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate, onExpire]);

  if (timeLeft <= 0) return null;

  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  return (
    <div className={`flex items-center gap-1 font-mono text-sm ${className}`}>
      <span className="flex items-center justify-center rounded bg-navy/10 px-2 py-1 font-bold tabular-nums">
        {String(hours).padStart(2, '0')}
      </span>
      <span className="font-bold">:</span>
      <span className="flex items-center justify-center rounded bg-navy/10 px-2 py-1 font-bold tabular-nums">
        {String(minutes).padStart(2, '0')}
      </span>
      <span className="font-bold">:</span>
      <span className="flex items-center justify-center rounded bg-navy/10 px-2 py-1 font-bold tabular-nums">
        {String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
}

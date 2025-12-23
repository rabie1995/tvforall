import React from 'react';

interface LogoProps {
  className?: string;
  animated?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className = '', animated = false, size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl'
  };

  return (
    <div className={`flex items-center gap-3 font-bold ${className}`}>
      {/* Logo Icon */}
      <div className={`relative ${sizeClasses[size]} ${animated ? 'animate-bounce-subtle' : ''}`}>
        <svg
          viewBox="0 0 32 32"
          fill="none"
          className="h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer ring */}
          <circle
            cx="16"
            cy="16"
            r="14"
            stroke="currentColor"
            strokeWidth="2"
            className="text-primary"
          />

          {/* Inner play button */}
          <path
            d="M12 10L22 16L12 22V10Z"
            fill="currentColor"
            className="text-primary"
          />

          {/* Animated signal waves */}
          {animated && (
            <>
              <circle
                cx="16"
                cy="16"
                r="16"
                stroke="currentColor"
                strokeWidth="1"
                className="text-primary/30 animate-ping"
                style={{ animationDelay: '0s', animationDuration: '3s' }}
              />
              <circle
                cx="16"
                cy="16"
                r="20"
                stroke="currentColor"
                strokeWidth="1"
                className="text-primary/20 animate-ping"
                style={{ animationDelay: '1s', animationDuration: '3s' }}
              />
            </>
          )}
        </svg>

        {/* Glow effect */}
        {animated && (
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-md animate-pulse-glow" />
        )}
      </div>

      {/* Brand Text */}
      <div className={`flex flex-col ${textSizeClasses[size]}`}>
        <span className="text-text font-black tracking-tight">TVFORALL</span>
        <span className="text-text-muted text-xs font-medium tracking-wider">STREAMING</span>
      </div>
    </div>
  );
}

// Compact version for mobile/small spaces
export function LogoCompact({ className = '', animated = false }: Omit<LogoProps, 'size'>) {
  return (
    <div className={`flex items-center gap-2 font-bold ${className}`}>
      <div className={`relative h-6 w-6 ${animated ? 'animate-bounce-subtle' : ''}`}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="2"
            className="text-primary"
          />
          <path
            d="M9 8L15 12L9 16V8Z"
            fill="currentColor"
            className="text-primary"
          />
        </svg>
      </div>
      <span className="text-text font-black text-lg tracking-tight">TVFORALL</span>
    </div>
  );
}
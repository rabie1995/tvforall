"use client";

import Link from 'next/link';
import { useMemo } from 'react';

export default function TelegramSupportButton() {
  const telegramUrl = useMemo(() => 'https://t.me/myiptv99', []);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Link
        href={telegramUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact support via Telegram"
        className="group relative flex items-center gap-3 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 px-4 py-3 text-white shadow-xl shadow-cyan-500/30 hover:shadow-cyan-400/50 transition-all duration-200 hover:translate-y-[-2px] hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400 focus:ring-offset-white"
      >
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm border border-white/20 group-hover:border-white/40 transition-all duration-200">
          <svg
            viewBox="0 0 240 240"
            className="h-5 w-5 text-white drop-shadow"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M120 0C53.73 0 0 53.73 0 120c0 66.27 53.73 120 120 120s120-53.73 120-120C240 53.73 186.27 0 120 0zm57.5 76.8l-20.4 96.4c-1.5 6.7-5.5 8.4-11.1 5.2l-30.6-22.6-14.8 14.3c-1.6 1.6-3 3-6.1 3l2.2-31.5 57.4-51.8c2.5-2.2-0.5-3.4-3.9-1.2l-71 44.7-30.6-9.6c-6.6-2.1-6.7-6.6 1.4-9.8l119.5-46.1c5.5-2 10.4 1.3 8.6 9.6z" />
          </svg>
        </span>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold">Support</span>
          <span className="text-xs text-white/80">Chat on Telegram</span>
        </div>
        <span className="absolute inset-0 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" aria-hidden="true" />
      </Link>
    </div>
  );
}

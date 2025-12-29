'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { hasAnalytics, trackEvent, trackPageView, trackSectionView } from '@/lib/analytics';

const sectionEvents = [
  { id: 'plans', event: 'pricing' },
  { id: 'features', event: 'features' },
  { id: 'benefits', event: 'benefits' },
  { id: 'support', event: 'support_cta' }
];

export function AnalyticsProvider() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const trackedSections = useRef<Set<string>>(new Set());

  useEffect(() => {
    const pagePath = `${pathname}${searchParams?.toString() ? `?${searchParams.toString()}` : ''}`;
    trackPageView(pagePath);
    trackEvent('cta_primary_impression', { page_path: pagePath });
  }, [pathname, searchParams]);

  useEffect(() => {
    if (!hasAnalytics()) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const targetId = entry.target.id;
          if (trackedSections.current.has(targetId)) return;
          trackedSections.current.add(targetId);
          const section = sectionEvents.find((s) => s.id === targetId);
          if (section) {
            trackSectionView(section.event, { section_id: targetId });
          }
        });
      },
      { threshold: 0.4 }
    );

    sectionEvents.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}

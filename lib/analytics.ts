export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || process.env.NEXT_PUBLIC_GA_ID || '';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const hasWindow = typeof window !== 'undefined';

export const hasAnalytics = () => hasWindow && typeof window.gtag === 'function' && Boolean(GA_MEASUREMENT_ID);

export const trackEvent = (event: string, params: Record<string, unknown> = {}) => {
  if (!hasAnalytics()) return;
  window.gtag?.('event', event, params);
};

export const trackPageView = (path: string) => {
  if (!hasAnalytics()) return;
  window.gtag?.('event', 'page_view', { page_path: path });
};

export const trackSectionView = (section: string, params: Record<string, unknown> = {}) => {
  trackEvent(`view_${section}`, params);
};

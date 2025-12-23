// Promo configuration - easy to enable/disable and edit
export interface PromoConfig {
  enabled: boolean;
  productId: string; // Which plan gets the promo
  originalPrice: number;
  promoPrice: number;
  startDate: Date;
  endDate: Date;
  label: string;
  description: string;
}

// PROMO CONFIGURATION - Edit here to change promo details
export const CURRENT_PROMO: PromoConfig = {
  enabled: true,
  productId: 'plan_12m', // 1 Year plan
  originalPrice: 89,
  promoPrice: 59,
  startDate: new Date('2025-12-22T00:00:00'), // Start date
  endDate: new Date('2025-12-23T00:00:00'), // 24 hours later
  label: 'HOT SELL',
  description: 'Save big on our 1-year plan',
};

// Check if promo is currently active
export function isPromoActive(): boolean {
  if (!CURRENT_PROMO.enabled) return false;
  
  const now = new Date();
  return now >= CURRENT_PROMO.startDate && now < CURRENT_PROMO.endDate;
}

// Get time remaining in milliseconds
export function getPromoTimeRemaining(): number {
  if (!isPromoActive()) return 0;
  
  const now = new Date();
  return CURRENT_PROMO.endDate.getTime() - now.getTime();
}

// Check if a specific product has active promo
export function hasActivePromo(productId: string): boolean {
  return isPromoActive() && CURRENT_PROMO.productId === productId;
}

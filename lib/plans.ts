export type Plan = {
  id: string;
  name: string;
  durationMonths: number;
  priceUsd: number;
  popular?: boolean;
  perks: string[];
};

export const plans: Plan[] = [
  {
    id: 'plan_12m',
    name: '12 Months',
    durationMonths: 12,
    priceUsd: 59,
    popular: true,
    perks: ['4K & HD channels', 'Anti-freeze streams', '24/7 support', 'Up to 2 devices']
  },
  {
    id: 'plan_6m',
    name: '6 Months',
    durationMonths: 6,
    priceUsd: 39,
    perks: ['Full VOD library', 'Sports & PPV included', '24/7 support']
  },
  {
    id: 'plan_3m',
    name: '3 Months',
    durationMonths: 3,
    priceUsd: 29,
    perks: ['Instant activation', 'USDT payments', '24/7 support']
  }
];

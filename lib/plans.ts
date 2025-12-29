export type Plan = {
  id: string;
  name: string;
  durationMonths: number;
  priceUsd: number;
  popular?: boolean;
  billingCycle: string;
  renewalPolicy: string;
  accessWindow: string;
  perks: string[];
};

export const plans: Plan[] = [
  {
    id: 'plan_12m',
    name: '12 Months',
    durationMonths: 12,
    priceUsd: 59,
    popular: true,
    billingCycle: 'Annual subscription (12 months)',
    renewalPolicy: 'Auto-renews yearly; cancel anytime before renewal.',
    accessWindow: 'Full access for 12 months',
    perks: ['4K & HD channels', 'Anti-freeze streams', '24/7 support', 'Up to 2 devices', 'Includes live sports & series']
  },
  {
    id: 'plan_6m',
    name: '6 Months',
    durationMonths: 6,
    priceUsd: 39,
    billingCycle: '6-month subscription',
    renewalPolicy: 'Renews every 6 months; pause or cancel anytime.',
    accessWindow: 'Full access for 6 months',
    perks: ['Full VOD library', 'Sports & PPV included', '24/7 support', 'Priority event access']
  },
  {
    id: 'plan_3m',
    name: '3 Months',
    durationMonths: 3,
    priceUsd: 29,
    billingCycle: 'Quarterly subscription',
    renewalPolicy: 'Renews every 3 months; cancel anytime.',
    accessWindow: 'Full access for 3 months',
    perks: ['Instant activation', 'Flexible quarterly billing', '24/7 support', 'Live sports + movies']
  }
];

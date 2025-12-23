# Promotional Campaign System

## Overview
The website includes a flexible promotional campaign system that can display limited-time offers with countdown timers.

## Components

### 1. **Promo Configuration** (`lib/promo.ts`)
Central configuration file for managing promotions.

**To enable/disable a promo:**
```typescript
enabled: true, // Set to false to disable
```

**To change promo details:**
```typescript
productId: 'plan_12m', // Which plan gets the discount
originalPrice: 89,
promoPrice: 59,
startDate: new Date('2025-12-22T00:00:00'),
endDate: new Date('2025-12-23T00:00:00'), // 24 hours later
label: 'HOT SELL',
description: 'Save big on our 1-year plan',
```

### 2. **FloatingPromoBar** (`components/FloatingPromoBar.tsx`)
Orange banner at the top of the page with countdown timer.
- Auto-dismissible (stored in sessionStorage)
- Links to pricing section
- Shows time remaining

### 3. **PromoBanner** (`components/PromoBanner.tsx`)
Promo banner displayed in the Hero section.
- Friendly design with fire icon
- Countdown timer
- Matches brand colors

### 4. **CountdownTimer** (`components/CountdownTimer.tsx`)
Reusable countdown component.
- Updates every second
- Format: HH : MM : SS
- Auto-expires when time reaches zero

### 5. **Enhanced PricingCard** (`components/PricingCard.tsx`)
Subscription cards with promo support.
- Shows crossed-out original price
- Highlights discounted price in orange
- "HOT SELL" badge with fire icon
- Orange ring around promo card

## How It Works

1. **Time-based activation**: Promo automatically appears/disappears based on start/end dates
2. **Real-time countdown**: Updates every second across all components
3. **Auto-expiration**: When countdown reaches zero, promo disappears and prices revert
4. **Easy management**: All settings in one config file (`lib/promo.ts`)

## Testing Locally

```bash
npm run dev
```

Open http://localhost:3003 and you should see:
- Orange floating promo bar at the top
- Promo banner in Hero section
- 1 Year plan card with "HOT SELL" badge
- Crossed-out original price ($89)
- Discounted price in orange ($59)
- Countdown timer showing time remaining

## Customization

### Change Promo Duration
Edit `endDate` in `lib/promo.ts`:
```typescript
endDate: new Date('2025-12-23T00:00:00'), // 24 hours
// or
endDate: new Date('2025-12-30T00:00:00'), // 7 days
```

### Change Which Plan Gets Promo
```typescript
productId: 'plan_3m', // 3 months
// or
productId: 'plan_6m', // 6 months
// or
productId: 'plan_12m', // 12 months
```

### Disable Floating Bar Only
Remove or comment out in `app/page.tsx`:
```typescript
// <FloatingPromoBar />
```

### Change Promo Colors
Edit badge colors in `PricingCard.tsx` (currently using `orange` from theme)

## Design System

**Colors:**
- Promo accent: Orange (#F97316)
- Countdown bg: Navy/10 opacity
- Badge: Orange with white text

**Animations:**
- HOT SELL badge: Pulse animation
- Cards: Ring highlight on hover

**Typography:**
- Poppins font for promo text
- Monospace for countdown timer

## Mobile Responsive

✅ Floating bar stacks properly on mobile
✅ Countdown timer hides on small screens in floating bar
✅ Promo banner adjusts to mobile layout
✅ Pricing cards stack vertically on mobile

## Session Management

- Floating promo bar dismissal stored in `sessionStorage`
- Reappears on new browser session
- Respects user's preference during current session

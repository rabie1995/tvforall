/**
 * CHECKOUT API DISABLED
 * 
 * This API endpoint is no longer used.
 * The site now uses DIRECT payment links to NOWPayments.
 * 
 * Payment Links:
 * - 3 Months: https://nowpayments.io/payment/?iid=6334134208
 * - 6 Months: https://nowpayments.io/payment/?iid=6035616621
 * - 12 Months: https://nowpayments.io/payment/?iid=5981936582
 */

export const runtime = "nodejs";

import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'disabled',
    message: 'Checkout API is disabled. Site uses direct NOWPayments links.',
    paymentLinks: {
      plan_3m: 'https://nowpayments.io/payment/?iid=6334134208',
      plan_6m: 'https://nowpayments.io/payment/?iid=6035616621',
      plan_12m: 'https://nowpayments.io/payment/?iid=5981936582',
    }
  });
}

export async function POST() {
  return NextResponse.json(
    {
      success: false,
      error: 'Checkout API is disabled. Please use direct payment links from the homepage.',
    },
    { status: 410 } // 410 Gone
  );
}

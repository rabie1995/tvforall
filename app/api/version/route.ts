import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    version: 'v2.0-static-links',
    timestamp: new Date().toISOString(),
    commit: '850c0f5',
    checkout_method: 'static-invoice-links',
    invoice_links: {
      plan_3m: 'https://nowpayments.io/payment/?iid=6334134208',
      plan_6m: 'https://nowpayments.io/payment/?iid=6035616621',
      plan_12m: 'https://nowpayments.io/payment/?iid=5981936582',
    },
    status: 'active'
  });
}

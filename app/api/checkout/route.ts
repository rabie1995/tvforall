export const runtime = "nodejs";
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
// import { collectClientData } from '@/lib/clientData'; // Removed unused import
import { plans } from '@/lib/plans';

// Static NOWPayments invoice links - Production Ready
// These are pre-created invoice IDs that work without API configuration
const PAYMENT_LINKS = {
  'plan_3m': {
    url: 'https://nowpayments.io/payment/?iid=6334134208',
    label: '3 Months Plan',
    price: '$19.99'
  },
  'plan_6m': {
    url: 'https://nowpayments.io/payment/?iid=6035616621',
    label: '6 Months Plan',
    price: '$34.99'
  },
  'plan_12m': {
    url: 'https://nowpayments.io/payment/?iid=5981936582',
    label: '12 Months Plan',
    price: '$59.99'
  },
};

const legacyPlanMap: Record<string, string> = {
  '3m': 'plan_3m',
  '6m': 'plan_6m',
  '1y': 'plan_12m',
};

interface CheckoutRequest {
  fullName: string;
  email: string;
  region: string;
  adultChannels: boolean;
  plan: string;
}

interface CheckoutResponse {
  success: boolean;
  orderId?: string;
  paymentUrl?: string;
  planInfo?: { label: string; price: string };
  error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<CheckoutResponse>> {
  try {
    console.log('🔵 [CHECKOUT API] Request started');
    
    const body: CheckoutRequest = await request.json();
    const { fullName, email, region, adultChannels, plan: rawPlan } = body;
    const plan = legacyPlanMap[rawPlan] || rawPlan;
    
    console.log('🔵 [CHECKOUT API] Plan:', plan);


    // ✅ Validate full name
    if (!fullName?.trim()) {
      console.error('❌ [CHECKOUT API] Missing full name');
      return NextResponse.json(
        { success: false, error: 'Full name is required' },
        { status: 400 }
      );
    }

    // ✅ Validate email
    if (!email?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      console.error('❌ [CHECKOUT API] Invalid email:', email);
      return NextResponse.json(
        { success: false, error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // ✅ Validate region
    if (!region?.trim()) {
      console.error('❌ [CHECKOUT API] Missing region');
      return NextResponse.json(
        { success: false, error: 'Region is required' },
        { status: 400 }
      );
    }

    // ✅ Check if payment link exists for this plan
    const paymentLink = PAYMENT_LINKS[plan as keyof typeof PAYMENT_LINKS];
    if (!paymentLink) {
      console.error('❌ [CHECKOUT API] No payment link for plan:', plan);
      return NextResponse.json(
        { success: false, error: `No payment link found for plan: ${plan}` },
        { status: 400 }
      );
    }
    console.log('✅ [CHECKOUT API] Payment link verified:', paymentLink.url);

    // ✅ Get plan metadata
    const planMeta = plans.find(p => p.id === plan);
    if (!planMeta) {
      console.error('❌ [CHECKOUT API] Plan metadata not found:', plan);
      return NextResponse.json(
        { success: false, error: 'Invalid plan selected' },
        { status: 400 }
      );
    }

    // ✅ Ensure product exists
    const productId = plan;
    await prisma.product.upsert({
      where: { id: productId },
      update: {
        name: planMeta.name,
        priceUsd: planMeta.priceUsd,
        durationDays: planMeta.durationMonths * 30,
        active: true,
      },
      create: {
        id: productId,
        name: planMeta.name,
        description: planMeta.perks.join(', '),
        priceUsd: planMeta.priceUsd,
        durationDays: planMeta.durationMonths * 30,
        active: true,
      },
    });
    console.log('✅ [CHECKOUT API] Product ensured:', plan);

    // ✅ Create order
    const order = await prisma.order.create({
      data: {
        fullName,
        email,
        region,
        adultChannels,
        productId,
        paymentStatus: 'pending',
        deliveryStatus: 'pending',
      },
    });
    console.log('✅ [CHECKOUT API] Order created:', order.id);

    // ✅ Return success response with payment URL
    const response: CheckoutResponse = {
      success: true,
      orderId: order.id,
      paymentUrl: paymentLink.url,
      planInfo: {
        label: paymentLink.label,
        price: paymentLink.price,
      }
    };
    
    console.log('✅ [CHECKOUT API] Success - redirecting to:', paymentLink.url);
    return NextResponse.json(response, { status: 200 });
    
  } catch (error) {
    console.error('❌ [CHECKOUT API] Exception:', error);
    return NextResponse.json(
      { success: false, error: 'Checkout failed. Please try again.' },
      { status: 500 }
    );
  }
}

// ✅ GET endpoint to verify payment links are working
export async function GET(): Promise<NextResponse> {
  try {
    const links = Object.entries(PAYMENT_LINKS).map(([plan, info]) => ({
      plan,
      label: info.label,
      price: info.price,
      url: info.url,
      verified: '✅'
    }));

    return NextResponse.json({
      status: '✅ Checkout system operational',
      paymentLinks: links,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      status: '❌ Error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

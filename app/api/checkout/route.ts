export const runtime = "nodejs";
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { plans } from '@/lib/plans';

// ====================================================================================================
// PRODUCTION NOWPAYMENTS INTEGRATION
// ====================================================================================================
// This uses REAL NOWPayments API to create payment invoices dynamically
// Environment variables required:
// - NOWPAYMENTS_API_KEY (required for API access)
// - NOWPAYMENTS_IPN_SECRET (required for webhook verification)
// - NEXT_PUBLIC_SITE_URL (required for success/cancel URLs)
// ====================================================================================================

const NOWPAYMENTS_API_URL = 'https://api.nowpayments.io/v1';

// Verify environment variables on startup
console.log('🔐 [CHECKOUT ENV CHECK]');
console.log('  - NOWPAYMENTS_API_KEY:', process.env.NOWPAYMENTS_API_KEY ? '✅ Present' : '❌ MISSING');
console.log('  - NOWPAYMENTS_IPN_SECRET:', process.env.NOWPAYMENTS_IPN_SECRET ? '✅ Present' : '❌ MISSING');
console.log('  - NEXT_PUBLIC_SITE_URL:', process.env.NEXT_PUBLIC_SITE_URL || '❌ MISSING');

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

interface NOWPaymentsInvoice {
  id: string;
  invoice_url: string;
  order_id: string;
  price_amount: number;
  price_currency: string;
  pay_currency?: string;
}

// Create NOWPayments invoice via API
async function createNOWPaymentsInvoice(params: {
  priceAmount: number;
  priceCurrency: string;
  orderId: string;
  orderDescription: string;
  ipnCallbackUrl: string;
  successUrl: string;
  cancelUrl: string;
}): Promise<NOWPaymentsInvoice> {
  const apiKey = process.env.NOWPAYMENTS_API_KEY;
  
  if (!apiKey) {
    throw new Error('NOWPAYMENTS_API_KEY is not configured');
  }

  console.log('🔵 [NOWPAYMENTS] Creating invoice:', {
    amount: params.priceAmount,
    currency: params.priceCurrency,
    orderId: params.orderId
  });

  const response = await fetch(`${NOWPAYMENTS_API_URL}/invoice`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    },
    body: JSON.stringify(params),
  });

  const responseText = await response.text();
  console.log('🔵 [NOWPAYMENTS] Response status:', response.status);
  console.log('🔵 [NOWPAYMENTS] Response body:', responseText);

  if (!response.ok) {
    console.error('❌ [NOWPAYMENTS] API Error:', response.status, responseText);
    throw new Error(`NOWPayments API error: ${response.status} - ${responseText}`);
  }

  const invoice = JSON.parse(responseText) as NOWPaymentsInvoice;
  console.log('✅ [NOWPAYMENTS] Invoice created:', invoice.id);
  
  return invoice;
}

export async function POST(request: NextRequest): Promise<NextResponse<CheckoutResponse>> {
  try {
    console.log('🔵 [CHECKOUT API] Request started');
    
    // Parse and validate request
    const body: CheckoutRequest = await request.json();
    const { fullName, email, region, adultChannels, plan: rawPlan } = body;
    const plan = legacyPlanMap[rawPlan] || rawPlan;
    
    console.log('🔵 [CHECKOUT API] Plan:', plan);
    console.log('🔵 [CHECKOUT API] Customer:', { fullName, email, region, adultChannels });

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

    // ✅ Get plan metadata
    const planMeta = plans.find(p => p.id === plan);
    if (!planMeta) {
      console.error('❌ [CHECKOUT API] Plan metadata not found:', plan);
      return NextResponse.json(
        { success: false, error: 'Invalid plan selected' },
        { status: 400 }
      );
    }

    // ✅ Verify environment variables
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
    if (!baseUrl) {
      console.error('❌ [CHECKOUT API] NEXT_PUBLIC_SITE_URL not configured');
      return NextResponse.json(
        { success: false, error: 'Payment service configuration error. Please contact support.' },
        { status: 500 }
      );
    }

    if (!process.env.NOWPAYMENTS_API_KEY) {
      console.error('❌ [CHECKOUT API] NOWPAYMENTS_API_KEY not configured');
      return NextResponse.json(
        { success: false, error: 'Payment service temporarily unavailable. Please contact support.' },
        { status: 500 }
      );
    }

    // ✅ Ensure product exists in database
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

    // ✅ Create order in database
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

    // ✅ Create NOWPayments invoice
    try {
      const invoice = await createNOWPaymentsInvoice({
        priceAmount: planMeta.priceUsd,
        priceCurrency: 'USD',
        orderId: order.id,
        orderDescription: `TVFORALL - ${planMeta.name} Plan`,
        ipnCallbackUrl: `${baseUrl}/api/webhooks/nowpayments`,
        successUrl: `${baseUrl}/payment/success?order=${order.id}`,
        cancelUrl: `${baseUrl}/payment/cancel?order=${order.id}`,
      });

      // Store NOWPayments invoice ID in order
      await prisma.order.update({
        where: { id: order.id },
        data: { nowpaymentsId: invoice.id },
      });

      console.log('✅ [CHECKOUT API] Payment URL:', invoice.invoice_url);

      // ✅ Return success with payment URL
      return NextResponse.json({
        success: true,
        orderId: order.id,
        paymentUrl: invoice.invoice_url,
        planInfo: {
          label: planMeta.name,
          price: `$${planMeta.priceUsd}`,
        },
      }, { status: 200 });

    } catch (paymentError) {
      console.error('❌ [CHECKOUT API] Payment creation failed:', paymentError);
      
      // Update order with error status
      await prisma.order.update({
        where: { id: order.id },
        data: { 
          paymentStatus: 'failed',
          deliveryStatus: 'failed' 
        },
      });

      const errorMessage = paymentError instanceof Error ? paymentError.message : 'Unknown payment error';
      
      return NextResponse.json(
        { 
          success: false, 
          error: 'Payment service temporarily unavailable. Please try again later or contact support.',
          details: errorMessage
        },
        { status: 503 }
      );
    }
    
  } catch (error) {
    console.error('❌ [CHECKOUT API] Exception:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Checkout failed. Please try again.',
        details: errorMessage
      },
      { status: 500 }
    );
  }
}

// ✅ GET endpoint for testing and verification
export async function GET(): Promise<NextResponse> {
  try {
    const apiKey = process.env.NOWPAYMENTS_API_KEY;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

    return NextResponse.json({
      status: '✅ Checkout system operational',
      configuration: {
        apiKeyConfigured: !!apiKey,
        siteUrlConfigured: !!siteUrl,
        siteUrl: siteUrl || 'NOT_CONFIGURED',
      },
      plans: plans.map(p => ({
        id: p.id,
        name: p.name,
        price: `$${p.priceUsd}`,
        duration: `${p.durationMonths} months`,
      })),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({
      status: '❌ Error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

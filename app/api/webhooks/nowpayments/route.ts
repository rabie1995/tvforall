import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = 0;

// NOWPayments webhook secret (should be in env)
const WEBHOOK_SECRET = process.env.NOWPAYMENTS_WEBHOOK_SECRET || 'test_secret';

interface WebhookPayload {
  id: string;
  order_id: string;
  payment_status: string;
  pay_address: string;
  price_amount: number;
  price_currency: string;
  pay_amount: number;
  pay_currency: string;
  ipn_callback_url: string;
  created_at: string;
  updated_at: string;
  purchase_id: string;
  outcome: {
    status: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: WebhookPayload = await request.json();

    // Verify webhook signature if secret is configured
    const signature = request.headers.get('x-nowpayments-sig');
    if (WEBHOOK_SECRET && WEBHOOK_SECRET !== 'test_secret') {
      if (!verifySignature(body, signature)) {
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        );
      }
    }

    // Map NOWPayments status to our status
    const paymentStatus = body.payment_status === 'finished' ? 'completed' : 'pending';

    // Update order status
    const order = await prisma.order.findFirst({
      where: {
        nowpaymentsId: body.order_id,
      },
    });

    if (!order) {
      console.warn('Order not found for NOWPayments ID:', body.order_id);
      return NextResponse.json(
        { status: 'ok' },
        { status: 200 }
      );
    }

    // Prevent duplicate payments
    if (order.paymentStatus === 'completed') {
      return NextResponse.json(
        { status: 'ok' },
        { status: 200 }
      );
    }

    // Update order
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus,
      },
    });

    console.log(`Order ${order.id} payment status updated to: ${paymentStatus}`);

    return NextResponse.json(
      { status: 'ok' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

function verifySignature(body: any, signature: string | null): boolean {
  if (!signature) return false;

  // Create hash of request body
  const hash = crypto
    .createHash('sha512')
    .update(JSON.stringify(body) + WEBHOOK_SECRET)
    .digest('hex');

  return hash === signature;
}

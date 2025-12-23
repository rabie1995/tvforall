export const runtime = "nodejs";

import { NextRequest, NextResponse } from 'next/server';

interface CheckoutRequest {
  name: string;
  email: string;
  region: string;
  planId: string;
  planName: string;
  planPrice: number;
}

export async function GET() {
  return NextResponse.json({
    status: 'active',
    message: 'Checkout API is active. Collects customer info before NOWPayments redirect.',
  });
}

export async function POST(req: NextRequest) {
  try {
    const body: CheckoutRequest = await req.json();

    // Validate inputs
    if (!body.name || !body.email || !body.region || !body.planId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate unique customer ID
    const customerId = `cust_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create order data
    const orderData = {
      customerId,
      timestamp: new Date().toISOString(),
      customer: {
        name: body.name,
        email: body.email,
        region: body.region
      },
      order: {
        planId: body.planId,
        planName: body.planName,
        planPrice: body.planPrice
      },
      status: 'pending_payment'
    };

    // TODO: Save to database
    // TODO: Send email confirmation
    // TODO: Notify admin panel via webhook

    console.log('Order created:', orderData);

    return NextResponse.json({
      success: true,
      customerId,
      message: 'Order created successfully'
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to process checkout' },
      { status: 500 }
    );
  }
}

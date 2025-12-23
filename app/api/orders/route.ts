import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = 0;

export async function GET() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { product: true, subscription: true }
  });

  return NextResponse.json({
    orders: orders.map((o) => ({
      id: o.id,
      email: o.email,
      paymentStatus: o.paymentStatus,
      deliveryStatus: o.deliveryStatus,
      productName: o.product.name,
      createdAt: o.createdAt,
      subscriptionStatus: o.subscription?.status ?? null
    }))
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { planId, email } = body as { planId?: string; email?: string };

    if (!planId) return NextResponse.json({ error: 'planId is required' }, { status: 400 });

    const product = await prisma.product.findUnique({ where: { id: planId } });
    if (!product) return NextResponse.json({ error: 'Plan not found' }, { status: 404 });

    const order = await prisma.order.create({
      data: {
        productId: product.id,
        fullName: 'Test User',
        email: email && email.trim() ? email.trim() : 'test@tvforall.store',
        region: 'N/A',
        adultChannels: false,
        paymentStatus: 'pending',
        deliveryStatus: 'pending'
      }
    });

    return NextResponse.json({
      orderId: order.id,
      productName: product.name,
      paymentStatus: order.paymentStatus
    });
  } catch (error) {
    return NextResponse.json({ error: 'Unable to create order' }, { status: 500 });
  }
}

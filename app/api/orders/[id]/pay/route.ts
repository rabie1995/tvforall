export const runtime = "nodejs";
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(_req: Request, { params }: { params: { id: string } }) {
  const orderId = params.id;
  try {
    const order = await prisma.order.findUnique({ where: { id: orderId }, include: { product: true, subscription: true } });
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    const startAt = new Date();
    const endAt = new Date(startAt.getTime());
    endAt.setDate(endAt.getDate() + order.product.durationDays);

    await prisma.order.update({ where: { id: orderId }, data: { paymentStatus: 'completed' } });

    const subscription = await prisma.subscription.upsert({
      where: { orderId: orderId },
      update: { status: 'ACTIVE', startAt, endAt },
      create: {
        orderId,
        productId: order.productId,
        status: 'ACTIVE',
        startAt,
        endAt
      }
    });

    return NextResponse.json({
      orderId,
      paymentStatus: 'completed',
      subscription: { id: subscription.id, startAt, endAt, status: subscription.status }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Unable to mark order as paid' }, { status: 500 });
  }
}

export const runtime = "nodejs";
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAuthenticated } from '@/lib/authState';

export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const order = await prisma.order.update({
      where: { id: params.id },
      data: {
        deliveryStatus: 'completed',
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        deliveryStatus: true,
      },
    });

    return NextResponse.json(
      {
        message: 'Order marked as delivered',
        order,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Order activation error:', error);
    return NextResponse.json(
      { error: 'Failed to activate order' },
      { status: 500 }
    );
  }
}

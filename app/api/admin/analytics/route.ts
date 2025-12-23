export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function monthKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}`;
}

export async function GET() {
  try {
    const [orders, clients] = await Promise.all([
      prisma.order.findMany({
        include: { product: true },
      }),
      prisma.clientData.findMany(),
    ]);

    const totalOrders = orders.length;
    const paidOrders = orders.filter((o) => o.paymentStatus === "completed");
    const totalRevenue = paidOrders.reduce((sum, o) => sum + (o.product?.priceUsd || 0), 0);
    const totalClients = clients.length;

    // Visits proxy: client submissions (fallback to orders)
    const visits = Math.max(totalClients, totalOrders);
    const conversionRate = visits > 0 ? Number(((totalOrders / visits) * 100).toFixed(2)) : 0;

    const revenueByPlan: Record<string, { revenue: number; orders: number }> = {};
    for (const order of paidOrders) {
      const key = order.productId;
      if (!revenueByPlan[key]) revenueByPlan[key] = { revenue: 0, orders: 0 };
      revenueByPlan[key].revenue += order.product?.priceUsd || 0;
      revenueByPlan[key].orders += 1;
    }

    const ordersByCountry: Record<string, number> = {};
    for (const order of orders) {
      const region = order.region || "Unknown";
      ordersByCountry[region] = (ordersByCountry[region] || 0) + 1;
    }

    // Monthly aggregates (last 6 months)
    const monthlyMap: Record<string, { revenue: number; orders: number; clients: number }> = {};
    const now = new Date();
    const cutoff = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    for (const order of orders) {
      const created = new Date(order.createdAt);
      if (created < cutoff) continue;
      const key = monthKey(created);
      if (!monthlyMap[key]) monthlyMap[key] = { revenue: 0, orders: 0, clients: 0 };
      monthlyMap[key].orders += 1;
      if (order.paymentStatus === "completed") {
        monthlyMap[key].revenue += order.product?.priceUsd || 0;
      }
    }

    for (const client of clients) {
      const created = new Date(client.createdAt);
      if (created < cutoff) continue;
      const key = monthKey(created);
      if (!monthlyMap[key]) monthlyMap[key] = { revenue: 0, orders: 0, clients: 0 };
      monthlyMap[key].clients += 1;
    }

    const monthlyData = Object.entries(monthlyMap)
      .sort(([a], [b]) => (a > b ? 1 : -1))
      .map(([key, value]) => {
        const [year, month] = key.split("-").map(Number);
        const label = new Date(year, month - 1, 1).toLocaleString("default", { month: "short" });
        return { month: label, revenue: value.revenue, orders: value.orders, clients: value.clients };
      });

    // Top products by revenue
    const topProducts = Object.entries(revenueByPlan)
      .map(([productId, value]) => ({ name: productId, orders: value.orders, revenue: value.revenue }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Regional distribution
    const totalOrdersForRegion = Object.values(ordersByCountry).reduce((a, b) => a + b, 0) || 1;
    const regionalData = Object.entries(ordersByCountry)
      .map(([region, count]) => ({ region, orders: count, percentage: Number(((count / totalOrdersForRegion) * 100).toFixed(2)) }))
      .sort((a, b) => b.orders - a.orders)
      .slice(0, 10);

    return NextResponse.json({
      totalRevenue,
      totalOrders,
      totalClients,
      conversionRate,
      revenueByPlan,
      ordersByCountry,
      monthlyData,
      topProducts,
      regionalData,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json({ error: "Failed to load analytics" }, { status: 500 });
  }
}

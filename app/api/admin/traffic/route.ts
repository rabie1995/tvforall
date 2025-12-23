export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);

    const clients = await prisma.clientData.findMany({
      where: { createdAt: { gte: start } },
      orderBy: { createdAt: "asc" },
    });

    const visitsByDay: Record<string, number> = {};
    for (const client of clients) {
      const key = new Date(client.createdAt).toISOString().split("T")[0];
      visitsByDay[key] = (visitsByDay[key] || 0) + 1;
    }

    const timeline = Object.entries(visitsByDay)
      .sort(([a], [b]) => (a > b ? 1 : -1))
      .map(([date, visits]) => ({ date, visits }));

    return NextResponse.json({
      visits: timeline,
      totalVisits: clients.length,
      lastVisitDate: clients.at(-1)?.createdAt ?? null,
    });
  } catch (error) {
    console.error("Traffic error:", error);
    return NextResponse.json({ error: "Failed to load traffic" }, { status: 500 });
  }
}

export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { setAuthenticated, isAuthenticated } from "@/lib/authState";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  // Direct comparison with environment variables
  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    setAuthenticated(true);
    return NextResponse.json({ success: true });
  }

  // Silent failure - no error message
  return NextResponse.json({ success: false }, { status: 401 });
}

// Check auth status
export async function GET() {
  return NextResponse.json({ authenticated: isAuthenticated() });
}

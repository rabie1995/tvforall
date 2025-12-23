import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/authState';

export const runtime = 'nodejs';

interface AdminSettings {
  username: string;
  password: string;
  notifications: {
    email: boolean;
    webhook: boolean;
    orderUpdates: boolean;
  };
  security: {
    sessionTimeout: number;
    maxLoginAttempts: number;
    requireStrongPassword: boolean;
  };
  api: {
    rateLimit: number;
    webhookSecret: string;
  };
}

// In-memory settings (server-side only)
let adminSettings: AdminSettings = {
  username: process.env.ADMIN_USERNAME || 'admin1995',
  password: process.env.ADMIN_PASSWORD || 'ssimo2003200459',
  notifications: {
    email: false,
    webhook: false,
    orderUpdates: true,
  },
  security: {
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    requireStrongPassword: true,
  },
  api: {
    rateLimit: 100,
    webhookSecret: process.env.NOWPAYMENTS_WEBHOOK_SECRET || '',
  },
};

export async function GET(_request: NextRequest) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const safeSettings = {
    ...adminSettings,
    password: '',
    api: {
      ...adminSettings.api,
      webhookSecret: adminSettings.api.webhookSecret ? '••••••••' : '',
    },
  };

  return NextResponse.json(safeSettings);
}

export async function PUT(request: NextRequest) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    if (body.username) adminSettings.username = body.username;
    if (body.password) adminSettings.password = body.password;
    if (body.notifications) adminSettings.notifications = { ...adminSettings.notifications, ...body.notifications };
    if (body.security) adminSettings.security = { ...adminSettings.security, ...body.security };
    if (body.api) adminSettings.api = { ...adminSettings.api, ...body.api };

    return NextResponse.json({ success: true, message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Settings PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
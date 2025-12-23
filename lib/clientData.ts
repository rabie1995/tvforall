import { prisma } from '@/lib/prisma';

export interface ClientDataInput {
  fullName: string;
  email: string;
  region: string;
  source?: string;
}

/**
 * Validates client data input
 */
export function validateClientData(data: ClientDataInput): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Validate full name
  if (!data.fullName || data.fullName.trim().length < 2) {
    errors.push('Full name must be at least 2 characters');
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email)) {
    errors.push('Valid email address is required');
  }

  // Validate region
  if (!data.region || data.region.trim().length < 2) {
    errors.push('Region is required');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Sanitizes client data input
 */
export function sanitizeClientData(data: ClientDataInput): ClientDataInput {
  return {
    fullName: data.fullName.trim(),
    email: data.email.trim().toLowerCase(),
    region: data.region.trim(),
    source: data.source?.trim() || 'website',
  };
}

/**
 * Collects and stores client data
 * Returns existing record if email already exists
 */
export async function collectClientData(
  data: ClientDataInput
): Promise<{ success: boolean; clientId?: string; error?: string }> {
  try {
    // Validate input
    const validation = validateClientData(data);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.errors.join(', '),
      };
    }

    // Sanitize data
    const sanitizedData = sanitizeClientData(data);

    // Check if email already exists
    const existing = await prisma.clientData.findUnique({
      where: { email: sanitizedData.email },
    });

    if (existing) {
      // Update existing record with latest information
      const updated = await prisma.clientData.update({
        where: { email: sanitizedData.email },
        data: {
          fullName: sanitizedData.fullName,
          region: sanitizedData.region,
          source: sanitizedData.source,
        },
      });

      return {
        success: true,
        clientId: updated.id,
      };
    }

    // Create new record
    const client = await prisma.clientData.create({
      data: sanitizedData,
    });

    return {
      success: true,
      clientId: client.id,
    };
  } catch (error) {
    console.error('Error collecting client data:', error);
    return {
      success: false,
      error: 'Failed to save client data',
    };
  }
}

/**
 * Fetches client data with pagination and search
 */
export async function getClientData(params: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  const page = params.page || 1;
  const limit = params.limit || 50;
  const skip = (page - 1) * limit;

  const where = params.search
    ? {
        OR: [
          { email: { contains: params.search, mode: 'insensitive' as const } },
          { region: { contains: params.search, mode: 'insensitive' as const } },
          { fullName: { contains: params.search, mode: 'insensitive' as const } },
        ],
      }
    : {};

  const [clients, total] = await Promise.all([
    prisma.clientData.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.clientData.count({ where }),
  ]);

  return {
    clients,
    total,
    page,
    pages: Math.ceil(total / limit),
  };
}

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAuthenticated } from '@/lib/authState';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// No side effects; auth will be checked per request

/**
 * Converts data to CSV format
 */
function convertToCSV(data: any[]): string {
  if (data.length === 0) return '';

  // Define headers
  const headers = ['ID', 'Full Name', 'Email', 'Region', 'Source', 'Date'];

  // Create CSV rows
  const rows = data.map(item => [
    item.id,
    item.fullName,
    item.email,
    item.region,
    item.source || 'website',
    new Date(item.createdAt).toLocaleString(),
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row =>
      row.map(cell => {
        // Escape cells that contain commas or quotes
        const cellStr = String(cell);
        if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
          return `"${cellStr.replace(/"/g, '""')}"`;
        }
        return cellStr;
      }).join(',')
    ),
  ].join('\n');

  return csvContent;
}

export async function GET() {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Fetch all client data (no pagination for export)
    const clients = await prisma.clientData.findMany({
      orderBy: { createdAt: 'desc' },
    });

    // Convert to CSV
    const csv = convertToCSV(clients);

    // Create filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '_');
    const filename = `clients_${timestamp}.csv`;

    // Return CSV file
    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    );
  }
}

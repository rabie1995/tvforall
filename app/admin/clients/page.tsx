'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  ArrowLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/solid';

interface Client {
  id: string;
  fullName: string;
  email: string;
  region: string;
  source: string | null;
  createdAt: string;
}

interface ClientsResponse {
  clients: Client[];
  total: number;
  page: number;
  pages: number;
}

export default function ClientsPage() {
  const [data, setData] = useState<ClientsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchClients();
  }, [page, search]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '50',
        ...(search && { search }),
      });

      const response = await fetch(`/api/admin/clients?${params}`);

      if (!response.ok) {
        throw new Error('Failed to fetch clients');
      }

      const result = await response.json();
      setData(result);
      setError('');
    } catch (err) {
      setError('Failed to load client data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      const response = await fetch('/api/admin/clients/export');

      if (!response.ok) {
        throw new Error('Export failed');
      }

      // Get filename from headers or use default
      const contentDisposition = response.headers.get('Content-Disposition');
      const filename = contentDisposition
        ? contentDisposition.split('filename=')[1].replace(/"/g, '')
        : `clients_${new Date().toISOString().split('T')[0]}.csv`;

      // Download file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError('Failed to export data');
      console.error(err);
    } finally {
      setExporting(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1); // Reset to first page on new search
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/admin"
            className="flex items-center gap-2 text-teal hover:text-teal-dark font-semibold mb-4"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-navy">Client Data Center</h1>
              <p className="text-sm text-gray-600">
                Manage and export collected client information
              </p>
            </div>
            <button
              onClick={handleExport}
              disabled={exporting || !data || data.total === 0}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-teal hover:bg-teal/90 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
              {exporting ? 'Exporting...' : 'Export to Google Sheets'}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600 mb-2">Total Clients</p>
            <p className="text-3xl font-bold text-navy">{data?.total || 0}</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600 mb-2">From Checkout</p>
            <p className="text-3xl font-bold text-teal">
              {data?.clients.filter(c => c.source === 'checkout').length || 0}
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600 mb-2">Current Page</p>
            <p className="text-3xl font-bold text-navy">
              {data?.page || 1} / {data?.pages || 1}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or region..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal"
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-500">
              <p>Loading client data...</p>
            </div>
          ) : !data || data.clients.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <p>
                {search ? 'No clients match your search' : 'No client data collected yet'}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-navy">
                        Full Name
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-navy">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-navy">
                        Region
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-navy">
                        Source
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-navy">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.clients.map((client) => (
                      <tr
                        key={client.id}
                        className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-navy">
                          {client.fullName}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">{client.email}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{client.region}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className="inline-block px-3 py-1 bg-teal/10 text-teal rounded-full text-xs font-semibold">
                            {client.source || 'website'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(client.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {data.pages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Showing {((data.page - 1) * 50) + 1} to{' '}
                    {Math.min(data.page * 50, data.total)} of {data.total} clients
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={data.page === 1}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
                    </button>
                    <span className="text-sm font-medium text-navy">
                      Page {data.page} of {data.pages}
                    </span>
                    <button
                      onClick={() => setPage(p => Math.min(data.pages, p + 1))}
                      disabled={data.page === data.pages}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRightIcon className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

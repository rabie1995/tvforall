'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  MagnifyingGlassIcon,
  ChevronRightIcon,
  ArrowRightOnRectangleIcon,
  UsersIcon,
} from '@heroicons/react/24/solid';

interface Order {
  id: string;
  fullName: string;
  email: string;
  region: string;
  productId: string;
  adultChannels: boolean;
  paymentStatus: string;
  deliveryStatus: string;
  createdAt: string;
}

const planLabels: Record<string, string> = {
  'plan_3m': '3 Months',
  'plan_6m': '6 Months',
  'plan_12m': '1 Year',
};

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
};

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/orders');

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data);
      setError('');
    } catch (err) {
      setError('Failed to load orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    console.log('logout called');
  };

  const filteredOrders = orders.filter(
    order =>
      order.fullName.toLowerCase().includes(search.toLowerCase()) ||
      order.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-navy">Admin Panel</h1>
            <p className="text-sm text-gray-600">Manage orders and subscriptions</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/clients"
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-navy bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <UsersIcon className="w-4 h-4" />
              Client Data
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-navy hover:bg-navy/90 rounded-lg transition-colors"
            >
              <ArrowRightOnRectangleIcon className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600 mb-2">Total Orders</p>
            <p className="text-3xl font-bold text-navy">{orders.length}</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600 mb-2">Payment Completed</p>
            <p className="text-3xl font-bold text-green-600">
              {orders.filter(o => o.paymentStatus === 'completed').length}
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600 mb-2">Pending Payment</p>
            <p className="text-3xl font-bold text-yellow-600">
              {orders.filter(o => o.paymentStatus === 'pending').length}
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600 mb-2">Delivered</p>
            <p className="text-3xl font-bold text-teal">
              {orders.filter(o => o.deliveryStatus === 'completed').length}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-500">
              <p>Loading orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <p>
                {search ? 'No orders match your search' : 'No orders yet'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-navy">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-navy">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-navy">Region</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-navy">Plan</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-navy">Adult</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-navy">Payment</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-navy">Delivery</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-navy">Date</th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-navy">{order.fullName}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{order.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{order.region}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {planLabels[order.productId] || order.productId}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {order.adultChannels ? (
                          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                            Yes
                          </span>
                        ) : (
                          <span className="inline-block px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold">
                            No
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.paymentStatus]}`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.deliveryStatus]}`}>
                          {order.deliveryStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="text-teal hover:text-teal-dark font-semibold flex items-center gap-1"
                        >
                          View
                          <ChevronRightIcon className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

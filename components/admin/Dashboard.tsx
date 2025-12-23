'use client';

import { useEffect, useState } from 'react';
import {
  UsersIcon,
  ShoppingBagIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
  recentOrders: any[];
}

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [usersRes, ordersRes] = await Promise.all([
        fetch('/api/admin/clients'),
        fetch('/api/admin/orders'),
      ]);

      const users = usersRes.ok ? await usersRes.json() : [];
      const orders = ordersRes.ok ? await ordersRes.json() : [];

      const pendingOrders = orders.filter((order: any) => order.paymentStatus === 'pending').length;
      const completedOrders = orders.filter((order: any) => order.paymentStatus === 'completed').length;
      const totalRevenue = orders
        .filter((order: any) => order.paymentStatus === 'completed')
        .reduce((sum: number, order: any) => sum + (order.amountUsd || 0), 0);

      setStats({
        totalUsers: users.length,
        totalOrders: orders.length,
        totalRevenue,
        pendingOrders,
        completedOrders,
        recentOrders: orders.slice(0, 5),
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-400" />;
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-400" />;
      case 'failed':
        return <XCircleIcon className="h-5 w-5 text-red-400" />;
      default:
        return <ExclamationCircleIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400';
      case 'pending':
        return 'text-yellow-400';
      case 'failed':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-800 rounded-lg p-6 animate-pulse">
              <div className="h-4 bg-gray-700 rounded mb-2"></div>
              <div className="h-8 bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-600/20 rounded-lg">
              <UsersIcon className="h-6 w-6 text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Total Users</p>
              <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-600/20 rounded-lg">
              <ShoppingBagIcon className="h-6 w-6 text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Total Orders</p>
              <p className="text-2xl font-bold text-white">{stats.totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-600/20 rounded-lg">
              <CurrencyDollarIcon className="h-6 w-6 text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Revenue</p>
              <p className="text-2xl font-bold text-white">${stats.totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-600/20 rounded-lg">
              <ClockIcon className="h-6 w-6 text-yellow-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Pending Orders</p>
              <p className="text-2xl font-bold text-white">{stats.pendingOrders}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">Recent Orders</h3>
          <p className="text-gray-400 text-sm mt-1">Latest order activity</p>
        </div>

        <div className="divide-y divide-gray-700">
          {stats.recentOrders.length > 0 ? (
            stats.recentOrders.map((order: any) => (
              <div key={order.id} className="p-6 hover:bg-gray-700/30 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(order.paymentStatus)}
                    <div>
                      <p className="text-white font-medium">Order #{order.id}</p>
                      <p className="text-gray-400 text-sm">{order.fullName} • {order.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium">${order.amountUsd || '0.00'}</p>
                    <p className={`text-sm capitalize ${getStatusColor(order.paymentStatus)}`}>
                      {order.paymentStatus}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-gray-400">
              No recent orders
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-left">
            <ChartBarIcon className="h-6 w-6 mb-2" />
            <div>
              <p className="font-medium">View Analytics</p>
              <p className="text-sm text-blue-200">Check performance metrics</p>
            </div>
          </button>

          <button className="p-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-left">
            <ShoppingBagIcon className="h-6 w-6 mb-2" />
            <div>
              <p className="font-medium">Manage Orders</p>
              <p className="text-sm text-green-200">Process pending orders</p>
            </div>
          </button>

          <button className="p-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-left">
            <UsersIcon className="h-6 w-6 mb-2" />
            <div>
              <p className="font-medium">Client Data</p>
              <p className="text-sm text-purple-200">View customer information</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
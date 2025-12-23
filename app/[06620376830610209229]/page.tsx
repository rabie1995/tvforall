'use client';

import { useEffect, useState } from 'react';
import {
  ShoppingBagIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ClockIcon,
  ChartBarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';

interface DashboardStats {
  totalOrders: number;
  activeSubscriptions: number;
  pendingOrders: number;
  revenue: number;
  todayTraffic: number;
  ordersChange: number;
  revenueChange: number;
  trafficChange: number;
}

interface RecentActivity {
  id: string;
  type: 'order' | 'payment' | 'delivery';
  message: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error';
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    activeSubscriptions: 0,
    pendingOrders: 0,
    revenue: 0,
    todayTraffic: 0,
    ordersChange: 0,
    revenueChange: 0,
    trafficChange: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [ordersRes, analyticsRes, trafficRes] = await Promise.all([
        fetch('/api/admin/orders'),
        fetch('/api/admin/analytics'),
        fetch('/api/admin/traffic'),
      ]);

      const orders = ordersRes.ok ? await ordersRes.json() : [];
      const analytics = analyticsRes.ok ? await analyticsRes.json() : null;
      const traffic = trafficRes.ok ? await trafficRes.json() : { visits: [] };

      const paidOrders = orders.filter((order: any) => order.paymentStatus === 'completed');
      const totalOrders = orders.length;
      const pendingOrders = orders.filter((order: any) => order.paymentStatus === 'pending').length;
      const activeSubscriptions = orders.filter((order: any) => order.deliveryStatus === 'completed').length;
      const revenue = analytics?.totalRevenue ?? paidOrders.length;

      const todayKey = new Date().toISOString().split('T')[0];
      const todayTraffic = traffic.visits?.find((v: any) => v.date === todayKey)?.visits || 0;

      setStats({
        totalOrders,
        activeSubscriptions,
        pendingOrders,
        revenue,
        todayTraffic,
        ordersChange: 0,
        revenueChange: 0,
        trafficChange: 0,
      });

      const activities: RecentActivity[] = orders.slice(0, 5).map((order: any) => ({
        id: order.id,
        type: 'order' as const,
        message: `New order from ${order.fullName}`,
        timestamp: new Date(order.createdAt).toLocaleString(),
        status: order.paymentStatus === 'completed' ? 'success' : 'warning' as const,
      }));

      setRecentActivity(activities);
    } catch (error) {
      console.error('Dashboard data fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      name: 'Total Orders',
      value: stats.totalOrders,
      change: stats.ordersChange,
      icon: ShoppingBagIcon,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      name: 'Active Subscriptions',
      value: stats.activeSubscriptions,
      change: null,
      icon: CheckCircleSolid,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      name: 'Pending Orders',
      value: stats.pendingOrders,
      change: null,
      icon: ClockIcon,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
    {
      name: 'Revenue',
      value: `$${stats.revenue}`,
      change: stats.revenueChange,
      icon: CurrencyDollarIcon,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      name: 'Today Traffic',
      value: stats.todayTraffic,
      change: stats.trafficChange,
      icon: ChartBarIcon,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-500/10',
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-surface rounded-xl p-6 animate-pulse">
              <div className="h-4 bg-border rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-border rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-text">Dashboard Overview</h1>
        <p className="text-text-muted mt-2">Welcome back! Here's what's happening with your business today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {statCards.map((card) => (
          <div key={card.name} className="bg-surface rounded-xl p-6 border border-border hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-muted">{card.name}</p>
                <p className="text-2xl font-bold text-text mt-1">{card.value}</p>
                {card.change !== null && (
                  <div className={`flex items-center mt-2 text-sm ${
                    card.change > 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {card.change > 0 ? (
                      <ArrowUpIcon className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowDownIcon className="h-4 w-4 mr-1" />
                    )}
                    {Math.abs(card.change)}% from last month
                  </div>
                )}
              </div>
              <div className={`p-3 rounded-lg ${card.bgColor}`}>
                <card.icon className={`h-6 w-6 ${card.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-surface rounded-xl border border-border">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-text">Recent Activity</h2>
        </div>
        <div className="divide-y divide-border">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity) => (
              <div key={activity.id} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    activity.status === 'success' ? 'bg-green-500/10' :
                    activity.status === 'warning' ? 'bg-yellow-500/10' : 'bg-red-500/10'
                  }`}>
                    {activity.status === 'success' ? (
                      <CheckCircleIcon className="h-4 w-4 text-green-500" />
                    ) : activity.status === 'warning' ? (
                      <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500" />
                    ) : (
                      <XCircleIcon className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text">{activity.message}</p>
                    <p className="text-xs text-text-muted">{activity.timestamp}</p>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  activity.status === 'success' ? 'bg-green-500/10 text-green-500' :
                  activity.status === 'warning' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-red-500/10 text-red-500'
                }`}>
                  {activity.status}
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-8 text-center text-text-muted">
              <p>No recent activity</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-surface rounded-xl border border-border p-6">
        <h2 className="text-lg font-semibold text-text mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center gap-3 p-4 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors text-left">
            <ShoppingBagIcon className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium text-text">View Orders</p>
              <p className="text-sm text-text-muted">Manage customer orders</p>
            </div>
          </button>
          <button className="flex items-center gap-3 p-4 bg-secondary/10 hover:bg-secondary/20 rounded-lg transition-colors text-left">
            <UsersIcon className="h-5 w-5 text-secondary" />
            <div>
              <p className="font-medium text-text">View Clients</p>
              <p className="text-sm text-text-muted">Browse customer data</p>
            </div>
          </button>
          <button className="flex items-center gap-3 p-4 bg-accent/10 hover:bg-accent/20 rounded-lg transition-colors text-left">
            <ChartBarIcon className="h-5 w-5 text-accent" />
            <div>
              <p className="font-medium text-text">View Analytics</p>
              <p className="text-sm text-text-muted">Check performance metrics</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
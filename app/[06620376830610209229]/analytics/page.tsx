'use client';

import { useEffect, useState } from 'react';
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  UsersIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  totalClients: number;
  conversionRate: number;
  revenueChange?: number;
  ordersChange?: number;
  clientsChange?: number;
  monthlyData: {
    month: string;
    revenue: number;
    orders: number;
    clients: number;
  }[];
  topProducts: {
    name: string;
    orders: number;
    revenue: number;
  }[];
  regionalData: {
    region: string;
    orders: number;
    percentage: number;
  }[];
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      const res = await fetch('/api/admin/analytics');
      if (!res.ok) {
        throw new Error('Failed to load analytics');
      }
      const realData = await res.json();
      setData(realData);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-surface rounded-xl p-6 animate-pulse">
              <div className="h-4 bg-border rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-border rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text">Analytics Dashboard</h1>
        <p className="text-text-muted mt-2">Track your business performance and growth metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-surface rounded-xl p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-muted">Total Revenue</p>
              <p className="text-2xl font-bold text-text">${data.totalRevenue.toLocaleString()}</p>
              <div className={`flex items-center mt-2 text-sm ${
                (data.revenueChange ?? 0) > 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {(data.revenueChange ?? 0) > 0 ? (
                  <ArrowUpIcon className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownIcon className="h-4 w-4 mr-1" />
                )}
                {Math.abs(data.revenueChange ?? 0)}% from last month
              </div>
            </div>
            <div className="p-3 bg-green-500/10 rounded-lg">
              <CurrencyDollarIcon className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-xl p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-muted">Total Orders</p>
              <p className="text-2xl font-bold text-text">{data.totalOrders.toLocaleString()}</p>
              <div className={`flex items-center mt-2 text-sm ${
                (data.ordersChange ?? 0) > 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {(data.ordersChange ?? 0) > 0 ? (
                  <ArrowUpIcon className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownIcon className="h-4 w-4 mr-1" />
                )}
                {Math.abs(data.ordersChange ?? 0)}% from last month
              </div>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <ShoppingBagIcon className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-xl p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-muted">Total Clients</p>
              <p className="text-2xl font-bold text-text">{data.totalClients.toLocaleString()}</p>
              <div className={`flex items-center mt-2 text-sm ${
                (data.clientsChange ?? 0) > 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {(data.clientsChange ?? 0) > 0 ? (
                  <ArrowUpIcon className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownIcon className="h-4 w-4 mr-1" />
                )}
                {Math.abs(data.clientsChange ?? 0)}% from last month
              </div>
            </div>
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <UsersIcon className="h-6 w-6 text-purple-500" />
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-xl p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-muted">Conversion Rate</p>
              <p className="text-2xl font-bold text-text">{data.conversionRate}%</p>
              <div className="flex items-center mt-2 text-sm text-green-500">
                <ArrowUpIcon className="h-4 w-4 mr-1" />
                Above average
              </div>
            </div>
            <div className="p-3 bg-orange-500/10 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-orange-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <div className="bg-surface rounded-xl border border-border p-6">
          <h3 className="text-lg font-semibold text-text mb-4">Revenue Trend</h3>
          <div className="h-64 flex items-end justify-between gap-2">
            {data.monthlyData.map((month) => (
              <div key={month.month} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-gradient-to-t from-primary to-primary/80 rounded-t"
                  style={{
                    height: `${(month.revenue / Math.max(...data.monthlyData.map(m => m.revenue))) * 200}px`,
                    minHeight: '20px'
                  }}
                ></div>
                <span className="text-xs text-text-muted mt-2">{month.month}</span>
                <span className="text-xs font-medium text-text">${month.revenue}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Orders Chart */}
        <div className="bg-surface rounded-xl border border-border p-6">
          <h3 className="text-lg font-semibold text-text mb-4">Orders Trend</h3>
          <div className="h-64 flex items-end justify-between gap-2">
            {data.monthlyData.map((month) => (
              <div key={month.month} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-gradient-to-t from-secondary to-secondary/80 rounded-t"
                  style={{
                    height: `${(month.orders / Math.max(...data.monthlyData.map(m => m.orders))) * 200}px`,
                    minHeight: '20px'
                  }}
                ></div>
                <span className="text-xs text-text-muted mt-2">{month.month}</span>
                <span className="text-xs font-medium text-text">{month.orders}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Products */}
        <div className="bg-surface rounded-xl border border-border p-6">
          <h3 className="text-lg font-semibold text-text mb-4">Top Products</h3>
          <div className="space-y-4">
            {data.topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-text">{product.name}</p>
                    <p className="text-sm text-text-muted">{product.orders} orders</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-text">${product.revenue.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Regional Data */}
        <div className="bg-surface rounded-xl border border-border p-6">
          <h3 className="text-lg font-semibold text-text mb-4">Regional Distribution</h3>
          <div className="space-y-4">
            {data.regionalData.map((region) => (
              <div key={region.region} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-text">{region.region}</span>
                  <span className="text-sm text-text-muted">{region.orders} orders ({region.percentage}%)</span>
                </div>
                <div className="w-full bg-background rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full"
                    style={{ width: `${region.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
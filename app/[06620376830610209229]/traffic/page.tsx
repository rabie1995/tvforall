'use client';

import { useEffect, useState } from 'react';
import {
  GlobeAltIcon,
  EyeIcon,
  UserGroupIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

interface TrafficData {
  totalVisitors: number;
  uniqueVisitors: number;
  pageViews: number;
  avgSessionDuration: string;
  bounceRate: number;
  topPages: {
    path: string;
    views: number;
    percentage: number;
  }[];
  trafficSources: {
    source: string;
    visitors: number;
    percentage: number;
  }[];
  deviceBreakdown: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  hourlyTraffic: {
    hour: number;
    visitors: number;
  }[];
  geographicData: {
    country: string;
    visitors: number;
    percentage: number;
  }[];
}

export default function TrafficPage() {
  const [data, setData] = useState<TrafficData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    fetchTrafficData();
  }, [timeRange]);

  const fetchTrafficData = async () => {
    try {
      // Mock traffic data - in a real app, this would come from analytics service
      const mockData: TrafficData = {
        totalVisitors: 12450,
        uniqueVisitors: 8920,
        pageViews: 28750,
        avgSessionDuration: '3:24',
        bounceRate: 42.3,
        topPages: [
          { path: '/', views: 15420, percentage: 53.6 },
          { path: '/checkout', views: 5230, percentage: 18.2 },
          { path: '/plans', views: 3410, percentage: 11.9 },
          { path: '/about', views: 1890, percentage: 6.6 },
          { path: '/contact', views: 1240, percentage: 4.3 },
        ],
        trafficSources: [
          { source: 'Direct', visitors: 4520, percentage: 36.3 },
          { source: 'Search Engines', visitors: 3210, percentage: 25.8 },
          { source: 'Social Media', visitors: 2890, percentage: 23.2 },
          { source: 'Referrals', visitors: 1830, percentage: 14.7 },
        ],
        deviceBreakdown: {
          desktop: 58.4,
          mobile: 35.2,
          tablet: 6.4,
        },
        hourlyTraffic: Array.from({ length: 24 }, (_, i) => ({
          hour: i,
          visitors: Math.floor(Math.random() * 200) + 50,
        })),
        geographicData: [
          { country: 'United States', visitors: 2340, percentage: 18.8 },
          { country: 'United Kingdom', visitors: 1890, percentage: 15.2 },
          { country: 'Germany', visitors: 1450, percentage: 11.6 },
          { country: 'France', visitors: 1230, percentage: 9.9 },
          { country: 'Canada', visitors: 980, percentage: 7.9 },
        ],
      };

      setData(mockData);
    } catch (error) {
      console.error('Failed to fetch traffic data:', error);
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text">Traffic Analytics</h1>
          <p className="text-text-muted mt-2">Monitor website traffic and user behavior</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-3 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="1d">Last 24 hours</option>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-surface rounded-xl p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-muted">Total Visitors</p>
              <p className="text-2xl font-bold text-text">{data.totalVisitors.toLocaleString()}</p>
              <div className="flex items-center mt-2 text-sm text-green-500">
                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                +12.5% from last period
              </div>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <UserGroupIcon className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-xl p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-muted">Unique Visitors</p>
              <p className="text-2xl font-bold text-text">{data.uniqueVisitors.toLocaleString()}</p>
              <div className="flex items-center mt-2 text-sm text-green-500">
                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                +8.3% from last period
              </div>
            </div>
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <EyeIcon className="h-6 w-6 text-purple-500" />
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-xl p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-muted">Page Views</p>
              <p className="text-2xl font-bold text-text">{data.pageViews.toLocaleString()}</p>
              <div className="flex items-center mt-2 text-sm text-green-500">
                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                +15.2% from last period
              </div>
            </div>
            <div className="p-3 bg-green-500/10 rounded-lg">
              <GlobeAltIcon className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-xl p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-muted">Avg. Session</p>
              <p className="text-2xl font-bold text-text">{data.avgSessionDuration}</p>
              <div className="flex items-center mt-2 text-sm text-red-500">
                <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
                -2.1% from last period
              </div>
            </div>
            <div className="p-3 bg-orange-500/10 rounded-lg">
              <ClockIcon className="h-6 w-6 text-orange-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Hourly Traffic */}
        <div className="bg-surface rounded-xl border border-border p-6">
          <h3 className="text-lg font-semibold text-text mb-4">Hourly Traffic</h3>
          <div className="h-64 flex items-end justify-between gap-1">
            {data.hourlyTraffic.map((hour) => (
              <div key={hour.hour} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-gradient-to-t from-primary to-primary/80 rounded-t min-h-[20px]"
                  style={{
                    height: `${(hour.visitors / Math.max(...data.hourlyTraffic.map(h => h.visitors))) * 200}px`,
                  }}
                ></div>
                <span className="text-xs text-text-muted mt-2">{hour.hour}:00</span>
              </div>
            ))}
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="bg-surface rounded-xl border border-border p-6">
          <h3 className="text-lg font-semibold text-text mb-4">Device Breakdown</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ComputerDesktopIcon className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-medium text-text">Desktop</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-text">{data.deviceBreakdown.desktop}%</span>
                <div className="w-24 bg-background rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${data.deviceBreakdown.desktop}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <DevicePhoneMobileIcon className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium text-text">Mobile</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-text">{data.deviceBreakdown.mobile}%</span>
                <div className="w-24 bg-background rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${data.deviceBreakdown.mobile}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 bg-purple-500 rounded"></div>
                <span className="text-sm font-medium text-text">Tablet</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-text">{data.deviceBreakdown.tablet}%</span>
                <div className="w-24 bg-background rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{ width: `${data.deviceBreakdown.tablet}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Top Pages */}
        <div className="bg-surface rounded-xl border border-border p-6">
          <h3 className="text-lg font-semibold text-text mb-4">Top Pages</h3>
          <div className="space-y-3">
            {data.topPages.map((page) => (
              <div key={page.path} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-text">{page.path}</p>
                  <p className="text-xs text-text-muted">{page.views.toLocaleString()} views</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-primary">{page.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-surface rounded-xl border border-border p-6">
          <h3 className="text-lg font-semibold text-text mb-4">Traffic Sources</h3>
          <div className="space-y-3">
            {data.trafficSources.map((source) => (
              <div key={source.source} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-text">{source.source}</span>
                  <span className="text-sm text-text-muted">{source.visitors.toLocaleString()}</span>
                </div>
                <div className="w-full bg-background rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-secondary to-secondary/80 h-2 rounded-full"
                    style={{ width: `${source.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Geographic Data */}
        <div className="bg-surface rounded-xl border border-border p-6">
          <h3 className="text-lg font-semibold text-text mb-4">Top Countries</h3>
          <div className="space-y-3">
            {data.geographicData.map((country) => (
              <div key={country.country} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MapPinIcon className="h-4 w-4 text-text-muted" />
                  <span className="text-sm font-medium text-text">{country.country}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-text">{country.visitors.toLocaleString()}</p>
                  <p className="text-xs text-text-muted">{country.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
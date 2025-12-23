'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon, CheckCircleIcon } from '@heroicons/react/24/solid';

interface OrderDetails {
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

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = (params?.id as string) || '';

  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activating, setActivating] = useState(false);

  useEffect(() => {
    if (!orderId) return;
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/orders/${orderId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch order');
      }

      const data = await response.json();
      setOrder(data);
      setError('');
    } catch (err) {
      setError('Failed to load order details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsDelivered = async () => {
    if (!orderId) return;

    setActivating(true);
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/activate`, {
        method: 'POST',
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Failed to activate order');
        setActivating(false);
        return;
      }

      // Refresh order data
      await fetchOrder();
      setActivating(false);
    } catch (err) {
      setError('An error occurred');
      setActivating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-surface py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <p className="text-red-600">{error || 'Order not found'}</p>
          <Link href="/admin" className="text-teal hover:underline mt-4 inline-block">
            ← Back to admin
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin"
            className="flex items-center gap-2 text-teal hover:text-teal-dark font-semibold mb-6"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Orders
          </Link>

          <h1 className="text-3xl font-bold text-navy mb-2">Order Details</h1>
          <p className="text-gray-600">Order ID: {order.id}</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Main Content */}
        <div className="grid gap-6">
          {/* Customer Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-navy mb-4">Customer Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Full Name</p>
                <p className="text-base font-medium text-navy">{order.fullName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Email</p>
                <p className="text-base font-medium text-navy">{order.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Region</p>
                <p className="text-base font-medium text-navy">{order.region}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Adult Channels</p>
                <p className="text-base font-medium text-navy">
                  {order.adultChannels ? 'Yes ✓' : 'No'}
                </p>
              </div>
            </div>
          </div>

          {/* Order Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-navy mb-4">Order Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Plan</p>
                <p className="text-base font-medium text-navy">
                  {planLabels[order.productId] || order.productId}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Order Date</p>
                <p className="text-base font-medium text-navy">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Status Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-navy mb-4">Status</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">Payment Status</p>
                <div className="flex items-center gap-2">
                  {order.paymentStatus === 'completed' ? (
                    <>
                      <CheckCircleIcon className="w-5 h-5 text-green-600" />
                      <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                        Completed
                      </span>
                    </>
                  ) : (
                    <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                      Pending
                    </span>
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Delivery Status</p>
                <div className="flex items-center gap-2">
                  {order.deliveryStatus === 'completed' ? (
                    <>
                      <CheckCircleIcon className="w-5 h-5 text-green-600" />
                      <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                        Delivered
                      </span>
                    </>
                  ) : (
                    <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                      Pending
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          {order.deliveryStatus !== 'completed' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-navy mb-4">Actions</h2>
              <button
                onClick={handleMarkAsDelivered}
                disabled={activating}
                className="w-full bg-teal text-white font-semibold py-3 rounded-lg hover:bg-teal/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {activating ? 'Activating...' : 'Mark as Delivered'}
                {!activating && <CheckCircleIcon className="w-5 h-5" />}
              </button>
              <p className="text-sm text-gray-600 mt-3">
                Click to confirm delivery and activate the subscription for this customer.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

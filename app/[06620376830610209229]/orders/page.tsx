'use client';

import { useEffect, useState } from 'react';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  EllipsisVerticalIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface Order {
  id: string;
  fullName: string;
  email: string;
  region: string;
  productId: string;
  adultChannels: boolean;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'cancelled';
  deliveryStatus: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
  notes?: string;
}

const statusColors = {
  pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  paid: 'bg-green-500/10 text-green-500 border-green-500/20',
  failed: 'bg-red-500/10 text-red-500 border-red-500/20',
  cancelled: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
};

const deliveryStatusColors = {
  pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  processing: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  completed: 'bg-green-500/10 text-green-500 border-green-500/20',
  failed: 'bg-red-500/10 text-red-500 border-red-500/20',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deliveryFilter, setDeliveryFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter, deliveryFilter]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.paymentStatus === statusFilter);
    }

    // Delivery filter
    if (deliveryFilter !== 'all') {
      filtered = filtered.filter(order => order.deliveryStatus === deliveryFilter);
    }

    setFilteredOrders(filtered);
  };

  const updateOrderStatus = async (orderId: string, statusType: 'payment' | 'delivery', status: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          [statusType === 'payment' ? 'paymentStatus' : 'deliveryStatus']: status
        }),
      });

      if (response.ok) {
        fetchOrders(); // Refresh data
      }
    } catch (error) {
      console.error('Failed to update order:', error);
    }
  };

  const deleteOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to delete this order?')) return;

    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchOrders(); // Refresh data
      }
    } catch (error) {
      console.error('Failed to delete order:', error);
    }
  };

  const getPlanName = (productId: string) => {
    const plans: Record<string, string> = {
      'plan_3m': '3 Months',
      'plan_6m': '6 Months',
      'plan_12m': '12 Months',
    };
    return plans[productId] || productId;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-surface rounded-xl p-6 animate-pulse">
          <div className="h-8 bg-border rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-border rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text">Orders Management</h1>
          <p className="text-text-muted mt-1">Manage and track all customer orders</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
          <PlusIcon className="h-4 w-4" />
          New Order
        </button>
      </div>

      {/* Filters */}
      <div className="bg-surface rounded-xl border border-border p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search by name, email, or order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Status Filters */}
          <div className="flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Payment Status</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              value={deliveryFilter}
              onChange={(e) => setDeliveryFilter(e.target.value)}
              className="px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Delivery Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Order</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Plan</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Payment</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Delivery</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-background/25 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-text">{order.id.slice(-8)}</div>
                    <div className="text-xs text-text-muted">{order.region}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-text">{order.fullName}</div>
                    <div className="text-xs text-text-muted">{order.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-text">{getPlanName(order.productId)}</div>
                    {order.adultChannels && (
                      <div className="text-xs text-accent">+ Adult Channels</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${statusColors[order.paymentStatus]}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${deliveryStatusColors[order.deliveryStatus]}`}>
                      {order.deliveryStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Menu as="div" className="relative inline-block text-left">
                      <Menu.Button className="p-2 rounded-lg hover:bg-background transition-colors">
                        <EllipsisVerticalIcon className="h-4 w-4 text-text-muted" />
                      </Menu.Button>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-lg shadow-lg z-10">
                          <div className="py-1">
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  onClick={() => setSelectedOrder(order)}
                                  className={`${
                                    active ? 'bg-background' : ''
                                  } flex items-center gap-2 w-full px-4 py-2 text-sm text-text`}
                                >
                                  <EyeIcon className="h-4 w-4" />
                                  View Details
                                </button>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  onClick={() => updateOrderStatus(order.id, 'payment', 'paid')}
                                  className={`${
                                    active ? 'bg-background' : ''
                                  } flex items-center gap-2 w-full px-4 py-2 text-sm text-text`}
                                >
                                  <CheckCircleIcon className="h-4 w-4" />
                                  Mark as Paid
                                </button>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  onClick={() => updateOrderStatus(order.id, 'delivery', 'completed')}
                                  className={`${
                                    active ? 'bg-background' : ''
                                  } flex items-center gap-2 w-full px-4 py-2 text-sm text-text`}
                                >
                                  <CheckCircleIcon className="h-4 w-4" />
                                  Mark Delivered
                                </button>
                              )}
                            </Menu.Item>
                            <div className="border-t border-border my-1"></div>
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  onClick={() => deleteOrder(order.id)}
                                  className={`${
                                    active ? 'bg-red-500/10' : ''
                                  } flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500`}
                                >
                                  <TrashIcon className="h-4 w-4" />
                                  Delete Order
                                </button>
                              )}
                            </Menu.Item>
                          </div>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="px-6 py-12 text-center">
            <div className="text-text-muted">
              <FunnelIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No orders found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-xl border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h2 className="text-lg font-semibold text-text">Order Details</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-lg hover:bg-background transition-colors"
              >
                <XCircleIcon className="h-5 w-5 text-text-muted" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-text-muted">Order ID</label>
                  <p className="text-text font-mono">{selectedOrder.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-muted">Date</label>
                  <p className="text-text">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-muted">Customer</label>
                  <p className="text-text">{selectedOrder.fullName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-muted">Email</label>
                  <p className="text-text">{selectedOrder.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-muted">Region</label>
                  <p className="text-text">{selectedOrder.region}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-muted">Plan</label>
                  <p className="text-text">{getPlanName(selectedOrder.productId)}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium text-text-muted">Payment Status</label>
                  <select
                    value={selectedOrder.paymentStatus}
                    onChange={(e) => updateOrderStatus(selectedOrder.id, 'payment', e.target.value)}
                    className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Failed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium text-text-muted">Delivery Status</label>
                  <select
                    value={selectedOrder.deliveryStatus}
                    onChange={(e) => updateOrderStatus(selectedOrder.id, 'delivery', e.target.value)}
                    className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-text-muted">Notes</label>
                <textarea
                  value={selectedOrder.notes || ''}
                  onChange={(e) => setSelectedOrder({...selectedOrder, notes: e.target.value})}
                  placeholder="Add internal notes..."
                  className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary min-h-[80px]"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
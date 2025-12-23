'use client';

import { useEffect, useState } from 'react';
import {
  MagnifyingGlassIcon,
  EyeIcon,
  TrashIcon,
  EllipsisVerticalIcon,
  UserGroupIcon,
  MapPinIcon,
  CalendarIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface Client {
  id: string;
  fullName: string;
  email: string;
  region: string;
  source?: string;
  createdAt: string;
  ordersCount?: number;
  totalSpent?: number;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    filterClients();
  }, [clients, searchTerm, regionFilter]);

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/admin/clients');
      if (response.ok) {
        const data = await response.json();
        // Add mock order data for demonstration
        const clientsWithStats = data.map((client: Client) => ({
          ...client,
          ordersCount: Math.floor(Math.random() * 5) + 1,
          totalSpent: Math.floor(Math.random() * 200) + 50,
        }));
        setClients(clientsWithStats);
      }
    } catch (error) {
      console.error('Failed to fetch clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterClients = () => {
    let filtered = clients;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(client =>
        client.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Region filter
    if (regionFilter !== 'all') {
      filtered = filtered.filter(client => client.region === regionFilter);
    }

    setFilteredClients(filtered);
  };

  const deleteClient = async (clientId: string) => {
    if (!confirm('Are you sure you want to delete this client? This action cannot be undone.')) return;

    try {
      const response = await fetch(`/api/admin/clients/${clientId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchClients(); // Refresh data
      }
    } catch (error) {
      console.error('Failed to delete client:', error);
    }
  };

  const getUniqueRegions = () => {
    const regions = [...new Set(clients.map(client => client.region))];
    return regions.sort();
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
          <h1 className="text-3xl font-bold text-text">Clients Management</h1>
          <p className="text-text-muted mt-1">Manage customer data and view client history</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-text-muted">
            Total: {clients.length} clients
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-surface rounded-xl p-6 border border-border">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <UserGroupIcon className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text">{clients.length}</p>
              <p className="text-sm text-text-muted">Total Clients</p>
            </div>
          </div>
        </div>
        <div className="bg-surface rounded-xl p-6 border border-border">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-500/10 rounded-lg">
              <ShoppingBagIcon className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text">
                {clients.reduce((sum, client) => sum + (client.ordersCount || 0), 0)}
              </p>
              <p className="text-sm text-text-muted">Total Orders</p>
            </div>
          </div>
        </div>
        <div className="bg-surface rounded-xl p-6 border border-border">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <MapPinIcon className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text">{getUniqueRegions().length}</p>
              <p className="text-sm text-text-muted">Regions</p>
            </div>
          </div>
        </div>
        <div className="bg-surface rounded-xl p-6 border border-border">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-500/10 rounded-lg">
              <CalendarIcon className="h-6 w-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text">
                {Math.round(clients.reduce((sum, client) => sum + (client.totalSpent || 0), 0) / clients.length) || 0}
              </p>
              <p className="text-sm text-text-muted">Avg. Spent</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-surface rounded-xl border border-border p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Region Filter */}
          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Regions</option>
            {getUniqueRegions().map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Client</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Region</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Orders</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Total Spent</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Joined</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-background/25 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-text">{client.fullName}</div>
                    <div className="text-xs text-text-muted">{client.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <MapPinIcon className="h-4 w-4 text-text-muted" />
                      <span className="text-sm text-text">{client.region}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-text font-medium">{client.ordersCount}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-text font-medium">${client.totalSpent}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted">
                    {new Date(client.createdAt).toLocaleDateString()}
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
                                  onClick={() => setSelectedClient(client)}
                                  className={`${
                                    active ? 'bg-background' : ''
                                  } flex items-center gap-2 w-full px-4 py-2 text-sm text-text`}
                                >
                                  <EyeIcon className="h-4 w-4" />
                                  View Details
                                </button>
                              )}
                            </Menu.Item>
                            <div className="border-t border-border my-1"></div>
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  onClick={() => deleteClient(client.id)}
                                  className={`${
                                    active ? 'bg-red-500/10' : ''
                                  } flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500`}
                                >
                                  <TrashIcon className="h-4 w-4" />
                                  Delete Client
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

        {filteredClients.length === 0 && (
          <div className="px-6 py-12 text-center">
            <div className="text-text-muted">
              <UserGroupIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No clients found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          </div>
        )}
      </div>

      {/* Client Details Modal */}
      {selectedClient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-xl border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h2 className="text-lg font-semibold text-text">Client Details</h2>
              <button
                onClick={() => setSelectedClient(null)}
                className="p-2 rounded-lg hover:bg-background transition-colors"
              >
                <svg className="h-5 w-5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-text-muted">Full Name</label>
                  <p className="text-text font-medium">{selectedClient.fullName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-muted">Email</label>
                  <p className="text-text">{selectedClient.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-muted">Region</label>
                  <p className="text-text">{selectedClient.region}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-muted">Joined</label>
                  <p className="text-text">{new Date(selectedClient.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{selectedClient.ordersCount}</p>
                  <p className="text-sm text-text-muted">Total Orders</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-secondary">${selectedClient.totalSpent}</p>
                  <p className="text-sm text-text-muted">Total Spent</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-accent">
                    ${selectedClient.totalSpent && selectedClient.ordersCount ?
                      Math.round(selectedClient.totalSpent / selectedClient.ordersCount) : 0}
                  </p>
                  <p className="text-sm text-text-muted">Avg. Order</p>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <h3 className="text-lg font-medium text-text mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm text-text">Account created</p>
                      <p className="text-xs text-text-muted">{new Date(selectedClient.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  {selectedClient.ordersCount && selectedClient.ordersCount > 0 && (
                    <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm text-text">{selectedClient.ordersCount} orders placed</p>
                        <p className="text-xs text-text-muted">Total spent: ${selectedClient.totalSpent}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
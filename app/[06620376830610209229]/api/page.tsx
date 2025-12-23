'use client';

import { useState } from 'react';
import {
  WrenchScrewdriverIcon,
  DocumentTextIcon,
  ServerIcon,
  BoltIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  
} from '@heroicons/react/24/outline';

interface Endpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  example: string;
  response: string;
}

const endpoints: Endpoint[] = [
  {
    method: 'GET',
    path: '/api/admin/orders',
    description: 'List all orders with optional filtering',
    example: `fetch('/api/admin/orders?status=paid&limit=10')
  .then(res => res.json())
  .then(data => console.log(data))`,
    response: `{
  "orders": [
    {
      "id": "order_123",
      "fullName": "John Doe",
      "email": "john@example.com",
      "paymentStatus": "paid",
      "deliveryStatus": "completed",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}`
  },
  {
    method: 'GET',
    path: '/api/admin/orders/[id]',
    description: 'Get detailed information about a specific order',
    example: `fetch('/api/admin/orders/order_123')
  .then(res => res.json())
  .then(data => console.log(data))`,
    response: `{
  "id": "order_123",
  "fullName": "John Doe",
  "email": "john@example.com",
  "productId": "plan_12m",
  "paymentStatus": "paid",
  "deliveryStatus": "completed",
  "createdAt": "2024-01-15T10:30:00Z"
}`
  },
  {
    method: 'PUT',
    path: '/api/admin/orders/[id]',
    description: 'Update order status or add notes',
    example: `fetch('/api/admin/orders/order_123', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    paymentStatus: 'paid',
    deliveryStatus: 'completed',
    notes: 'Customer requested expedited delivery'
  })
})`,
    response: `{
  "id": "order_123",
  "paymentStatus": "paid",
  "deliveryStatus": "completed",
  "updatedAt": "2024-01-15T11:00:00Z"
}`
  },
  {
    method: 'DELETE',
    path: '/api/admin/orders/[id]',
    description: 'Delete an order (use with caution)',
    example: `fetch('/api/admin/orders/order_123', {
  method: 'DELETE'
})`,
    response: `{
  "message": "Order deleted successfully"
}`
  },
  {
    method: 'GET',
    path: '/api/admin/clients',
    description: 'List all clients with their order history',
    example: `fetch('/api/admin/clients')
  .then(res => res.json())
  .then(data => console.log(data))`,
    response: `{
  "clients": [
    {
      "id": "client_456",
      "fullName": "Jane Smith",
      "email": "jane@example.com",
      "region": "Europe",
      "ordersCount": 3,
      "totalSpent": 150
    }
  ]
}`
  }
];

const automationExamples = [
  {
    title: 'Auto-Delivery Script',
    language: 'JavaScript',
    code: `// Auto-delivery script for Telegram bot
const TELEGRAM_BOT_TOKEN = 'your_bot_token';
const ADMIN_API_URL = 'https://yourdomain.com/api/admin';

async function checkAndDeliverOrders() {
  try {
    // Get pending orders
    const response = await fetch(\`\${ADMIN_API_URL}/orders?status=paid&deliveryStatus=pending\`);
    const { orders } = await response.json();

    for (const order of orders) {
      // Deliver the service (your delivery logic here)
      await deliverService(order);

      // Update order status
      await fetch(\`\${ADMIN_API_URL}/orders/\${order.id}\`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deliveryStatus: 'completed',
          notes: 'Auto-delivered via Telegram bot'
        })
      });

      // Notify customer
      await notifyCustomer(order);
    }
  } catch (error) {
    console.error('Auto-delivery failed:', error);
  }
}

// Run every 5 minutes
setInterval(checkAndDeliverOrders, 5 * 60 * 1000);`
  },
  {
    title: 'Order Status Webhook',
    language: 'Python',
    code: `import requests
import json
from flask import Flask, request

app = Flask(__name__)
ADMIN_API_URL = 'https://yourdomain.com/api/admin'

@app.route('/webhook/order-status', methods=['POST'])
def order_status_webhook():
    data = request.json

    # Process webhook data
    order_id = data.get('order_id')
    new_status = data.get('status')

    # Update order in admin panel
    update_response = requests.put(
        f"{ADMIN_API_URL}/orders/{order_id}",
        json={'paymentStatus': new_status},
        headers={'Content-Type': 'application/json'}
    )

    if update_response.status_code == 200:
        return {'status': 'success'}, 200
    else:
        return {'status': 'error'}, 500

if __name__ == '__main__':
    app.run(port=5000)`
  }
];

export default function ApiAutomationPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'POST': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'PUT': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'DELETE': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text">API & Automation</h1>
        <p className="text-text-muted mt-2">Integrate with external services and automate your workflow</p>
      </div>

      {/* API Status */}
      <div className="bg-surface rounded-xl border border-border p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-500/10 rounded-lg">
            <ServerIcon className="h-6 w-6 text-green-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text">API Status</h3>
            <p className="text-text-muted">All endpoints are operational and ready for automation</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <CheckCircleIcon className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium text-green-500">Online</span>
          </div>
        </div>
      </div>

      {/* API Endpoints */}
      <div className="bg-surface rounded-xl border border-border">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-text">Available Endpoints</h2>
        </div>
        <div className="divide-y divide-border">
          {endpoints.map((endpoint, index) => (
            <div key={index} className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-2 py-1 text-xs font-bold rounded border ${getMethodColor(endpoint.method)}`}>
                      {endpoint.method}
                    </span>
                    <code className="text-sm font-mono text-text bg-background px-2 py-1 rounded">
                      {endpoint.path}
                    </code>
                  </div>
                  <p className="text-text-muted mb-4">{endpoint.description}</p>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-text mb-2">Example Request</h4>
                      <div className="relative">
                        <pre className="text-xs bg-background p-3 rounded-lg overflow-x-auto">
                          <code>{endpoint.example}</code>
                        </pre>
                        <button
                          onClick={() => copyToClipboard(endpoint.example, `example-${index}`)}
                          className="absolute top-2 right-2 p-1 bg-surface/50 hover:bg-surface rounded transition-colors"
                        >
                          {copiedCode === `example-${index}` ? (
                            <CheckCircleIcon className="h-4 w-4 text-green-500" />
                          ) : (
                            <DocumentTextIcon className="h-4 w-4 text-text-muted" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-text mb-2">Response</h4>
                      <pre className="text-xs bg-background p-3 rounded-lg overflow-x-auto">
                        <code>{endpoint.response}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Automation Examples */}
      <div className="bg-surface rounded-xl border border-border">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-text">Automation Examples</h2>
        </div>
        <div className="p-6 space-y-6">
          {automationExamples.map((example, index) => (
            <div key={index} className="border border-border rounded-lg p-4">
              <div className="flex items-center gap-3 mb-4">
                <BoltIcon className="h-5 w-5 text-yellow-500" />
                <h3 className="text-lg font-medium text-text">{example.title}</h3>
                <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded">
                  {example.language}
                </span>
              </div>

              <div className="relative">
                <pre className="text-sm bg-background p-4 rounded-lg overflow-x-auto">
                  <code>{example.code}</code>
                </pre>
                <button
                  onClick={() => copyToClipboard(example.code, `automation-${index}`)}
                  className="absolute top-4 right-4 p-2 bg-surface/50 hover:bg-surface rounded-lg transition-colors"
                >
                  {copiedCode === `automation-${index}` ? (
                    <CheckCircleIcon className="h-4 w-4 text-green-500" />
                  ) : (
                    <DocumentTextIcon className="h-4 w-4 text-text-muted" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Integration Guide */}
      <div className="bg-surface rounded-xl border border-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <WrenchScrewdriverIcon className="h-6 w-6 text-primary" />
          <h2 className="text-lg font-semibold text-text">Integration Guide</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-text mb-2">Authentication</h3>
            <p className="text-sm text-text-muted mb-3">
              All admin API endpoints require authentication. Use your admin session cookies or implement API key authentication.
            </p>
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-500">Security Notice</p>
                  <p className="text-xs text-yellow-500/80">Keep your admin credentials secure and use HTTPS for all API calls.</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-text mb-2">Rate Limiting</h3>
            <p className="text-sm text-text-muted mb-3">
              API endpoints are rate-limited to prevent abuse. Implement exponential backoff for failed requests.
            </p>
            <div className="text-sm">
              <p className="font-medium text-text">Limits:</p>
              <ul className="text-text-muted mt-1 space-y-1">
                <li>• 100 requests per minute for read operations</li>
                <li>• 50 requests per minute for write operations</li>
                <li>• 10 requests per minute for delete operations</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border">
          <h3 className="font-medium text-text mb-3">Webhook Integration</h3>
          <p className="text-sm text-text-muted mb-4">
            Set up webhooks to receive real-time notifications about order status changes and other events.
          </p>
          <div className="bg-background rounded-lg p-4">
            <code className="text-sm">
              POST /api/webhooks/orders<br />
              Content-Type: application/json<br />
              <br />
              {`{
  "event": "order.status_changed",
  "orderId": "order_123",
  "oldStatus": "pending",
  "newStatus": "paid",
  "timestamp": "2024-01-15T10:30:00Z"
}`}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
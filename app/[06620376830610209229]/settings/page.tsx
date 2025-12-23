import { Suspense } from 'react';
import { Settings } from '@/components/admin/Settings';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-gray-400 mt-1">Configure your admin preferences and system settings</p>
        </div>
      </div>

      <Suspense fallback={<div className="text-white">Loading settings...</div>}>
        <Settings />
      </Suspense>
    </div>
  );
}
import React from 'react';

const SettingsPage: React.FC = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Clinic configuration and preferences</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div className="text-6xl mb-4">⚙️</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Clinic Settings</h2>
        <p className="text-gray-600 mb-6">
          This page will contain settings and configuration options including:
        </p>
        <ul className="text-left max-w-md mx-auto space-y-2 text-gray-600">
          <li>• Clinic information and branding</li>
          <li>• Working hours and availability</li>
          <li>• Appointment types and durations</li>
          <li>• User management and permissions</li>
          <li>• Notification preferences</li>
          <li>• Integration settings</li>
        </ul>
        <div className="mt-6 p-3 bg-red-50 border border-red-200 rounded">
          <p className="text-sm text-red-800">
            🔒 This page is restricted to clinic administrators only.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
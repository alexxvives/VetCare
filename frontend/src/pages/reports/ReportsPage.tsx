import React from 'react';

const ReportsPage: React.FC = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-600">Analytics and reporting dashboard</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div className="text-6xl mb-4">📈</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Reports & Analytics</h2>
        <p className="text-gray-600 mb-6">
          This page will contain reporting features including:
        </p>
        <ul className="text-left max-w-md mx-auto space-y-2 text-gray-600">
          <li>• Financial reports</li>
          <li>• Appointment statistics</li>
          <li>• Client and pet demographics</li>
          <li>• Treatment outcomes</li>
          <li>• Staff performance metrics</li>
          <li>• Custom report builder</li>
        </ul>
        <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-sm text-yellow-800">
            🔒 This page is restricted to administrators and veterinarians only.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
import React from 'react';

const ClientsPage: React.FC = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
        <p className="text-gray-600">Manage your clinic's client information</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div className="text-6xl mb-4">👥</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Client Management</h2>
        <p className="text-gray-600 mb-6">
          This page will contain the client management features including:
        </p>
        <ul className="text-left max-w-md mx-auto space-y-2 text-gray-600">
          <li>• Client directory and search</li>
          <li>• Add and edit client information</li>
          <li>• Contact details and emergency contacts</li>
          <li>• Client history and notes</li>
          <li>• Billing information</li>
          <li>• Client communication</li>
        </ul>
      </div>
    </div>
  );
};

export default ClientsPage;
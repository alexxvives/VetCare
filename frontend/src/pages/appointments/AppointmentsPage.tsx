import React from 'react';

const AppointmentsPage: React.FC = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
        <p className="text-gray-600">Manage your clinic appointments</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div className="text-6xl mb-4">📅</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Appointments Module</h2>
        <p className="text-gray-600 mb-6">
          This page will contain the appointment management features including:
        </p>
        <ul className="text-left max-w-md mx-auto space-y-2 text-gray-600">
          <li>• Calendar view of appointments</li>
          <li>• Schedule new appointments</li>
          <li>• Edit and cancel appointments</li>
          <li>• Appointment reminders</li>
          <li>• Waiting room management</li>
          <li>• Time slot management</li>
        </ul>
      </div>
    </div>
  );
};

export default AppointmentsPage;
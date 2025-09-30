import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

const DashboardPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { currentClinic } = useSelector((state: RootState) => state.clinic);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to your VetCare dashboard</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="text-3xl text-blue-600 mr-4">📅</div>
            <div>
              <div className="text-2xl font-bold text-gray-900">12</div>
              <div className="text-sm text-gray-500">Today's Appointments</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="text-3xl text-green-600 mr-4">👥</div>
            <div>
              <div className="text-2xl font-bold text-gray-900">248</div>
              <div className="text-sm text-gray-500">Active Clients</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="text-3xl text-yellow-600 mr-4">🐕</div>
            <div>
              <div className="text-2xl font-bold text-gray-900">387</div>
              <div className="text-sm text-gray-500">Registered Pets</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="text-3xl text-purple-600 mr-4">💰</div>
            <div>
              <div className="text-2xl font-bold text-gray-900">$4,240</div>
              <div className="text-sm text-gray-500">This Month's Revenue</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Appointments</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                      🐕
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Max (Golden Retriever)</div>
                      <div className="text-sm text-gray-500">John Smith • 2:00 PM</div>
                    </div>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    Completed
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 text-center">
                <div className="text-2xl mb-2">📅</div>
                <div className="text-sm font-medium">New Appointment</div>
              </button>
              <button className="p-4 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 text-center">
                <div className="text-2xl mb-2">👥</div>
                <div className="text-sm font-medium">Add Client</div>
              </button>
              <button className="p-4 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 text-center">
                <div className="text-2xl mb-2">🐕</div>
                <div className="text-sm font-medium">Register Pet</div>
              </button>
              <button className="p-4 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 text-center">
                <div className="text-2xl mb-2">📋</div>
                <div className="text-sm font-medium">Medical Record</div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Message */}
      {user && currentClinic && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-blue-900 mb-2">
            Welcome, Dr. {user.first_name}!
          </h3>
          <p className="text-blue-700">
            You're currently managing {currentClinic.name}. 
            {user.role === 'clinic_admin' && ' As an administrator, you have full access to all clinic features.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
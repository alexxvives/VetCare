import React from 'react';

const PetsPage: React.FC = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pets</h1>
        <p className="text-gray-600">Manage pet profiles and information</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div className="text-6xl mb-4">🐕</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Pet Management</h2>
        <p className="text-gray-600 mb-6">
          This page will contain the pet management features including:
        </p>
        <ul className="text-left max-w-md mx-auto space-y-2 text-gray-600">
          <li>• Pet registry and profiles</li>
          <li>• Pet photos and documentation</li>
          <li>• Breed and species information</li>
          <li>• Vaccination records</li>
          <li>• Medical history</li>
          <li>• Insurance information</li>
        </ul>
      </div>
    </div>
  );
};

export default PetsPage;
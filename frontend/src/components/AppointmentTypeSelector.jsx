import React from 'react';
import { assets } from '../assets/assets';

const AppointmentTypeSelector = ({ selectedType, onTypeSelect }) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Appointment Type</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => onTypeSelect('doctor')}
          className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
            selectedType === 'doctor'
              ? 'border-blue-500 bg-blue-50 shadow-sm'
              : 'border-gray-200 hover:border-blue-200'
          }`}
        >
          <div className="bg-blue-100 p-3 rounded-lg">
            <img src={assets.doctor_icon} alt="Doctor" className="w-8 h-8" />
          </div>
          <div className="text-left">
            <h4 className="font-medium text-gray-900">Doctor Appointment</h4>
            <p className="text-sm text-gray-500">Book a consultation with a specific doctor</p>
          </div>
        </button>

        <button
          onClick={() => onTypeSelect('hospital')}
          className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
            selectedType === 'hospital'
              ? 'border-blue-500 bg-blue-50 shadow-sm'
              : 'border-gray-200 hover:border-blue-200'
          }`}
        >
          <div className="bg-blue-100 p-3 rounded-lg">
            <img src={assets.hospital_icon} alt="Hospital" className="w-8 h-8" />
          </div>
          <div className="text-left">
            <h4 className="font-medium text-gray-900">Hospital Appointment</h4>
            <p className="text-sm text-gray-500">Schedule a visit to a hospital</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default AppointmentTypeSelector;
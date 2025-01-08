import React from 'react';
import { FormData } from './types';

interface StepOneProps {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export default function StepOne({ formData, handleInputChange }: StepOneProps) {
  return (
    <div className="space-y-4">
      <div className="flex gap-4 mb-6">
        <button
          type="button"
          className={`flex-1 py-2 px-4 rounded-lg ${
            formData.userType === 'student'
              ? 'bg-green-800 text-white'
              : 'bg-gray-100'
          }`}
          onClick={() => handleInputChange({ target: { name: 'userType', value: 'student' } } as any)}
        >
          I'm a Student
        </button>
        <button
          type="button"
          className={`flex-1 py-2 px-4 rounded-lg ${
            formData.userType === 'alumni'
              ? 'bg-green-800 text-white'
              : 'bg-gray-100'
          }`}
          onClick={() => handleInputChange({ target: { name: 'userType', value: 'alumni' } } as any)}
        >
          I'm an Alumni
        </button>
      </div>

      <h3 className="text-lg font-semibold">Personal Information</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full Name *
        </label>
        <input
          type="text"
          name="fullName"
          required
          className="w-full p-2 border rounded-lg"
          value={formData.fullName}
          onChange={handleInputChange}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email Address *
        </label>
        <input
          type="email"
          name="email"
          required
          className="w-full p-2 border rounded-lg"
          value={formData.email}
          onChange={handleInputChange}
        />
      </div>

      {formData.userType === 'student' ? (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current Year *
          </label>
          <select
            name="currentYear"
            required
            className="w-full p-2 border rounded-lg"
            value={formData.currentYear}
            onChange={handleInputChange}
          >
            <option value="">Select Year</option>
            <option value="Freshman">Freshman</option>
            <option value="Sophomore">Sophomore</option>
            <option value="Junior">Junior</option>
            <option value="Senior">Senior</option>
            <option value="Graduate">Graduate</option>
          </select>
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Graduation Year *
          </label>
          <input
            type="text"
            name="graduationYear"
            required
            className="w-full p-2 border rounded-lg"
            value={formData.graduationYear}
            onChange={handleInputChange}
          />
        </div>
      )}
    </div>
  );
}
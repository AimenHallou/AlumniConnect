import React from 'react';
import { FormData } from './types';

interface StepTwoProps {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export default function StepTwo({ formData, handleInputChange }: StepTwoProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Education & Location</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Degree/Major *
        </label>
        <input
          type="text"
          name="degree"
          required
          className="w-full p-2 border rounded-lg"
          value={formData.degree}
          onChange={handleInputChange}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Current City/State *
        </label>
        <input
          type="text"
          name="location"
          required
          className="w-full p-2 border rounded-lg"
          value={formData.location}
          onChange={handleInputChange}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          LinkedIn Profile (Optional)
        </label>
        <input
          type="url"
          name="linkedIn"
          className="w-full p-2 border rounded-lg"
          value={formData.linkedIn}
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
}
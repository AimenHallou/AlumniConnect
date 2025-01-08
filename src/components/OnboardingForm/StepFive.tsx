import React from 'react';
import { FormData } from './types';

interface StepFiveProps {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleMultiSelect: (name: string, value: string) => void;
}

export default function StepFive({ formData, handleInputChange, handleCheckboxChange, handleMultiSelect }: StepFiveProps) {
  if (formData.userType === 'student') {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Professional Development</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Have you completed any internships or job experiences? *
          </label>
          <div className="space-x-4 mb-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="hasInternshipExperience"
                checked={formData.hasInternshipExperience}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              Yes
            </label>
          </div>
          {formData.hasInternshipExperience && (
            <textarea
              name="experience"
              className="w-full p-2 border rounded-lg"
              value={formData.experience}
              onChange={handleInputChange}
              placeholder="Please provide details about your experience"
              rows={3}
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Clubs, organizations, or extracurricular activities
          </label>
          <textarea
            name="activities"
            className="w-full p-2 border rounded-lg"
            value={formData.activities}
            onChange={handleInputChange}
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Certifications or special skills
          </label>
          <textarea
            name="certifications"
            className="w-full p-2 border rounded-lg"
            value={formData.certifications}
            onChange={handleInputChange}
            rows={3}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Availability & Communication</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Preferred method of communication *
        </label>
        {['Email', 'Phone', 'Virtual Meetings', 'In-person Meetings'].map(method => (
          <label key={method} className="block">
            <input
              type="checkbox"
              checked={formData.communicationPreference.includes(method)}
              onChange={() => handleMultiSelect('communicationPreference', method)}
              className="mr-2"
            />
            {method}
          </label>
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Availability for mentoring or networking *
        </label>
        {['Weekdays', 'Weekends', 'Mornings', 'Afternoons', 'Evenings', 'Flexible'].map(time => (
          <label key={time} className="block">
            <input
              type="checkbox"
              checked={formData.availability.includes(time)}
              onChange={() => handleMultiSelect('availability', time)}
              className="mr-2"
            />
            {time}
          </label>
        ))}
      </div>
    </div>
  );
}
import React from 'react';
import { FormData } from './types';

interface StepFourProps {
  formData: FormData;
  handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleMultiSelect: (name: string, value: string) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export default function StepFour({ formData, handleCheckboxChange, handleMultiSelect, handleInputChange }: StepFourProps) {
  if (formData.userType === 'alumni') {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Alumni Engagement</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Would you like to mentor current students? *
          </label>
          <div className="space-x-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="willingToMentor"
                checked={formData.willingToMentor}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              Yes
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Are you open to offering internships or job placements? *
          </label>
          <div className="space-x-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="offerInternships"
                checked={formData.offerInternships}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              Yes
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Are you looking to connect with other alumni? *
          </label>
          <div className="space-x-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="seekingConnections"
                checked={formData.seekingConnections}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              Yes
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            What type of connections are you seeking? *
          </label>
          {['Networking', 'Business Partnerships', 'Knowledge Sharing', 'Mentoring', 'Industry Collaboration'].map(type => (
            <label key={type} className="block">
              <input
                type="checkbox"
                checked={formData.connectionTypes.includes(type)}
                onChange={() => handleMultiSelect('connectionTypes', type)}
                className="mr-2"
              />
              {type}
            </label>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Mentorship Interest</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Would you like to be paired with an alumni mentor? *
        </label>
        <div className="space-x-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              name="needMentorship"
              checked={formData.needMentorship}
              onChange={handleCheckboxChange}
              className="mr-2"
            />
            Yes
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Areas where you need guidance or mentorship *
        </label>
        {['Resume Writing', 'Interview Preparation', 'Career Planning', 'Industry Knowledge', 'Networking Skills'].map(area => (
          <label key={area} className="block">
            <input
              type="checkbox"
              checked={formData.mentorshipAreas.includes(area)}
              onChange={() => handleMultiSelect('mentorshipAreas', area)}
              className="mr-2"
            />
            {area}
          </label>
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Preferred method of mentorship *
        </label>
        <select
          name="mentorshipPreference"
          required
          className="w-full p-2 border rounded-lg"
          value={formData.mentorshipPreference}
          onChange={handleInputChange}
        >
          <option value="">Select Preference</option>
          <option value="Virtual">Virtual</option>
          <option value="In-person">In-person</option>
          <option value="Both">Both</option>
        </select>
      </div>
    </div>
  );
}
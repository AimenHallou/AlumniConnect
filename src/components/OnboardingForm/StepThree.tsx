import React from 'react';
import { FormData } from './types';

interface StepThreeProps {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function StepThree({ formData, handleInputChange, handleCheckboxChange }: StepThreeProps) {
  if (formData.userType === 'alumni') {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Professional Details</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current Job Title *
          </label>
          <input
            type="text"
            name="jobTitle"
            required
            className="w-full p-2 border rounded-lg"
            value={formData.jobTitle}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current Employer/Organization *
          </label>
          <input
            type="text"
            name="employer"
            required
            className="w-full p-2 border rounded-lg"
            value={formData.employer}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Industry/Field *
          </label>
          <input
            type="text"
            name="industry"
            required
            className="w-full p-2 border rounded-lg"
            value={formData.industry}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Areas of expertise or topics you're willing to discuss *
          </label>
          <textarea
            name="expertiseAreas"
            required
            className="w-full p-2 border rounded-lg"
            value={formData.expertiseAreas}
            onChange={handleInputChange}
            rows={3}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Career Goals</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          What career or field are you interested in pursuing? *
        </label>
        <input
          type="text"
          name="careerInterest"
          required
          className="w-full p-2 border rounded-lg"
          value={formData.careerInterest}
          onChange={handleInputChange}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          What skills or experiences are you looking to gain? *
        </label>
        <textarea
          name="skillsToGain"
          required
          className="w-full p-2 border rounded-lg"
          value={formData.skillsToGain}
          onChange={handleInputChange}
          placeholder="e.g., Internships, Mentorship, Job Opportunities"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Are you currently seeking an internship or job? *
        </label>
        <div className="space-x-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              name="seekingInternship"
              checked={formData.seekingInternship}
              onChange={handleCheckboxChange}
              className="mr-2"
            />
            Yes
          </label>
        </div>
      </div>
    </div>
  );
}
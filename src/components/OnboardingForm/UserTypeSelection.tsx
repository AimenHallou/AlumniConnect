import React from 'react';
import { FormData } from './types';

interface UserTypeSelectionProps {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onComplete: () => void;
}

export default function UserTypeSelection({ formData, handleInputChange, onComplete }: UserTypeSelectionProps) {
  const handleSelection = (userType: 'student' | 'alumni') => {
    handleInputChange({ target: { name: 'userType', value: userType } } as any);
    onComplete();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-center mb-4">I am a...</h2>
      <div className="flex gap-4">
        <button
          type="button"
          className={`flex-1 py-4 px-6 rounded-lg text-lg font-medium transition-colors
            ${formData.userType === 'student'
              ? 'bg-green-800 text-white'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
          onClick={() => handleSelection('student')}
        >
          Student
        </button>
        <button
          type="button"
          className={`flex-1 py-4 px-6 rounded-lg text-lg font-medium transition-colors
            ${formData.userType === 'alumni'
              ? 'bg-green-800 text-white'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
          onClick={() => handleSelection('alumni')}
        >
          Alumni
        </button>
      </div>
    </div>
  );
} 
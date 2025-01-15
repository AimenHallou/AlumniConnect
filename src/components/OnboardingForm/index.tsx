import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FormData {
  userType: 'student' | 'alumni';
  email: string;
}

const initialFormData: FormData = {
  userType: 'student',
  email: '',
};

interface OnboardingFormProps {
  onClose: () => void;
}

export default function OnboardingForm({ onClose }: OnboardingFormProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const navigationState = { 
      email: formData.email,
      userType: formData.userType,
    };
    
    onClose();
    navigate('/register', { state: navigationState });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Join AlumniConnect</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                I am a:
              </label>
              <select
                name="userType"
                value={formData.userType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              >
                <option value="student">Student</option>
                <option value="alumni">Alumni</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="Enter your email"
              />
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 bg-green-800 text-white rounded-lg hover:bg-green-700"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FormData } from './types';
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import StepThree from './StepThree';
import StepFour from './StepFour';
import StepFive from './StepFive';

const initialFormData: FormData = {
  userType: 'student',
  fullName: '',
  email: '',
  graduationYear: '',
  currentYear: '',
  degree: '',
  location: '',
  linkedIn: '',
  jobTitle: '',
  employer: '',
  industry: '',
  willingToMentor: false,
  offerInternships: false,
  participateEvents: false,
  seekingInternship: false,
  needMentorship: false,
  seekingConnections: false,
  careerInterest: '',
  skillsToGain: '',
  connectionTypes: [],
  expertiseAreas: [],
  mentorshipAreas: [],
  communicationPreference: [],
  availability: [],
  experience: '',
  hasInternshipExperience: false,
  activities: '',
  certifications: '',
  mentorshipPreference: ''
};

interface OnboardingFormProps {
  onClose: () => void;
}

export default function OnboardingForm({ onClose }: OnboardingFormProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const totalSteps = formData.userType === 'student' ? 5 : 5;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleMultiSelect = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: (prev[name as keyof FormData] as string[]).includes(value)
        ? (prev[name as keyof FormData] as string[]).filter(item => item !== value)
        : [...(prev[name as keyof FormData] as string[]), value]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('OnboardingForm - Form Data before submission:', formData);
    
    localStorage.setItem('userData', JSON.stringify(formData));
    console.log('OnboardingForm - Data saved to localStorage:', JSON.parse(localStorage.getItem('userData') || '{}'));
    
    const navigationState = { 
      email: formData.email,
      fullName: formData.fullName,
      userType: formData.userType,
      graduationYear: formData.graduationYear,
      currentYear: formData.currentYear,
      degree: formData.degree,
      location: formData.location,
      linkedIn: formData.linkedIn
    };
    
    console.log('OnboardingForm - Navigation state being passed:', navigationState);
    
    onClose();
    navigate('/register', { state: navigationState });
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <StepOne formData={formData} handleInputChange={handleInputChange} />;
      case 2:
        return <StepTwo formData={formData} handleInputChange={handleInputChange} />;
      case 3:
        return <StepThree formData={formData} handleInputChange={handleInputChange} handleCheckboxChange={handleCheckboxChange} />;
      case 4:
        return <StepFour formData={formData} handleInputChange={handleInputChange} handleCheckboxChange={handleCheckboxChange} handleMultiSelect={handleMultiSelect} />;
      case 5:
        return <StepFive formData={formData} handleInputChange={handleInputChange} handleCheckboxChange={handleCheckboxChange} handleMultiSelect={handleMultiSelect} />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold">
                {formData.userType === 'student' ? 'Student' : 'Alumni'} Questionnaire
              </h2>
              <p className="text-sm text-gray-600">Step {step} of {totalSteps}</p>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {renderStep()}

            <div className="mt-8 flex justify-between">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-4 py-2 text-green-800 border border-green-800 rounded-lg hover:bg-green-50"
                >
                  Previous
                </button>
              )}
              {step < totalSteps ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="px-4 py-2 bg-green-800 text-white rounded-lg hover:bg-green-700 ml-auto"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-800 text-white rounded-lg hover:bg-green-700 ml-auto"
                >
                  Submit
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
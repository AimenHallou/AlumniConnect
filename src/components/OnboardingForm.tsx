import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type UserType = 'student' | 'alumni';

interface FormData {
  userType: UserType;
  // Personal Information
  fullName: string;
  email: string;
  graduationYear: string;
  currentYear: string;
  degree: string;
  location: string;
  linkedIn: string;
  // Professional Details
  jobTitle: string;
  employer: string;
  industry: string;
  // Engagement
  willingToMentor: boolean;
  offerInternships: boolean;
  participateEvents: boolean;
  seekingInternship: boolean;
  needMentorship: boolean;
  seekingConnections: boolean;
  // Goals and Interests
  careerInterest: string;
  skillsToGain: string;
  connectionTypes: string[];
  expertiseAreas: string[];
  mentorshipAreas: string[];
  communicationPreference: string[];
  availability: string[];
  // Professional Development
  experience: string;
  hasInternshipExperience: boolean;
  activities: string;
  certifications: string;
  mentorshipPreference: string;
}

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
      [name]: prev[name].includes(value)
        ? prev[name].filter(item => item !== value)
        : [...prev[name], value]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('userData', JSON.stringify(formData));
    onClose();
    navigate('/register', { state: { email: formData.email } });
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
            {step === 1 && (
              <div className="space-y-4">
                <div className="flex gap-4 mb-6">
                  <button
                    type="button"
                    className={`flex-1 py-2 px-4 rounded-lg ${
                      formData.userType === 'student'
                        ? 'bg-green-800 text-white'
                        : 'bg-gray-100'
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, userType: 'student' }))}
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
                    onClick={() => setFormData(prev => ({ ...prev, userType: 'alumni' }))}
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
            )}

            {step === 2 && (
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
            )}

            {step === 3 && formData.userType === 'alumni' && (
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
            )}

            {step === 3 && formData.userType === 'student' && (
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
            )}

            {step === 4 && formData.userType === 'alumni' && (
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
            )}

            {step === 4 && formData.userType === 'student' && (
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
            )}

            {step === 5 && formData.userType === 'student' && (
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
            )}

            {step === 5 && formData.userType === 'alumni' && (
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
            )}

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
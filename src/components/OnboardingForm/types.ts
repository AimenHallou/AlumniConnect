export type UserType = 'student' | 'alumni';

export interface FormData {
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
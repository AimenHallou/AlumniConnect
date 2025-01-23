import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, MapPin, GraduationCap, Briefcase, LogOut, Save, Lock, ExternalLink, Moon, Sun } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Sidebar from '../components/Sidebar';
import { useTheme } from '../contexts/ThemeContext';

interface ProfileFormData {
  full_name: string;
  location: string;
  degree: string;
  graduation_year?: string;
  current_year?: string;
  linkedin_url: string;
  occupation: string;
  company: string;
  company_logo_url?: string;
  major: string;
  profile_photo_url: string;
}

const getCompanyLogo = (companyName: string): string | undefined => {
  if (!companyName) return undefined;
  // Using Clearbit Logo API - no API key required for this endpoint
  return `https://logo.clearbit.com/${companyName.toLowerCase().replace(/[^a-zA-Z0-9]/g, '')}.com`;
};

export default function Profile() {
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        location: profile.location || '',
        degree: profile.degree || '',
        graduation_year: profile.graduation_year || '',
        current_year: profile.current_year || '',
        linkedin_url: profile.linkedin_url || '',
        occupation: profile.occupation || '',
        company: profile.company || '',
        company_logo_url: profile.company_logo_url || '',
        major: profile.major || '',
        profile_photo_url: profile.profile_photo_url || ''
      });
    }
  }, [profile]);
  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          user_type,
          graduation_year,
          current_year,
          degree,
          location,
          linkedin_url,
          email,
          occupation,
          company,
          company_logo_url,
          major,
          profile_photo_url
        `)
        .eq('id', user.id)
        .single();

      if (error) {
        // Only create a new profile if the error is "not found"
        if (error.code === 'PGRST116') {
          const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            .insert([{ 
              id: user.id,
              email: user.email,
              user_type: 'student', // Set default user type
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }])
            .select()
            .single();
            
          if (insertError) throw insertError;
          if (newProfile) {
            setProfile(newProfile);
          }
        } else {
          throw error;
        }
      } else if (profile) {
        setProfile(profile);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    if (!formData) return;
    
    setIsSaving(true);
    setError('');

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', profile.id);

      if (updateError) throw updateError;

      setProfile({ ...profile, ...formData });
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
      console.error('Error updating profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) throw error;

      setShowPasswordForm(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError('Failed to update password. Please try again.');
      console.error('Error updating password:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar />
        <div className="ml-64 p-8">
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="ml-64 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-8">Profile & Settings</h1>

          {/* Profile Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden mb-6">
            {/* Header Section */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-start space-x-4">
                <div className="w-24 h-24 rounded-xl overflow-hidden shadow-sm">
                  {formData?.profile_photo_url ? (
                    <img 
                      src={formData.profile_photo_url} 
                      alt={formData?.full_name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 flex items-center justify-center text-green-800 dark:text-green-100 text-2xl font-semibold">
                      {formData?.full_name?.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{formData?.full_name}</h2>
                      <p className="text-gray-500 dark:text-gray-400 mt-1">
                        {formData?.occupation} {formData?.company ? `at ${formData.company}` : ''}
                      </p>
                    </div>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        isEditing 
                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          : 'bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-100 hover:bg-green-100 dark:hover:bg-green-800'
                      }`}
                    >
                      {isEditing ? 'Cancel' : 'Edit Profile'}
                    </button>
                  </div>
                  <div className="mt-4 flex items-center space-x-4">
                    <div className="flex items-center text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      <span className="text-sm">{profile?.email}</span>
                    </div>
                    {formData?.linkedin_url && (
                      <a
                        href={formData.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-600 hover:text-blue-700 text-sm"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        LinkedIn Profile
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Content */}
            <div className="p-6">
              {isEditing ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="full_name"
                        value={formData?.full_name}
                        onChange={handleInputChange}
                        className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Occupation
                      </label>
                      <input
                        type="text"
                        name="occupation"
                        value={formData?.occupation}
                        onChange={handleInputChange}
                        className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData?.company}
                        onChange={handleInputChange}
                        className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData?.location}
                        onChange={handleInputChange}
                        className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Degree
                      </label>
                      <input
                        type="text"
                        name="degree"
                        value={formData?.degree}
                        onChange={handleInputChange}
                        className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Major
                      </label>
                      <input
                        type="text"
                        name="major"
                        value={formData?.major}
                        onChange={handleInputChange}
                        className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    {profile?.user_type === 'student' ? (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Current Year
                        </label>
                        <input
                          type="text"
                          name="current_year"
                          value={formData?.current_year}
                          onChange={handleInputChange}
                          className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Graduation Year
                        </label>
                        <input
                          type="text"
                          name="graduation_year"
                          value={formData?.graduation_year}
                          onChange={handleInputChange}
                          className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Profile Photo URL
                      </label>
                      <input
                        type="url"
                        name="profile_photo_url"
                        value={formData?.profile_photo_url}
                        onChange={handleInputChange}
                        className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company Logo URL
                      </label>
                      <input
                        type="url"
                        name="company_logo_url"
                        value={formData?.company_logo_url}
                        onChange={handleInputChange}
                        className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="https://example.com/logo.png"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        LinkedIn URL
                      </label>
                      <input
                        type="url"
                        name="linkedin_url"
                        value={formData?.linkedin_url}
                        onChange={handleInputChange}
                        className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                      {error}
                    </div>
                  )}

                  <button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="flex items-center space-x-2 bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save size={20} />
                    <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Location</h3>
                      <div className="flex items-center text-gray-800 dark:text-gray-200">
                        <MapPin className="w-5 h-5 mr-3 text-gray-400 dark:text-gray-500" />
                        <span>{formData?.location || 'Not specified'}</span>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Education</h3>
                      <div className="flex items-center text-gray-800 dark:text-gray-200">
                        <GraduationCap className="w-5 h-5 mr-3 text-gray-400 dark:text-gray-500" />
                        <div>
                          <p>{formData?.degree} {formData?.major ? `in ${formData.major}` : ''}</p>
                          {formData?.graduation_year && <p className="text-sm text-gray-500">Class of {formData.graduation_year}</p>}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Work</h3>
                      <div className="flex items-center text-gray-800 dark:text-gray-200">
                        {formData?.company ? (
                          <img 
                            src={getCompanyLogo(formData.company)}
                            alt={formData.company}
                            className="w-5 h-5 mr-3 object-contain"
                            onError={(e) => {
                              // Fallback to Briefcase icon if logo fetch fails
                              e.currentTarget.style.display = 'none';
                              const fallback = document.createElement('span');
                              fallback.innerHTML = '<svg class="w-5 h-5 mr-3 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>';
                              e.currentTarget.parentNode?.insertBefore(fallback.firstChild!, e.currentTarget);
                            }}
                          />
                        ) : (
                          <Briefcase className="w-5 h-5 mr-3 text-gray-400 dark:text-gray-500" />
                        )}
                        <div>
                          <p>{formData?.occupation || 'Not specified'}</p>
                          {formData?.company && <p className="text-sm text-gray-500">{formData.company}</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Settings Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Account Settings</h3>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex flex-col space-y-4">
                {/* Dark Mode Toggle */}
                <button
                  onClick={toggleDarkMode}
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                  <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                </button>

                {/* Password Change Button */}
                <button
                  onClick={() => setShowPasswordForm(!showPasswordForm)}
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <Lock size={20} />
                  <span>Change Password</span>
                </button>

                {showPasswordForm && (
                  <div className="mt-4 space-y-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className="w-full p-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className="w-full p-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>

                    <button
                      onClick={handleUpdatePassword}
                      className="w-full bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Update Password
                    </button>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                >
                  <LogOut size={20} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
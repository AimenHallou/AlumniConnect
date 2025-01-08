import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, MapPin, GraduationCap, Briefcase, LogOut, Save, Lock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Sidebar from '../components/Sidebar';

interface ProfileFormData {
  full_name: string;
  location: string;
  degree: string;
  graduation_year?: string;
  current_year?: string;
  linkedin_url: string;
}

export default function Profile() {
  const navigate = useNavigate();
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
        linkedin_url: profile.linkedin_url || ''
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
          email
        `)
        .eq('id', user.id)
        .single();

      if (!profile) {
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([{ 
            id: user.id,
            email: user.email,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }]);
          
        if (insertError) throw insertError;
        
        const { data: newProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        setProfile(newProfile);
        return;
      }
      
      if (error) {
        throw error;
      }
      
      if (profile) {
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
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <div className="ml-64 p-8">
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-8">Profile & Settings</h1>

          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-start space-x-4">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-800 text-2xl font-semibold">
                {formData?.full_name?.split(' ').map((n: string) => n[0]).join('')}
              </div>
              <div className="flex-1 flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold">{formData?.full_name}</h2>
                <p className="text-gray-600">{profile?.user_type === 'student' ? 'Student' : 'Alumni'}</p>
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-green-800 hover:text-green-700"
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>
            </div>

            {isEditing ? (
              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData?.full_name}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg"
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
                    className="w-full p-2 border rounded-lg"
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
                    className="w-full p-2 border rounded-lg"
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
                      className="w-full p-2 border rounded-lg"
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
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    name="linkedin_url"
                    value={formData?.linkedin_url}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>

                {error && (
                  <div className="text-red-600 text-sm">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="flex items-center space-x-2 bg-green-800 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  <Save size={20} />
                  <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
              <div className="flex items-center text-gray-600">
                <Mail className="w-5 h-5 mr-3" />
                <span>{profile?.email}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="w-5 h-5 mr-3" />
                <span>{formData?.location}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <GraduationCap className="w-5 h-5 mr-3" />
                <span>{formData?.degree}</span>
              </div>
              {profile?.user_type === 'student' ? (
                <div className="flex items-center text-gray-600">
                  <User className="w-5 h-5 mr-3" />
                  <span>{formData?.current_year} Year</span>
                </div>
              ) : (
                <div className="flex items-center text-gray-600">
                  <Briefcase className="w-5 h-5 mr-3" />
                  <span>Class of {formData?.graduation_year}</span>
                </div>
              )}
              </div>
            )}
          </div>

          {/* Settings Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
            <div className="space-y-4">
              <button
                onClick={() => setShowPasswordForm(!showPasswordForm)}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-700"
              >
                <Lock size={20} />
                <span>Change Password</span>
              </button>

              {showPasswordForm && (
                <div className="mt-4 space-y-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>

                  <button
                    onClick={handleUpdatePassword}
                    className="bg-green-800 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    Update Password
                  </button>
                </div>
              )}

              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 text-red-600 hover:text-red-700"
              >
                <LogOut size={20} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Network } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Register() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || '';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      setIsLoading(false);
      return;
    }

    // Try signing in first to check if user exists
    supabase.auth.signInWithPassword({
        email,
        password,
    }).then(({ error }) => {
      if (!error) {
        // User exists and credentials are correct, proceed to feed
        navigate('/feed');
      } else if (error.message === 'Invalid login credentials') {
        // User doesn't exist, proceed with signup
        return supabase.auth.signUp({
          email,
          password,
        });
      } else {
        throw error;
      }
    }).then(result => {
      if (!result) return; // User was already signed in
      
      const { data, error: signUpError } = result;
      if (signUpError) throw signUpError;

      if (data?.user) {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        
        supabase
          .from('profiles')
          .insert([{
            id: data.user.id,
            full_name: userData.fullName,
            user_type: userData.userType,
            graduation_year: userData.graduationYear,
            current_year: userData.currentYear,
            degree: userData.degree,
            location: userData.location,
            linkedin_url: userData.linkedIn,
          }]);
      }
      
      navigate('/feed');
    }).catch(err => {
      if (err.message.includes('already registered')) {
        setError('This email is already registered. Please try logging in instead.');
      } else {
        setError(err?.message || 'An error occurred');
      }
    }).finally(() => {
      setIsLoading(false);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Network className="h-12 w-12 text-green-800" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  disabled
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm bg-gray-50"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-800 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-sm text-green-800 hover:text-green-700"
              >
                Already have an account? Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
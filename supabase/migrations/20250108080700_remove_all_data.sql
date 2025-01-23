/*
  # Remove all user data
  
  1. Changes
    - Delete all profiles
    - Delete all auth users
*/

-- Delete all profiles
DELETE FROM profiles;

-- Delete all auth users
DELETE FROM auth.users; 
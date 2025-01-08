/*
  # Add sample directory data
  
  1. Changes
    - Insert sample users into auth.users
    - Insert corresponding profiles
    - Add sample data for directory listings
*/

-- Insert sample users
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'alex.thompson@example.com', crypt('password123', gen_salt('bf')), now(), now(), now()),
  ('22222222-2222-2222-2222-222222222222', 'jessica.lee@example.com', crypt('password123', gen_salt('bf')), now(), now(), now()),
  ('33333333-3333-3333-3333-333333333333', 'david.martinez@example.com', crypt('password123', gen_salt('bf')), now(), now(), now()),
  ('44444444-4444-4444-4444-444444444444', 'rachel.kim@example.com', crypt('password123', gen_salt('bf')), now(), now(), now())
ON CONFLICT (id) DO NOTHING;

-- Insert corresponding profiles
INSERT INTO public.profiles (
  id,
  email,
  full_name,
  user_type,
  degree,
  location,
  graduation_year,
  current_year,
  linkedin_url,
  created_at,
  updated_at
)
VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    'alex.thompson@example.com',
    'Alex Thompson',
    'alumni',
    'Marketing',
    'Portland, OR',
    '2015',
    NULL,
    'https://linkedin.com/in/alexthompson',
    now(),
    now()
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'jessica.lee@example.com',
    'Jessica Lee',
    'student',
    'Business Administration',
    'Huntington, WV',
    NULL,
    'Senior',
    'https://linkedin.com/in/jessicalee',
    now(),
    now()
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'david.martinez@example.com',
    'David Martinez',
    'alumni',
    'Finance',
    'New York, NY',
    '2018',
    NULL,
    'https://linkedin.com/in/davidmartinez',
    now(),
    now()
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    'rachel.kim@example.com',
    'Rachel Kim',
    'student',
    'Marketing',
    'Huntington, WV',
    NULL,
    'Junior',
    'https://linkedin.com/in/rachelkim',
    now(),
    now()
  )
ON CONFLICT (id) DO NOTHING;
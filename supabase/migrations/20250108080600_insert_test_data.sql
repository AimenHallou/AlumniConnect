/*
  # Insert test profile data
  
  1. Changes
    - Insert test profiles with LinkedIn data
    - Include Clearbit logo URLs for companies
  
  Note: Users must be created first through Supabase Auth before running this migration
*/

-- Insert corresponding profiles with Clearbit logo URLs
INSERT INTO profiles (
  id,
  full_name,
  occupation,
  company,
  degree,
  graduation_year,
  major,
  profile_photo_url,
  created_at,
  updated_at
)
VALUES 
  (
    'a1b2c3d4-e5f6-4321-8765-1a2b3c4d5e6f',
    'Shavar Greer',
    'Lead Solutions Consultant',
    'Apple',
    'Masters',
    '2008',
    'Human Resource Management',
    'https://media.licdn.com/dms/image/v2/D5635AQEWPQcGSp1YTw/profile-framedphoto-shrink_400_400/profile-framedphoto-shrink_400_400/0/1728696253047?e=1737568800&v=beta&t=WoJw9BlJA-iw6ZQMhLjPDxAj1Rxg1af14MjRB3ekZfE',
    now(),
    now()
  ),
  (
    'b2c3d4e5-f6a7-5432-8765-2b3c4d5e6f7a',
    'Shivraj',
    'Network Engineer',
    'Facebook',
    'Master''s',
    '2018',
    'Information Technology Project Management, Information security',
    'https://media.licdn.com/dms/image/v2/C4E03AQGLJrhE156gsA/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1551836356511?e=1742428800&v=beta&t=UFRYDnW0U3ikhXNXNCNqv0eCtG9Nacw5PlcJ-cSjsJI',
    now(),
    now()
  ),
  (
    'c3d4e5f6-a7b8-6543-8765-3c4d5e6f7a8b',
    'Sheng',
    'Lead Workday',
    'Nike',
    'Bachlors',
    '2008',
    'B.S, Management of Information Systems',
    'https://media.licdn.com/dms/image/v2/C4D03AQFFvfV1RPm66w/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1516881563119?e=1742428800&v=beta&t=uoSXNAOAU6D2GZZDT7bb2gtlLqXUIzpi8OEKgmpzp58',
    now(),
    now()
  )
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  occupation = EXCLUDED.occupation,
  company = EXCLUDED.company,
  degree = EXCLUDED.degree,
  graduation_year = EXCLUDED.graduation_year,
  major = EXCLUDED.major,
  profile_photo_url = EXCLUDED.profile_photo_url,
  updated_at = now();
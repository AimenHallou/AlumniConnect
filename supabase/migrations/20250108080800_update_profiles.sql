/*
  # Update existing profiles with sample data
  
  1. Changes
    - Update profiles with LinkedIn data
    - Change user type to alumni
*/

-- Update profiles with sample data
UPDATE profiles
SET 
  full_name = 'Shavar Greer',
  occupation = 'Lead Solutions Consultant',
  company = 'Apple',
  degree = 'Masters',
  graduation_year = '2008',
  major = 'Human Resource Management',
  profile_photo_url = 'https://media.licdn.com/dms/image/v2/D5635AQEWPQcGSp1YTw/profile-framedphoto-shrink_400_400/profile-framedphoto-shrink_400_400/0/1728696253047?e=1737568800&v=beta&t=WoJw9BlJA-iw6ZQMhLjPDxAj1Rxg1af14MjRB3ekZfE',
  user_type = 'alumni',
  updated_at = now()
WHERE id = '36fddadd-a785-46d6-895f-2e89f2524f8c';

UPDATE profiles
SET 
  full_name = 'Shivraj',
  occupation = 'Network Engineer',
  company = 'Facebook',
  degree = 'Master''s',
  graduation_year = '2018',
  major = 'Information Technology Project Management, Information security',
  profile_photo_url = 'https://media.licdn.com/dms/image/v2/C4E03AQGLJrhE156gsA/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1551836356511?e=1742428800&v=beta&t=UFRYDnW0U3ikhXNXNCNqv0eCtG9Nacw5PlcJ-cSjsJI',
  user_type = 'alumni',
  updated_at = now()
WHERE id = 'b317c3b9-bd34-4802-b901-c5b7d28807c2';

UPDATE profiles
SET 
  full_name = 'Sheng',
  occupation = 'Lead Workday',
  company = 'Nike',
  degree = 'Bachlors',
  graduation_year = '2008',
  major = 'B.S, Management of Information Systems',
  profile_photo_url = 'https://media.licdn.com/dms/image/v2/C4D03AQFFvfV1RPm66w/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1516881563119?e=1742428800&v=beta&t=uoSXNAOAU6D2GZZDT7bb2gtlLqXUIzpi8OEKgmpzp58',
  user_type = 'alumni',
  updated_at = now()
WHERE id = 'beef68f1-31c4-48c7-928a-23afc35d1361'; 
/*
  # Add company logo URL to profiles
  
  1. Changes
    - Add company_logo_url column to profiles table
*/

-- Add company_logo_url column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'company_logo_url'
  ) THEN
    ALTER TABLE profiles ADD COLUMN company_logo_url text;
  END IF;
END $$;

-- Update existing profiles with company logos
UPDATE profiles
SET company_logo_url = CASE 
  WHEN company = 'Apple' THEN 'https://www.apple.com/ac/structured-data/images/knowledge_graph_logo.png'
  WHEN company = 'Facebook' THEN 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/F_icon.svg/480px-F_icon.svg.png'
  WHEN company = 'Nike' THEN 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/1200px-Logo_NIKE.svg.png'
  ELSE company_logo_url
END
WHERE company IN ('Apple', 'Facebook', 'Nike'); 
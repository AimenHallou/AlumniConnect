-- Add company_logo_url column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'company_logo_url') 
    THEN
        ALTER TABLE profiles
        ADD COLUMN company_logo_url text;
    END IF;
END $$;

-- Create a function to fetch and update company logos
CREATE OR REPLACE FUNCTION update_company_logo() 
RETURNS trigger AS $$
BEGIN
    -- Only update if company has changed and company_logo_url is not manually set
    IF (TG_OP = 'INSERT' OR NEW.company <> OLD.company OR OLD.company IS NULL) 
       AND (NEW.company_logo_url IS NULL OR NEW.company_logo_url = '') 
    THEN
        -- You would typically make an API call here to fetch the logo
        -- For now, we'll leave it NULL and handle it in the frontend
        NEW.company_logo_url = NULL;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update company logo when company changes
DROP TRIGGER IF EXISTS on_company_update ON profiles;
CREATE TRIGGER on_company_update
    BEFORE INSERT OR UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_company_logo(); 
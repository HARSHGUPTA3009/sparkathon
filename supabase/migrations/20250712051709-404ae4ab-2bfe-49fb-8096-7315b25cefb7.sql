
-- Fix the auth.users table structure to ensure compatibility
-- Add missing columns that Supabase Auth expects
ALTER TABLE auth.users 
ADD COLUMN IF NOT EXISTS confirmation_token VARCHAR(255),
ADD COLUMN IF NOT EXISTS recovery_token VARCHAR(255),
ADD COLUMN IF NOT EXISTS email_change_token_new VARCHAR(255),
ADD COLUMN IF NOT EXISTS email_change VARCHAR(255),
ADD COLUMN IF NOT EXISTS phone_change_token VARCHAR(255),
ADD COLUMN IF NOT EXISTS phone_change VARCHAR(255),
ADD COLUMN IF NOT EXISTS reauthentication_token VARCHAR(255),
ADD COLUMN IF NOT EXISTS email_change_token_current VARCHAR(255) DEFAULT '',
ADD COLUMN IF NOT EXISTS email_change_confirm_status SMALLINT DEFAULT 0,
ADD COLUMN IF NOT EXISTS banned_until TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS raw_app_meta_data JSONB,
ADD COLUMN IF NOT EXISTS is_super_admin BOOLEAN,
ADD COLUMN IF NOT EXISTS phone VARCHAR(15),
ADD COLUMN IF NOT EXISTS phone_confirmed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS phone_change_sent_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS confirmed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS email_change_sent_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS recovery_sent_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS invited_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS confirmation_sent_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS is_anonymous BOOLEAN DEFAULT FALSE;

-- Update the admin users to have proper confirmation status
UPDATE auth.users 
SET 
  confirmed_at = email_confirmed_at,
  confirmation_token = '',
  recovery_token = '',
  email_change_token_new = '',
  email_change = '',
  phone_change_token = '',
  phone_change = '',
  reauthentication_token = '',
  email_change_token_current = '',
  raw_app_meta_data = '{}',
  is_super_admin = FALSE,
  is_anonymous = FALSE
WHERE email IN ('anshu@ecomess.com', 'harsh@ecomess.com');


-- Insert admin users into auth.users table first
-- Note: Supabase will hash the passwords automatically
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data,
  role,
  aud
) VALUES 
(
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'anshu@ecomess.com',
  crypt('kuchupuchu21', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"username": "anshu", "provider": "email"}',
  'authenticated',
  'authenticated'
),
(
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'harsh@ecomess.com',
  crypt('legend30', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"username": "harsh", "provider": "email"}',
  'authenticated',
  'authenticated'
);

-- Update the handle_new_user function to include the new admin emails
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, username, role, provider, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', NEW.email),
    CASE 
      WHEN NEW.email IN ('anshu@ecomess.com', 'harsh@ecomess.com') THEN 'admin'
      ELSE 'user'
    END,
    COALESCE(NEW.raw_user_meta_data->>'provider', 'email'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  
  -- Create default preferences
  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Manually create the admin user profiles since the trigger won't fire for existing users
INSERT INTO public.users (id, email, username, role, provider)
SELECT 
  au.id,
  au.email,
  au.raw_user_meta_data->>'username',
  'admin',
  'email'
FROM auth.users au
WHERE au.email IN ('anshu@ecomess.com', 'harsh@ecomess.com')
ON CONFLICT (email) DO UPDATE SET
  role = 'admin',
  username = EXCLUDED.username;

-- Create default preferences for admin users
INSERT INTO public.user_preferences (user_id)
SELECT au.id
FROM auth.users au
WHERE au.email IN ('anshu@ecomess.com', 'harsh@ecomess.com')
ON CONFLICT DO NOTHING;

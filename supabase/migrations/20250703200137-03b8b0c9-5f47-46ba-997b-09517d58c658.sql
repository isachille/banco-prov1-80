
-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can update all users" ON public.users;

-- Create a security definer function to check admin status
CREATE OR REPLACE FUNCTION public.is_admin_user(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.users 
    WHERE id = user_id 
    AND (role IN ('admin', 'dono') OR is_admin = true)
  );
$$;

-- Recreate admin policies using the security definer function
CREATE POLICY "Admins can view all users" 
  ON public.users 
  FOR SELECT 
  USING (public.is_admin_user(auth.uid()) OR auth.uid() = id);

CREATE POLICY "Admins can update all users" 
  ON public.users 
  FOR UPDATE 
  USING (public.is_admin_user(auth.uid()) OR auth.uid() = id);

-- Fix wallets policies too
DROP POLICY IF EXISTS "Admins can view all wallets" ON public.wallets;
DROP POLICY IF EXISTS "Admins can update all wallets" ON public.wallets;

CREATE POLICY "Admins can view all wallets" 
  ON public.wallets 
  FOR SELECT 
  USING (public.is_admin_user(auth.uid()) OR auth.uid() = user_id);

CREATE POLICY "Admins can update all wallets" 
  ON public.wallets 
  FOR UPDATE 
  USING (public.is_admin_user(auth.uid()) OR auth.uid() = user_id);

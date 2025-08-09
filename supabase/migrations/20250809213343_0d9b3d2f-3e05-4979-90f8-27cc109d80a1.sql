-- Fix security warnings by setting proper search paths for existing functions

-- Update handle_new_user function with proper search path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, nome_completo, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nome_completo', NEW.raw_user_meta_data->>'full_name', ''),
    NOW()
  );
  
  -- Create wallet for the new user
  INSERT INTO public.wallets (user_id, saldo, created_at)
  VALUES (NEW.id, 0, NOW());
  
  RETURN NEW;
END;
$$;

-- Update is_admin_user function with proper search path
CREATE OR REPLACE FUNCTION public.is_admin_user(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.users 
    WHERE id = user_id 
    AND (role IN ('admin', 'dono') OR is_admin = true)
  );
$$;
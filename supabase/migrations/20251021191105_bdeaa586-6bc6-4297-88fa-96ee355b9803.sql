-- Fix 1: Create role management system to prevent privilege escalation
-- Create enum for roles
CREATE TYPE public.app_role AS ENUM ('admin', 'dono', 'gerente', 'analista', 'operador', 'usuario');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  granted_by UUID REFERENCES auth.users(id),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Only admins can manage roles
CREATE POLICY "Only admins can insert roles"
ON public.user_roles FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND (is_admin = true OR role IN ('admin', 'dono'))
  )
);

CREATE POLICY "Only admins can view roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id OR
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND (is_admin = true OR role IN ('admin', 'dono'))
  )
);

CREATE POLICY "Only admins can delete roles"
ON public.user_roles FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND (is_admin = true OR role IN ('admin', 'dono'))
  )
);

-- Migrate existing roles from users table
INSERT INTO public.user_roles (user_id, role, granted_at)
SELECT id, role::app_role, created_at
FROM public.users
WHERE role IN ('admin', 'dono', 'gerente', 'analista', 'operador', 'usuario')
ON CONFLICT (user_id, role) DO NOTHING;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Update is_admin_user function to use new role system
CREATE OR REPLACE FUNCTION public.is_admin_user(user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.user_roles 
    WHERE user_roles.user_id = is_admin_user.user_id 
    AND role IN ('admin', 'dono')
  );
$$;

-- Fix 2: Secure wallets_ativas view with RLS
ALTER VIEW public.wallets_ativas SET (security_invoker = true);

-- Fix 3: Remove public contract signature update policy
DROP POLICY IF EXISTS "Public can update contract signatures" ON public.contratos_financiamento;

-- Create secure authenticated signature policy
CREATE POLICY "Users sign own contracts"
ON public.contratos_financiamento FOR UPDATE
TO authenticated
USING (auth.uid() = user_id AND status_contrato = 'aguardando_assinatura')
WITH CHECK (auth.uid() = user_id AND status_contrato = 'aguardando_assinatura');
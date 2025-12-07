-- FIX 1: User Roles RLS Policies - Use has_role() instead of querying users table directly
-- This prevents privilege escalation attacks

-- Drop vulnerable policies that query users.is_admin and users.role directly
DROP POLICY IF EXISTS "Only admins can delete roles" ON public.user_roles;
DROP POLICY IF EXISTS "Only admins can insert roles" ON public.user_roles;
DROP POLICY IF EXISTS "Only admins can view roles" ON public.user_roles;

-- Recreate policies using the secure has_role() function
CREATE POLICY "Admins can insert roles" ON public.user_roles
FOR INSERT TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'admin'::app_role) OR
  public.has_role(auth.uid(), 'dono'::app_role)
);

CREATE POLICY "Admins can delete roles" ON public.user_roles
FOR DELETE TO authenticated
USING (
  public.has_role(auth.uid(), 'admin'::app_role) OR
  public.has_role(auth.uid(), 'dono'::app_role)
);

CREATE POLICY "Users can view own roles or admins can view all" ON public.user_roles
FOR SELECT TO authenticated
USING (
  auth.uid() = user_id OR
  public.has_role(auth.uid(), 'admin'::app_role) OR
  public.has_role(auth.uid(), 'dono'::app_role)
);

-- FIX 2: Fichas Cadastrais - Remove overly permissive public SELECT policy
-- The edge function uses SERVICE_ROLE_KEY which bypasses RLS, so no public policy needed

DROP POLICY IF EXISTS "Public can access by token" ON public.fichas_cadastrais;
-- Fix RLS policies on propostas_financiamento to use has_role() instead of querying users.role directly

-- Drop existing vulnerable policies
DROP POLICY IF EXISTS "Admins can view all proposals" ON public.propostas_financiamento;
DROP POLICY IF EXISTS "Admins can update all proposals" ON public.propostas_financiamento;
DROP POLICY IF EXISTS "Users can view their own proposals" ON public.propostas_financiamento;
DROP POLICY IF EXISTS "Users can create their own proposals" ON public.propostas_financiamento;

-- Recreate policies using secure has_role() function
CREATE POLICY "Users can view their own proposals" 
ON public.propostas_financiamento 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all proposals" 
ON public.propostas_financiamento 
FOR SELECT 
USING (
  public.has_role(auth.uid(), 'admin') OR
  public.has_role(auth.uid(), 'dono') OR
  public.has_role(auth.uid(), 'gerente')
);

CREATE POLICY "Users can create their own proposals" 
ON public.propostas_financiamento 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update all proposals" 
ON public.propostas_financiamento 
FOR UPDATE 
USING (
  public.has_role(auth.uid(), 'admin') OR
  public.has_role(auth.uid(), 'dono') OR
  public.has_role(auth.uid(), 'gerente')
);
-- Fix critical data exposure: wallets_ativas view accessible by anonymous users
-- Recreate with security_invoker to inherit RLS from underlying tables

DROP VIEW IF EXISTS public.wallets_ativas;

CREATE VIEW public.wallets_ativas 
WITH (security_invoker = true) AS
SELECT 
  w.id AS wallet_id, 
  w.user_id, 
  w.saldo, 
  w.limite, 
  w.rendimento_mes,
  u.nome_completo, 
  u.email, 
  u.cpf, 
  u.telefone, 
  u.role, 
  u.tipo, 
  u.status
FROM public.wallets w
JOIN public.users u ON w.user_id = u.id
WHERE w.status = 'ativa';

-- Revoke anonymous access to prevent unauthenticated data exposure
REVOKE SELECT ON public.wallets_ativas FROM anon;

-- Grant access only to authenticated users (RLS will filter results)
GRANT SELECT ON public.wallets_ativas TO authenticated;
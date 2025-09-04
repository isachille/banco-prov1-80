-- Fix Security Definer View issue
-- Drop and recreate wallets_ativas view without SECURITY DEFINER

DROP VIEW IF EXISTS public.wallets_ativas;

-- Recreate the view without SECURITY DEFINER (uses SECURITY INVOKER by default)
CREATE VIEW public.wallets_ativas AS
SELECT 
  w.id as wallet_id,
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
FROM wallets w
JOIN users u ON w.user_id = u.id
WHERE w.status = 'ativa';
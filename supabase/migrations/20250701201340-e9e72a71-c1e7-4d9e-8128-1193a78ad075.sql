
-- Atualizar o usuário específico para status ativo e role dono
UPDATE public.users 
SET 
  status = 'ativo',
  is_admin = true,
  role = 'dono'
WHERE email = 'isac.soares23@gmail.com';

-- Garantir que existe carteira para este usuário
INSERT INTO public.wallets (
  user_id,
  saldo,
  limite,
  rendimento_mes,
  status
)
SELECT 
  id,
  0,
  0,
  0,
  'ativa'
FROM public.users 
WHERE email = 'isac.soares23@gmail.com'
  AND NOT EXISTS (
    SELECT 1 FROM public.wallets WHERE user_id = users.id
  );

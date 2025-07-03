
-- Atualizar o usuário específico para ter role 'dono' e status 'ativo'
UPDATE public.users 
SET 
  role = 'dono',
  status = 'ativo',
  is_admin = true
WHERE email = 'isac.soares23@gmail.com';

-- Garantir que existe uma carteira para este usuário
INSERT INTO public.wallets (
  user_id,
  saldo,
  limite,
  rendimento_mes,
  status
)
SELECT 
  id,
  1000.00, -- Saldo inicial para teste
  5000.00, -- Limite inicial
  0,
  'ativa'
FROM public.users 
WHERE email = 'isac.soares23@gmail.com'
  AND NOT EXISTS (
    SELECT 1 FROM public.wallets WHERE user_id = users.id
  );

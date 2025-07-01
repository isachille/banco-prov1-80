
-- Confirmar o email do usuário no sistema de autenticação
UPDATE auth.users 
SET email_confirmed_at = now()
WHERE email = 'isac.soares23@gmail.com';

-- Garantir que o usuário existe na tabela users com status ativo
INSERT INTO public.users (
  id,
  email,
  nome,
  nome_completo,
  cpf_cnpj,
  telefone,
  tipo,
  status,
  role,
  is_admin
)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'nome', 'Isac'),
  COALESCE(au.raw_user_meta_data->>'nome_completo', 'Isac Soares'),
  COALESCE(au.raw_user_meta_data->>'cpf_cnpj', '055.700.611-26'),
  COALESCE(au.raw_user_meta_data->>'telefone', '(61) 98483-3966'),
  COALESCE(au.raw_user_meta_data->>'tipo', 'PF'),
  'ativo',
  'dono',
  true
FROM auth.users au
WHERE au.email = 'isac.soares23@gmail.com'
ON CONFLICT (id) DO UPDATE SET
  status = 'ativo',
  is_admin = true,
  role = 'dono';

-- Garantir que existe carteira para este usuário
INSERT INTO public.wallets (
  user_id,
  saldo,
  limite,
  rendimento_mes,
  status
)
SELECT 
  u.id,
  0,
  0,
  0,
  'ativa'
FROM public.users u
WHERE u.email = 'isac.soares23@gmail.com'
  AND NOT EXISTS (
    SELECT 1 FROM public.wallets WHERE user_id = u.id
  );

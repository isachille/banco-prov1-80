
-- Remover políticas que causam recursão infinita
DROP POLICY IF EXISTS "Admin pode ver todos os usuários" ON public.users;
DROP POLICY IF EXISTS "Admin pode atualizar usuários" ON public.users;

-- Criar função de segurança para verificar se o usuário é admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = user_id 
    AND (is_admin = true OR role IN ('admin', 'gerente', 'dono'))
  );
$$;

-- Recriar políticas sem recursão
CREATE POLICY "Admin pode ver todos os usuários" 
ON public.users 
FOR SELECT 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admin pode atualizar usuários" 
ON public.users 
FOR UPDATE 
USING (public.is_admin(auth.uid()));

-- Garantir que o usuário específico tenha dados corretos
UPDATE public.users 
SET 
  status = 'ativo',
  is_admin = true,
  role = 'dono'
WHERE email = 'isac.soares23@gmail.com';

-- Verificar se existe carteira para este usuário
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


-- Adicionar os campos necessários na tabela users
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS telefone text,
ADD COLUMN IF NOT EXISTS senha text;

-- Atualizar o campo status para ter os valores corretos
ALTER TABLE public.users 
ALTER COLUMN status SET DEFAULT 'pendente';

-- Adicionar comentário para documentar os possíveis valores de status
COMMENT ON COLUMN public.users.status IS 'Valores possíveis: pendente, ativo, recusado';

-- Criar políticas RLS para permitir inserção durante cadastro
CREATE POLICY "Permitir inserção durante cadastro" 
ON public.users 
FOR INSERT 
WITH CHECK (true);

-- Criar função trigger para criar usuário após cadastro no auth
CREATE OR REPLACE FUNCTION public.handle_new_user_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (
    id,
    email,
    nome_completo,
    cpf_cnpj,
    telefone,
    tipo,
    status
  ) VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'nome_completo', ''),
    COALESCE(new.raw_user_meta_data->>'cpf_cnpj', ''),
    COALESCE(new.raw_user_meta_data->>'telefone', ''),
    COALESCE(new.raw_user_meta_data->>'tipo', 'PF'),
    'pendente'
  );
  RETURN new;
END;
$$;

-- Criar trigger para executar a função após inserção no auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_signup();

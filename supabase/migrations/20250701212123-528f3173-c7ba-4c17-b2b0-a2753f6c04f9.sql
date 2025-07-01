
-- Primeiro, vamos verificar e corrigir as políticas RLS
DROP POLICY IF EXISTS "Permitir inserção durante cadastro" ON public.users;

-- Criar política mais específica para permitir inserção via trigger
CREATE POLICY "Permitir inserção via trigger" 
ON public.users 
FOR INSERT 
WITH CHECK (true);

-- Recriar as funções de trigger com as permissões corretas
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_email_confirmed ON auth.users;

-- Função para criar usuário após confirmação de email
CREATE OR REPLACE FUNCTION public.handle_email_confirmation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Quando o email for confirmado, criar o usuário se não existir
  IF NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL THEN
    INSERT INTO public.users (
      id,
      email,
      nome,
      nome_completo,
      cpf,
      cpf_cnpj,
      telefone,
      tipo,
      status,
      role
    ) VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'nome', ''),
      COALESCE(NEW.raw_user_meta_data->>'nome_completo', ''),
      COALESCE(NEW.raw_user_meta_data->>'cpf', ''),
      COALESCE(NEW.raw_user_meta_data->>'cpf_cnpj', ''),
      COALESCE(NEW.raw_user_meta_data->>'telefone', ''),
      COALESCE(NEW.raw_user_meta_data->>'tipo', 'PF'),
      'pendente',
      'usuario'
    )
    ON CONFLICT (id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

-- Criar o trigger para confirmação de email
CREATE TRIGGER on_email_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_email_confirmation();

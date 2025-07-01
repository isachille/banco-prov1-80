
-- Criar política para permitir atualizações pelos administradores na tabela users
CREATE POLICY "Admin pode atualizar usuários" 
ON public.users 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- Criar política para administradores verem todos os usuários
CREATE POLICY "Admin pode ver todos os usuários" 
ON public.users 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- Atualizar a função de criação de usuário para aguardar confirmação de email
CREATE OR REPLACE FUNCTION public.handle_new_user_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Só criar o usuário se o email foi confirmado
  IF new.email_confirmed_at IS NOT NULL THEN
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
    )
    ON CONFLICT (id) DO NOTHING;
  END IF;
  RETURN new;
END;
$$;

-- Criar trigger para confirmação de email também
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
      nome_completo,
      cpf_cnpj,
      telefone,
      tipo,
      status
    ) VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'nome_completo', ''),
      COALESCE(NEW.raw_user_meta_data->>'cpf_cnpj', ''),
      COALESCE(NEW.raw_user_meta_data->>'telefone', ''),
      COALESCE(NEW.raw_user_meta_data->>'tipo', 'PF'),
      'pendente'
    )
    ON CONFLICT (id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

-- Criar trigger para confirmação de email
DROP TRIGGER IF EXISTS on_email_confirmed ON auth.users;
CREATE TRIGGER on_email_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_email_confirmation();

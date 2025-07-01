
-- Criar trigger para criação automática de carteira quando usuário for inserido
CREATE OR REPLACE FUNCTION public.criar_carteira_automatica()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Criar carteira automaticamente para o novo usuário
  INSERT INTO public.wallets (
    user_id,
    saldo,
    limite,
    rendimento_mes,
    status
  ) VALUES (
    NEW.id,
    0,
    0,
    0,
    'ativa'
  );
  
  RETURN NEW;
END;
$$;

-- Criar trigger que executa após inserção na tabela users
DROP TRIGGER IF EXISTS trigger_criar_carteira ON public.users;
CREATE TRIGGER trigger_criar_carteira
  AFTER INSERT ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.criar_carteira_automatica();

-- Atualizar a função de criação de usuário para usar os campos corretos
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
      nome,
      nome_completo,
      cpf,
      cpf_cnpj,
      telefone,
      tipo,
      status,
      role
    ) VALUES (
      new.id,
      new.email,
      COALESCE(new.raw_user_meta_data->>'nome', ''),
      COALESCE(new.raw_user_meta_data->>'nome_completo', ''),
      COALESCE(new.raw_user_meta_data->>'cpf', ''),
      COALESCE(new.raw_user_meta_data->>'cpf_cnpj', ''),
      COALESCE(new.raw_user_meta_data->>'telefone', ''),
      'cliente',
      'pendente',
      'cliente'
    )
    ON CONFLICT (id) DO NOTHING;
  END IF;
  RETURN new;
END;
$$;

-- Atualizar função de confirmação de email
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
      'cliente',
      'pendente',
      'cliente'
    )
    ON CONFLICT (id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

-- Criar política para permitir que usuários vejam suas próprias carteiras
CREATE POLICY "Usuário pode ver sua carteira" 
ON public.wallets 
FOR SELECT 
USING (
  user_id = auth.uid() AND 
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND status = 'ativo'
  )
);

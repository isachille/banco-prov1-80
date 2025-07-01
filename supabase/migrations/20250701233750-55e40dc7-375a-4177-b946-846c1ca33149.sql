
-- 1. FUNÇÃO: Criar usuário na tabela `users` após confirmação de e-mail
CREATE OR REPLACE FUNCTION public.sync_auth_user_to_users()
RETURNS trigger AS $$
BEGIN
  IF old.email_confirmed_at IS NULL AND new.email_confirmed_at IS NOT NULL THEN
    INSERT INTO public.users (
      id, email, nome, nome_completo, cpf, cpf_cnpj, telefone,
      status, tipo, role, created_at
    )
    VALUES (
      new.id,
      new.email,
      split_part(new.email, '@', 1),
      split_part(new.email, '@', 1),
      '000.000.000-00',
      '000.000.000-00',
      '(00) 00000-0000',
      'pendente',
      'cliente',
      'cliente',
      now()
    )
    ON CONFLICT (id) DO NOTHING;
  END IF;
  RETURN new;
END;
$$ LANGUAGE plpgsql;

-- 2. TRIGGER: Disparar função após confirmação de e-mail
DROP TRIGGER IF EXISTS on_email_confirmed_trigger ON auth.users;

CREATE TRIGGER on_email_confirmed_trigger
AFTER UPDATE ON auth.users
FOR EACH ROW
WHEN (old.email_confirmed_at IS NULL AND new.email_confirmed_at IS NOT NULL)
EXECUTE PROCEDURE public.sync_auth_user_to_users();

-- 3. FUNÇÃO: Criar carteira automaticamente após o registro em users
CREATE OR REPLACE FUNCTION public.criar_wallet()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.wallets (
    user_id,
    saldo,
    limite,
    rendimento_mes
  )
  VALUES (
    new.id,
    0,
    0,
    0
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql;

-- 4. TRIGGER: Ativar criação automática da wallet
DROP TRIGGER IF EXISTS criar_wallet_trigger ON public.users;

CREATE TRIGGER criar_wallet_trigger
AFTER INSERT ON public.users
FOR EACH ROW
EXECUTE PROCEDURE public.criar_wallet();


-- Atualizar a senha do usuário isac.soares23@gmail.com
UPDATE auth.users 
SET encrypted_password = crypt('a33776734', gen_salt('bf'))
WHERE email = 'isac.soares23@gmail.com';

-- Confirmar que o email está confirmado
UPDATE auth.users 
SET email_confirmed_at = COALESCE(email_confirmed_at, now()) 
WHERE email = 'isac.soares23@gmail.com';

-- Garantir que o usuário está ativo na tabela users
UPDATE public.users 
SET status = 'ativo', 
    is_admin = true, 
    role = 'dono'
WHERE email = 'isac.soares23@gmail.com';

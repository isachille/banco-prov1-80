
-- Limpar todas as carteiras primeiro (devido à referência)
DELETE FROM public.wallets;

-- Limpar todos os usuários da tabela public.users
DELETE FROM public.users;

-- Limpar todos os usuários do Supabase Auth (isso vai apagar completamente os usuários)
-- ATENÇÃO: Isso vai apagar TODOS os usuários, incluindo você se estiver logado
DELETE FROM auth.users;


-- Criar tabela para armazenar as compras de gift cards
CREATE TABLE IF NOT EXISTS public.compras (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  servico text,
  valor numeric,
  data timestamp DEFAULT now()
);

-- Habilitar RLS na tabela compras
ALTER TABLE public.compras ENABLE ROW LEVEL SECURITY;

-- Política para usuários verem apenas suas próprias compras
CREATE POLICY "Usuário vê suas compras" ON public.compras
  FOR SELECT USING (user_id = auth.uid());

-- Política para usuários criarem suas próprias compras
CREATE POLICY "Usuário pode criar compras" ON public.compras
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Verificar se a função comprar_giftcard já existe e criar/atualizar
CREATE OR REPLACE FUNCTION public.comprar_giftcard(
  p_user uuid,
  p_servico text,
  p_valor numeric
)
RETURNS text as $$
declare
  saldo_atual numeric;
begin
  -- Verifica saldo disponível
  select saldo into saldo_atual from public.wallets where user_id = p_user;

  if saldo_atual < p_valor then
    raise exception 'Saldo insuficiente';
  end if;

  -- Debita o valor da carteira
  update public.wallets
  set saldo = saldo - p_valor
  where user_id = p_user;

  -- Registra a compra
  insert into public.compras (user_id, servico, valor)
  values (p_user, p_servico, p_valor);

  return 'Compra realizada com sucesso';
end;
$$ language plpgsql;

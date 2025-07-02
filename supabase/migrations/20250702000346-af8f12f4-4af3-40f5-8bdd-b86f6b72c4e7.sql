
-- Primeiro, vamos garantir que a view wallets_ativas existe com todos os campos necessários
CREATE OR REPLACE VIEW public.wallets_ativas AS
SELECT
  w.id as wallet_id,
  u.id as user_id,
  u.nome_completo,
  u.email,
  u.cpf,
  u.telefone,
  u.role,
  u.tipo,
  u.status,
  w.saldo,
  w.limite,
  w.rendimento_mes
FROM public.wallets w
JOIN public.users u ON u.id = w.user_id
WHERE u.status = 'ativo';

-- Verificar se a função transferir_saldo já existe (ela já existe conforme a documentação)
-- Mas vamos garantir que está com a assinatura correta
CREATE OR REPLACE FUNCTION public.transferir_saldo(
  p_de uuid,
  p_para uuid,
  p_valor numeric
)
RETURNS text as $$
declare
  saldo_origem numeric;
begin
  -- Verifica saldo disponível
  select saldo into saldo_origem from public.wallets where user_id = p_de;

  if saldo_origem < p_valor then
    raise exception 'Saldo insuficiente';
  end if;

  -- Debita do remetente
  update public.wallets
  set saldo = saldo - p_valor
  where user_id = p_de;

  -- Credita no destinatário
  update public.wallets
  set saldo = saldo + p_valor
  where user_id = p_para;

  return 'Transferência realizada com sucesso';
end;
$$ language plpgsql;

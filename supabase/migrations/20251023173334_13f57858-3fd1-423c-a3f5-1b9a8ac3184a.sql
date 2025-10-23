-- Adicionar campos do cliente e cor do veículo na tabela propostas_financiamento
ALTER TABLE propostas_financiamento
ADD COLUMN IF NOT EXISTS cliente_nome TEXT,
ADD COLUMN IF NOT EXISTS cliente_cpf TEXT,
ADD COLUMN IF NOT EXISTS cliente_nascimento DATE,
ADD COLUMN IF NOT EXISTS cliente_mae TEXT,
ADD COLUMN IF NOT EXISTS cliente_profissao TEXT,
ADD COLUMN IF NOT EXISTS cor_veiculo TEXT DEFAULT 'Preto';
-- Adicionar campo taxa_juros na tabela propostas_financiamento
ALTER TABLE propostas_financiamento 
ADD COLUMN IF NOT EXISTS taxa_juros numeric DEFAULT 1.5 NOT NULL;

COMMENT ON COLUMN propostas_financiamento.taxa_juros IS 'Taxa de juros mensal em percentual (ex: 1.5 para 1.5%)';
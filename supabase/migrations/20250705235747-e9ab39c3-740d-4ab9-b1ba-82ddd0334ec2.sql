
-- Criar tabela de subcontas para armazenar dados dos usuários e ID da Efí
CREATE TABLE public.subcontas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  cpf TEXT NOT NULL UNIQUE,
  telefone TEXT NOT NULL,
  data_nascimento DATE NOT NULL,
  id_efi TEXT, -- ID retornado pela API da Efí
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  criada_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizada_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de transações
CREATE TABLE public.transacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subconta_id UUID REFERENCES public.subcontas(id) ON DELETE CASCADE NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('pix', 'boleto', 'ted')),
  valor DECIMAL(10,2) NOT NULL,
  taxa_efi DECIMAL(10,2) NOT NULL DEFAULT 0,
  taxa_sua DECIMAL(10,2) NOT NULL DEFAULT 0,
  lucro DECIMAL(10,2) GENERATED ALWAYS AS (valor - taxa_efi - taxa_sua) STORED,
  descricao TEXT,
  status TEXT DEFAULT 'pendente',
  criada_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  data DATE GENERATED ALWAYS AS (criada_em::date) STORED
);

-- Índices para performance
CREATE INDEX idx_subcontas_user_id ON public.subcontas(user_id);
CREATE INDEX idx_subcontas_id_efi ON public.subcontas(id_efi);
CREATE INDEX idx_transacoes_subconta_id ON public.transacoes(subconta_id);
CREATE INDEX idx_transacoes_tipo ON public.transacoes(tipo);
CREATE INDEX idx_transacoes_data ON public.transacoes(data);

-- Habilitar RLS nas tabelas
ALTER TABLE public.subcontas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transacoes ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para subcontas
CREATE POLICY "Usuários podem ver suas próprias subcontas" 
  ON public.subcontas FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar suas próprias subcontas" 
  ON public.subcontas FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas próprias subcontas" 
  ON public.subcontas FOR UPDATE 
  USING (auth.uid() = user_id);

-- Políticas RLS para transações
CREATE POLICY "Usuários podem ver transações de suas subcontas" 
  ON public.transacoes FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.subcontas 
      WHERE subcontas.id = transacoes.subconta_id 
      AND subcontas.user_id = auth.uid()
    )
  );

CREATE POLICY "Usuários podem criar transações em suas subcontas" 
  ON public.transacoes FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.subcontas 
      WHERE subcontas.id = transacoes.subconta_id 
      AND subcontas.user_id = auth.uid()
    )
  );

-- Função para atualizar timestamp de atualização
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.atualizada_em = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar timestamp automaticamente
CREATE TRIGGER update_subcontas_updated_at 
  BEFORE UPDATE ON public.subcontas 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

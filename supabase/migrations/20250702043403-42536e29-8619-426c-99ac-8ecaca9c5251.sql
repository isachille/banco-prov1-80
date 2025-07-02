
-- Criar tabela para dados KYC dos usuários
CREATE TABLE IF NOT EXISTS public.perfil_kyc (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  nome_completo TEXT NOT NULL,
  cpf TEXT NOT NULL,
  data_nascimento DATE NOT NULL,
  nome_mae TEXT NOT NULL,
  profissao TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Criar tabela para carteiras Binance
CREATE TABLE IF NOT EXISTS public.binance_wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  balance NUMERIC DEFAULT 0,
  currency TEXT DEFAULT 'BRL',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Criar tabela para transações Binance
CREATE TABLE IF NOT EXISTS public.binance_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL,
  valor NUMERIC NOT NULL,
  moeda TEXT DEFAULT 'BRL',
  destinatario TEXT,
  chave_pix TEXT,
  status TEXT DEFAULT 'pendente',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB
);

-- Criar tabela para gift cards
CREATE TABLE IF NOT EXISTS public.giftcards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  valor NUMERIC NOT NULL,
  codigo TEXT,
  status TEXT DEFAULT 'ativo',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela para propostas de financiamento
CREATE TABLE IF NOT EXISTS public.propostas_financiamento (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  codigo_proposta TEXT UNIQUE NOT NULL,
  veiculo TEXT NOT NULL,
  ano_veiculo INTEGER NOT NULL,
  valor_entrada NUMERIC NOT NULL,
  parcelas INTEGER NOT NULL,
  valor_parcela NUMERIC NOT NULL,
  status TEXT DEFAULT 'pendente',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela para veículos Pro Motors
CREATE TABLE IF NOT EXISTS public.veiculos_pro_motors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  marca TEXT NOT NULL,
  modelo TEXT NOT NULL,
  ano INTEGER NOT NULL,
  preco NUMERIC NOT NULL,
  ativo BOOLEAN DEFAULT true
);

-- Inserir alguns veículos de exemplo
INSERT INTO public.veiculos_pro_motors (marca, modelo, ano, preco) VALUES
('Fiat', 'Mobi', 2024, 45000),
('Fiat', 'Argo', 2024, 55000),
('Chevrolet', 'Onix', 2024, 60000),
('Volkswagen', 'Polo', 2024, 70000),
('Toyota', 'Corolla', 2024, 120000),
('Honda', 'Civic', 2024, 130000)
ON CONFLICT DO NOTHING;

-- Criar view para extrato Binance
CREATE OR REPLACE VIEW public.extrato_binance AS
SELECT 
  id,
  user_id,
  tipo,
  valor,
  moeda,
  created_at as data,
  status
FROM public.binance_transactions
ORDER BY created_at DESC;

-- Habilitar RLS para todas as tabelas
ALTER TABLE public.perfil_kyc ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.binance_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.binance_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.giftcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.propostas_financiamento ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.veiculos_pro_motors ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para perfil_kyc
CREATE POLICY "Users can view own KYC data" ON public.perfil_kyc
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own KYC data" ON public.perfil_kyc
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own KYC data" ON public.perfil_kyc
  FOR UPDATE USING (auth.uid() = user_id);

-- Políticas RLS para binance_wallets  
CREATE POLICY "Users can view own wallet" ON public.binance_wallets
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own wallet" ON public.binance_wallets
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own wallet" ON public.binance_wallets
  FOR UPDATE USING (auth.uid() = user_id);

-- Políticas RLS para binance_transactions
CREATE POLICY "Users can view own transactions" ON public.binance_transactions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own transactions" ON public.binance_transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Políticas RLS para giftcards
CREATE POLICY "Users can view own giftcards" ON public.giftcards
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own giftcards" ON public.giftcards
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Políticas RLS para propostas_financiamento
CREATE POLICY "Users can view own proposals" ON public.propostas_financiamento
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own proposals" ON public.propostas_financiamento
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política pública para veículos
CREATE POLICY "Anyone can view vehicles" ON public.veiculos_pro_motors
  FOR SELECT TO authenticated USING (true);

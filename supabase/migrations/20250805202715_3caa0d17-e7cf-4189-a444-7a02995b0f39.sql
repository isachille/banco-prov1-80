-- Enable RLS on financial tables and create secure policies

-- Create tables if they don't exist and enable RLS
CREATE TABLE IF NOT EXISTS public.subcontas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nome TEXT NOT NULL,
  banco TEXT,
  agencia TEXT,
  conta TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.transacoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subconta_id UUID REFERENCES public.subcontas(id),
  tipo TEXT NOT NULL,
  valor NUMERIC NOT NULL,
  taxa_efi NUMERIC DEFAULT 0,
  taxa_sua NUMERIC DEFAULT 0,
  descricao TEXT,
  status TEXT NOT NULL DEFAULT 'concluida',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.binance_wallets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  balance NUMERIC NOT NULL DEFAULT 0,
  crypto_balance JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.binance_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tipo TEXT NOT NULL,
  valor NUMERIC NOT NULL,
  moeda TEXT NOT NULL DEFAULT 'BRL',
  chave_pix TEXT,
  status TEXT NOT NULL DEFAULT 'pendente',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.giftcards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  giftcard_name TEXT NOT NULL,
  valor NUMERIC NOT NULL,
  codigo TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'ativo',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  used_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on all financial tables
ALTER TABLE public.subcontas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.binance_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.binance_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.giftcards ENABLE ROW LEVEL SECURITY;

-- Create secure RLS policies for subcontas
CREATE POLICY "Users can view their own subcontas" 
ON public.subcontas 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own subcontas" 
ON public.subcontas 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subcontas" 
ON public.subcontas 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all subcontas" 
ON public.subcontas 
FOR SELECT 
USING (is_admin_user(auth.uid()));

-- Create secure RLS policies for transacoes
CREATE POLICY "Users can view their own transacoes" 
ON public.transacoes 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own transacoes" 
ON public.transacoes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all transacoes" 
ON public.transacoes 
FOR SELECT 
USING (is_admin_user(auth.uid()));

CREATE POLICY "Admins can update transacoes" 
ON public.transacoes 
FOR UPDATE 
USING (is_admin_user(auth.uid()));

-- Create secure RLS policies for binance_wallets
CREATE POLICY "Users can view their own binance wallet" 
ON public.binance_wallets 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own binance wallet" 
ON public.binance_wallets 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all binance wallets" 
ON public.binance_wallets 
FOR SELECT 
USING (is_admin_user(auth.uid()));

CREATE POLICY "Admins can update all binance wallets" 
ON public.binance_wallets 
FOR UPDATE 
USING (is_admin_user(auth.uid()));

-- Create secure RLS policies for binance_transactions
CREATE POLICY "Users can view their own binance transactions" 
ON public.binance_transactions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own binance transactions" 
ON public.binance_transactions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all binance transactions" 
ON public.binance_transactions 
FOR SELECT 
USING (is_admin_user(auth.uid()));

-- Create secure RLS policies for giftcards
CREATE POLICY "Users can view their own giftcards" 
ON public.giftcards 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own giftcards" 
ON public.giftcards 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all giftcards" 
ON public.giftcards 
FOR SELECT 
USING (is_admin_user(auth.uid()));

-- Fix the existing transferir_saldo function to use proper search path
CREATE OR REPLACE FUNCTION public.transferir_saldo(p_de uuid, p_para uuid, p_valor numeric)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = public
AS $$
DECLARE
  saldo_origem DECIMAL;
  resultado JSON;
BEGIN
  -- Check if user has permission (admin or dono)
  IF NOT EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND (role = 'admin' OR role = 'dono' OR is_admin = true)
  ) THEN
    RAISE EXCEPTION 'Acesso negado';
  END IF;

  -- Get source wallet balance
  SELECT saldo INTO saldo_origem
  FROM public.wallets
  WHERE user_id = p_de;

  -- Check if source has sufficient balance
  IF saldo_origem < p_valor THEN
    RAISE EXCEPTION 'Saldo insuficiente';
  END IF;

  -- Perform transfer
  UPDATE public.wallets 
  SET saldo = saldo - p_valor, updated_at = NOW()
  WHERE user_id = p_de;

  UPDATE public.wallets 
  SET saldo = saldo + p_valor, updated_at = NOW()
  WHERE user_id = p_para;

  resultado := json_build_object(
    'success', true,
    'message', 'Transferência realizada com sucesso'
  );

  RETURN resultado;
END;
$$;
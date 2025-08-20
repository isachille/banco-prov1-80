-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar tabela para transações Pixley
CREATE TABLE public.pixley_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  transaction_id TEXT, -- ID da transação na Pixley
  type TEXT NOT NULL CHECK (type IN ('on-ramp', 'off-ramp')),
  source_currency TEXT NOT NULL,
  source_amount NUMERIC NOT NULL,
  target_currency TEXT NOT NULL,
  target_amount NUMERIC,
  wallet_address TEXT,
  network TEXT,
  pix_key TEXT,
  pix_key_type TEXT CHECK (pix_key_type IN ('email', 'cpf', 'phone', 'aleatoria')),
  recipient_name TEXT,
  recipient_document TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  qr_code TEXT,
  tx_hash TEXT,
  explorer_url TEXT,
  external_id TEXT UNIQUE, -- Para idempotência
  fees JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pixley_transactions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own pixley transactions" 
ON public.pixley_transactions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own pixley transactions" 
ON public.pixley_transactions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pixley transactions" 
ON public.pixley_transactions 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all pixley transactions" 
ON public.pixley_transactions 
FOR SELECT 
USING (is_admin_user(auth.uid()));

CREATE POLICY "Admins can update all pixley transactions" 
ON public.pixley_transactions 
FOR UPDATE 
USING (is_admin_user(auth.uid()));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_pixley_transactions_updated_at
BEFORE UPDATE ON public.pixley_transactions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_pixley_transactions_user_id ON public.pixley_transactions(user_id);
CREATE INDEX idx_pixley_transactions_transaction_id ON public.pixley_transactions(transaction_id);
CREATE INDEX idx_pixley_transactions_external_id ON public.pixley_transactions(external_id);
CREATE INDEX idx_pixley_transactions_status ON public.pixley_transactions(status);
CREATE INDEX idx_pixley_transactions_type ON public.pixley_transactions(type);
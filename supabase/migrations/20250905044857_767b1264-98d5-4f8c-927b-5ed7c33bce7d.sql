-- Criar tabela de propostas_financiamento
CREATE TABLE public.propostas_financiamento (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  codigo text NOT NULL UNIQUE,
  marca text NOT NULL,
  modelo text NOT NULL,
  ano integer NOT NULL,
  valorVeiculo numeric NOT NULL,
  valorEntrada numeric NOT NULL,
  parcelas integer NOT NULL,
  valorParcela numeric NOT NULL,
  operador_id uuid,
  admin_id uuid,
  status text NOT NULL DEFAULT 'pendente',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Criar tabela de contratos
CREATE TABLE public.contratos_financiamento (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  proposta_id uuid NOT NULL REFERENCES public.propostas_financiamento(id),
  user_id uuid NOT NULL,
  codigo_contrato text NOT NULL UNIQUE,
  cliente_nome text NOT NULL,
  cliente_cpf text NOT NULL,
  cliente_data_nascimento date,
  cliente_nome_mae text,
  assinatura_cliente text,
  banco_promotor text,
  status_contrato text NOT NULL DEFAULT 'aguardando_assinatura',
  link_assinatura text,
  email_enviado boolean DEFAULT false,
  assinado_em timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Criar tabela de operadores
CREATE TABLE public.operadores (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome text NOT NULL,
  telefone text,
  email text,
  ativo boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.propostas_financiamento ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contratos_financiamento ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.operadores ENABLE ROW LEVEL SECURITY;

-- Policies para propostas_financiamento
CREATE POLICY "Users can view their own proposals" 
ON public.propostas_financiamento 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all proposals" 
ON public.propostas_financiamento 
FOR SELECT 
USING (is_admin_user(auth.uid()));

CREATE POLICY "Users can create their own proposals" 
ON public.propostas_financiamento 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update all proposals" 
ON public.propostas_financiamento 
FOR UPDATE 
USING (is_admin_user(auth.uid()));

-- Policies para contratos_financiamento
CREATE POLICY "Users can view their own contracts" 
ON public.contratos_financiamento 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all contracts" 
ON public.contratos_financiamento 
FOR SELECT 
USING (is_admin_user(auth.uid()));

CREATE POLICY "Admins can create contracts" 
ON public.contratos_financiamento 
FOR INSERT 
WITH CHECK (is_admin_user(auth.uid()));

CREATE POLICY "Admins can update contracts" 
ON public.contratos_financiamento 
FOR UPDATE 
USING (is_admin_user(auth.uid()));

CREATE POLICY "Public can update contract signatures" 
ON public.contratos_financiamento 
FOR UPDATE 
USING (status_contrato = 'aguardando_assinatura');

-- Policies para operadores
CREATE POLICY "Admins can manage operadores" 
ON public.operadores 
FOR ALL 
USING (is_admin_user(auth.uid()));

-- Inserir operadores de exemplo
INSERT INTO public.operadores (nome, telefone, email) VALUES
('João Silva', '(11) 99999-1234', 'joao@promontors.com.br'),
('Maria Santos', '(11) 99999-5678', 'maria@promontors.com.br'),
('Carlos Oliveira', '(11) 99999-9012', 'carlos@promontors.com.br');

-- Trigger para atualizar updated_at
CREATE TRIGGER update_propostas_updated_at
    BEFORE UPDATE ON public.propostas_financiamento
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contratos_updated_at
    BEFORE UPDATE ON public.contratos_financiamento
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
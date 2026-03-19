
CREATE TABLE public.acompanhamentos_clientes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome_completo TEXT NOT NULL,
  cpf TEXT NOT NULL,
  telefone TEXT NOT NULL,
  email TEXT NOT NULL,
  veiculo TEXT NOT NULL,
  valor_veiculo NUMERIC NOT NULL DEFAULT 0,
  entrada_disponivel NUMERIC NOT NULL DEFAULT 0,
  banco_financeira TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'Pendente em análise',
  observacoes_internas TEXT,
  pendencias_documentacao TEXT,
  responsavel_atendimento TEXT NOT NULL DEFAULT '',
  rg TEXT,
  cnh TEXT,
  renda_mensal NUMERIC,
  profissao TEXT,
  score_estimado INTEGER,
  tipo_cliente TEXT,
  placa_veiculo TEXT,
  ano_veiculo INTEGER,
  etapa_progresso TEXT NOT NULL DEFAULT 'Cadastro realizado',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.acompanhamentos_clientes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage acompanhamentos" ON public.acompanhamentos_clientes
FOR ALL TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'dono'::app_role) OR 
  has_role(auth.uid(), 'gerente'::app_role) OR 
  has_role(auth.uid(), 'operador'::app_role)
)
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'dono'::app_role) OR 
  has_role(auth.uid(), 'gerente'::app_role) OR 
  has_role(auth.uid(), 'operador'::app_role)
);

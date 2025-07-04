
-- Criar tabela para armazenar propostas de financiamento
CREATE TABLE public.propostas_financiamento (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  codigo_proposta TEXT NOT NULL UNIQUE,
  cliente_nome TEXT NOT NULL,
  cliente_cpf TEXT NOT NULL,
  cliente_nascimento DATE,
  cliente_mae TEXT,
  cliente_profissao TEXT,
  veiculo TEXT NOT NULL,
  marca TEXT NOT NULL,
  modelo TEXT NOT NULL,
  ano_veiculo INTEGER NOT NULL,
  valor_veiculo NUMERIC NOT NULL,
  valor_entrada NUMERIC NOT NULL,
  parcelas INTEGER NOT NULL,
  valor_parcela NUMERIC NOT NULL,
  valor_total NUMERIC NOT NULL,
  taxa_juros NUMERIC NOT NULL,
  operador_id TEXT,
  operador_nome TEXT,
  operador_telefone TEXT,
  status TEXT NOT NULL DEFAULT 'pendente',
  criado_por UUID REFERENCES public.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS na tabela de propostas
ALTER TABLE public.propostas_financiamento ENABLE ROW LEVEL SECURITY;

-- Políticas para propostas de financiamento
-- Usuários comuns só veem suas próprias propostas
CREATE POLICY "Users can view their own proposals" 
  ON public.propostas_financiamento 
  FOR SELECT 
  USING (
    user_id = auth.uid() OR 
    (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'dono', 'gerente')
  );

-- Usuários podem inserir propostas
CREATE POLICY "Users can create proposals" 
  ON public.propostas_financiamento 
  FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

-- Apenas gerentes/donos podem atualizar propostas
CREATE POLICY "Managers can update proposals" 
  ON public.propostas_financiamento 
  FOR UPDATE 
  USING ((SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'dono', 'gerente'));

-- Criar tabela para notificações de propostas para operadores
CREATE TABLE public.propostas_operadores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  proposta_id UUID REFERENCES public.propostas_financiamento(id) NOT NULL,
  operador_id TEXT NOT NULL,
  operador_nome TEXT NOT NULL,
  operador_telefone TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pendente',
  atribuido_por UUID REFERENCES public.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS na tabela de propostas para operadores
ALTER TABLE public.propostas_operadores ENABLE ROW LEVEL SECURITY;

-- Política para operadores verem apenas suas propostas
CREATE POLICY "Operators can view their proposals" 
  ON public.propostas_operadores 
  FOR SELECT 
  USING (
    operador_id IN (SELECT id FROM public.operadores_cadastrados WHERE user_id = auth.uid()) OR
    (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'dono', 'gerente')
  );

-- Apenas gerentes/donos podem inserir/atualizar
CREATE POLICY "Managers can manage operator proposals" 
  ON public.propostas_operadores 
  FOR ALL 
  USING ((SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'dono', 'gerente'));

-- Criar tabela para cadastrar operadores no sistema
CREATE TABLE public.operadores_cadastrados (
  id TEXT NOT NULL PRIMARY KEY,
  nome TEXT NOT NULL,
  telefone TEXT NOT NULL,
  email TEXT,
  user_id UUID REFERENCES public.users(id),
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS na tabela de operadores
ALTER TABLE public.operadores_cadastrados ENABLE ROW LEVEL SECURITY;

-- Política para operadores cadastrados
CREATE POLICY "Everyone can view active operators" 
  ON public.operadores_cadastrados 
  FOR SELECT 
  USING (ativo = true);

CREATE POLICY "Managers can manage operators" 
  ON public.operadores_cadastrados 
  FOR ALL 
  USING ((SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'dono', 'gerente'));

-- Inserir operadores padrão na tabela
INSERT INTO public.operadores_cadastrados (id, nome, telefone, email, ativo) VALUES
('op1', 'Carlos Silva', '(61) 98765-4321', 'carlos@promotoers.com', true),
('op2', 'Ana Santos', '(61) 99876-5432', 'ana@promotoers.com', true),
('op3', 'João Oliveira', '(61) 97654-3210', 'joao@promotoers.com', true),
('op4', 'Maria Costa', '(61) 96543-2109', 'maria@promotoers.com', true),
('op5', 'Pedro Almeida', '(61) 95432-1098', 'pedro@promotoers.com', true);

-- Habilitar realtime para as tabelas
ALTER PUBLICATION supabase_realtime ADD TABLE public.propostas_financiamento;
ALTER PUBLICATION supabase_realtime ADD TABLE public.propostas_operadores;
ALTER PUBLICATION supabase_realtime ADD TABLE public.operadores_cadastrados;

-- Função para atribuir proposta a operador
CREATE OR REPLACE FUNCTION public.atribuir_proposta_operador(
  p_proposta_id UUID,
  p_operador_id TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  operador_info RECORD;
  resultado JSON;
BEGIN
  -- Verificar permissão
  IF NOT EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role IN ('admin', 'dono', 'gerente')
  ) THEN
    RAISE EXCEPTION 'Acesso negado';
  END IF;

  -- Buscar informações do operador
  SELECT * INTO operador_info
  FROM public.operadores_cadastrados
  WHERE id = p_operador_id AND ativo = true;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Operador não encontrado';
  END IF;

  -- Atualizar proposta
  UPDATE public.propostas_financiamento 
  SET 
    operador_id = p_operador_id,
    operador_nome = operador_info.nome,
    operador_telefone = operador_info.telefone,
    status = 'em_andamento',
    updated_at = now()
  WHERE id = p_proposta_id;

  -- Criar notificação para operador
  INSERT INTO public.propostas_operadores (
    proposta_id, 
    operador_id, 
    operador_nome, 
    operador_telefone,
    atribuido_por
  ) VALUES (
    p_proposta_id,
    p_operador_id,
    operador_info.nome,
    operador_info.telefone,
    auth.uid()
  );

  resultado := json_build_object(
    'success', true,
    'message', 'Proposta atribuída com sucesso'
  );

  RETURN resultado;
END;
$$;

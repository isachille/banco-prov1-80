-- Create table for fichas cadastrais
CREATE TABLE public.fichas_cadastrais (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proposta_id uuid REFERENCES public.propostas_financiamento(id) ON DELETE CASCADE,
  token_acesso text UNIQUE NOT NULL,
  expira_em timestamp with time zone NOT NULL,
  
  -- Vehicle/Proposal data (pre-filled)
  veiculo_marca text,
  veiculo_modelo text,
  veiculo_ano integer,
  veiculo_cor text,
  valor_veiculo numeric,
  valor_entrada numeric,
  parcelas integer,
  valor_parcela numeric,
  
  -- Personal data
  nome_completo text,
  cpf text,
  rg text,
  data_nascimento date,
  nome_mae text,
  nome_pai text,
  estado_civil text,
  
  -- Contact
  telefone text,
  telefone_alternativo text,
  email text,
  
  -- Address
  cep text,
  endereco text,
  numero text,
  complemento text,
  bairro text,
  cidade text,
  estado text,
  
  -- Reference contact
  referencia_nome text,
  referencia_telefone text,
  referencia_parentesco text,
  
  -- Bank information
  bancos_possui text[], -- Array of banks
  banco_preferido text,
  tipo_conta text,
  
  -- Work information
  empresa_nome text,
  empresa_cnpj text,
  cargo text,
  tempo_servico text,
  renda_mensal numeric,
  tipo_contrato text, -- CLT, PJ, Autônomo
  
  -- Documents
  documento_frente_url text,
  documento_verso_url text,
  tipo_documento text, -- RG or CNH
  
  -- Status
  status text DEFAULT 'pendente' CHECK (status IN ('pendente', 'preenchido', 'documentos_pendentes', 'completo', 'expirado')),
  preenchido_em timestamp with time zone,
  
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.fichas_cadastrais ENABLE ROW LEVEL SECURITY;

-- Admins can do everything
CREATE POLICY "Admins can manage fichas" ON public.fichas_cadastrais
FOR ALL USING (
  has_role(auth.uid(), 'admin') OR 
  has_role(auth.uid(), 'dono') OR 
  has_role(auth.uid(), 'gerente') OR
  has_role(auth.uid(), 'operador')
);

-- Public can read/update by token (for the public form)
CREATE POLICY "Public can access by token" ON public.fichas_cadastrais
FOR SELECT USING (true);

CREATE POLICY "Public can update by token" ON public.fichas_cadastrais
FOR UPDATE USING (
  token_acesso IS NOT NULL AND 
  expira_em > now() AND
  status != 'completo'
);

-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'fichas-documentos', 
  'fichas-documentos', 
  false,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
);

-- Storage policies
CREATE POLICY "Admins can view all documents" ON storage.objects
FOR SELECT USING (
  bucket_id = 'fichas-documentos' AND (
    has_role(auth.uid(), 'admin') OR 
    has_role(auth.uid(), 'dono') OR 
    has_role(auth.uid(), 'gerente') OR
    has_role(auth.uid(), 'operador')
  )
);

CREATE POLICY "Public can upload documents" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'fichas-documentos'
);

-- Update trigger
CREATE TRIGGER update_fichas_cadastrais_updated_at
BEFORE UPDATE ON public.fichas_cadastrais
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
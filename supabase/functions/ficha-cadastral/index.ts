import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation helpers
const MAX_STRING_LENGTH = 255;
const MAX_TEXT_LENGTH = 1000;
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

function validateCPF(cpf: string | null | undefined): boolean {
  if (!cpf) return true; // Optional field
  const cleaned = cpf.replace(/\D/g, '');
  return cleaned.length === 11;
}

function validateEmail(email: string | null | undefined): boolean {
  if (!email) return true; // Optional field
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= MAX_STRING_LENGTH;
}

function validatePhone(phone: string | null | undefined): boolean {
  if (!phone) return true; // Optional field
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10 && cleaned.length <= 11;
}

function validateCNPJ(cnpj: string | null | undefined): boolean {
  if (!cnpj) return true; // Optional field
  const cleaned = cnpj.replace(/\D/g, '');
  return cleaned.length === 14;
}

function sanitizeString(value: string | null | undefined, maxLength: number = MAX_STRING_LENGTH): string | null {
  if (!value) return null;
  // Trim and limit length
  return value.trim().substring(0, maxLength);
}

function sanitizeNumber(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  const num = Number(value);
  if (isNaN(num) || num < 0 || num > 1000000000) return null;
  return num;
}

function validateFichaData(data: Record<string, unknown>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validate CPF
  if (data.cpf && !validateCPF(data.cpf as string)) {
    errors.push('CPF inválido');
  }

  // Validate email
  if (data.email && !validateEmail(data.email as string)) {
    errors.push('Email inválido');
  }

  // Validate phones
  if (data.telefone && !validatePhone(data.telefone as string)) {
    errors.push('Telefone inválido');
  }
  if (data.telefone_alternativo && !validatePhone(data.telefone_alternativo as string)) {
    errors.push('Telefone alternativo inválido');
  }

  // Validate CNPJ
  if (data.empresa_cnpj && !validateCNPJ(data.empresa_cnpj as string)) {
    errors.push('CNPJ inválido');
  }

  // Validate numeric fields
  if (data.renda_mensal !== undefined && data.renda_mensal !== null) {
    const renda = sanitizeNumber(data.renda_mensal);
    if (renda === null) {
      errors.push('Renda mensal inválida');
    }
  }

  return { valid: errors.length === 0, errors };
}

function sanitizeFichaData(data: Record<string, unknown>): Record<string, unknown> {
  return {
    nome_completo: sanitizeString(data.nome_completo as string),
    cpf: sanitizeString(data.cpf as string, 20),
    rg: sanitizeString(data.rg as string, 20),
    email: sanitizeString(data.email as string),
    telefone: sanitizeString(data.telefone as string, 20),
    telefone_alternativo: sanitizeString(data.telefone_alternativo as string, 20),
    nome_mae: sanitizeString(data.nome_mae as string),
    nome_pai: sanitizeString(data.nome_pai as string),
    estado_civil: sanitizeString(data.estado_civil as string, 50),
    data_nascimento: data.data_nascimento || null,
    cep: sanitizeString(data.cep as string, 10),
    endereco: sanitizeString(data.endereco as string),
    numero: sanitizeString(data.numero as string, 20),
    complemento: sanitizeString(data.complemento as string, 100),
    bairro: sanitizeString(data.bairro as string, 100),
    cidade: sanitizeString(data.cidade as string, 100),
    estado: sanitizeString(data.estado as string, 2),
    empresa_nome: sanitizeString(data.empresa_nome as string),
    empresa_cnpj: sanitizeString(data.empresa_cnpj as string, 20),
    cargo: sanitizeString(data.cargo as string, 100),
    tempo_servico: sanitizeString(data.tempo_servico as string, 50),
    tipo_contrato: sanitizeString(data.tipo_contrato as string, 50),
    renda_mensal: sanitizeNumber(data.renda_mensal),
    referencia_nome: sanitizeString(data.referencia_nome as string),
    referencia_telefone: sanitizeString(data.referencia_telefone as string, 20),
    referencia_parentesco: sanitizeString(data.referencia_parentesco as string, 50),
    bancos_possui: Array.isArray(data.bancos_possui) ? data.bancos_possui.slice(0, 10) : null,
    banco_preferido: sanitizeString(data.banco_preferido as string, 100),
    tipo_conta: sanitizeString(data.tipo_conta as string, 50),
    tipo_documento: sanitizeString(data.tipo_documento as string, 20),
    status: sanitizeString(data.status as string, 20),
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const url = new URL(req.url);
    let action = url.searchParams.get('action');
    
    // For POST requests, also check body for action
    let bodyData: Record<string, unknown> | null = null;
    if (req.method === 'POST' && !action) {
      const clonedReq = req.clone();
      try {
        bodyData = await clonedReq.json();
        action = (bodyData?.action as string) || null;
      } catch {
        // Not JSON body, continue
      }
    }

    // GET - Fetch ficha by token
    if (req.method === 'GET' && action === 'get') {
      const token = url.searchParams.get('token');
      
      if (!token || token.length > 64) {
        return new Response(
          JSON.stringify({ error: 'Token inválido' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { data: ficha, error } = await supabase
        .from('fichas_cadastrais')
        .select('*')
        .eq('token_acesso', token)
        .maybeSingle();

      if (error) {
        return new Response(
          JSON.stringify({ error: 'Erro ao buscar ficha' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (!ficha) {
        return new Response(
          JSON.stringify({ error: 'Ficha não encontrada' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Check if expired
      if (new Date(ficha.expira_em) < new Date()) {
        await supabase
          .from('fichas_cadastrais')
          .update({ status: 'expirado' })
          .eq('id', ficha.id);

        return new Response(
          JSON.stringify({ error: 'Link expirado', expired: true }),
          { status: 410, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ ficha }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // POST - Update ficha data
    if (req.method === 'POST' && action === 'update') {
      const { token, data } = await req.json();

      if (!token || token.length > 64) {
        return new Response(
          JSON.stringify({ error: 'Token inválido' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Validate input data
      const validation = validateFichaData(data || {});
      if (!validation.valid) {
        return new Response(
          JSON.stringify({ error: 'Dados inválidos', details: validation.errors }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Verify token exists and is not expired
      const { data: ficha, error: fetchError } = await supabase
        .from('fichas_cadastrais')
        .select('id, expira_em, status')
        .eq('token_acesso', token)
        .maybeSingle();

      if (fetchError || !ficha) {
        return new Response(
          JSON.stringify({ error: 'Ficha não encontrada' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (new Date(ficha.expira_em) < new Date()) {
        return new Response(
          JSON.stringify({ error: 'Link expirado' }),
          { status: 410, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (ficha.status === 'completo') {
        return new Response(
          JSON.stringify({ error: 'Ficha já foi preenchida' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Sanitize and update ficha
      const sanitizedData = sanitizeFichaData(data || {});
      const { error: updateError } = await supabase
        .from('fichas_cadastrais')
        .update({
          ...sanitizedData,
          updated_at: new Date().toISOString()
        })
        .eq('id', ficha.id);

      if (updateError) {
        return new Response(
          JSON.stringify({ error: 'Erro ao atualizar ficha' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // POST - Upload document
    if (req.method === 'POST' && action === 'upload') {
      const formData = await req.formData();
      const file = formData.get('file') as File;
      const token = formData.get('token') as string;
      const tipo = formData.get('tipo') as string; // 'frente' or 'verso'

      if (!file || !token || !tipo) {
        return new Response(
          JSON.stringify({ error: 'Dados incompletos' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Validate token format
      if (token.length > 64) {
        return new Response(
          JSON.stringify({ error: 'Token inválido' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Validate file type
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        return new Response(
          JSON.stringify({ error: 'Tipo de arquivo não permitido. Use JPEG, PNG ou PDF.' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        return new Response(
          JSON.stringify({ error: 'Arquivo muito grande. Máximo 5MB.' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Validate tipo
      if (!['frente', 'verso'].includes(tipo)) {
        return new Response(
          JSON.stringify({ error: 'Tipo de documento inválido' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Verify token
      const { data: ficha, error: fetchError } = await supabase
        .from('fichas_cadastrais')
        .select('id, expira_em')
        .eq('token_acesso', token)
        .maybeSingle();

      if (fetchError || !ficha) {
        return new Response(
          JSON.stringify({ error: 'Ficha não encontrada' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (new Date(ficha.expira_em) < new Date()) {
        return new Response(
          JSON.stringify({ error: 'Link expirado' }),
          { status: 410, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Upload file with validated extension
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const allowedExtensions = ['jpg', 'jpeg', 'png', 'pdf'];
      if (!fileExt || !allowedExtensions.includes(fileExt)) {
        return new Response(
          JSON.stringify({ error: 'Extensão de arquivo inválida' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const fileName = `${ficha.id}/${tipo}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('fichas-documentos')
        .upload(fileName, file, {
          upsert: true,
          contentType: file.type
        });

      if (uploadError) {
        return new Response(
          JSON.stringify({ error: 'Erro ao fazer upload' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Update ficha with document URL
      const updateField = tipo === 'frente' ? 'documento_frente_url' : 'documento_verso_url';
      await supabase
        .from('fichas_cadastrais')
        .update({ [updateField]: uploadData.path })
        .eq('id', ficha.id);

      return new Response(
        JSON.stringify({ success: true, path: uploadData.path }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // POST - Create new ficha (requires auth)
    if (req.method === 'POST' && action === 'create') {
      const authHeader = req.headers.get('Authorization');
      if (!authHeader) {
        return new Response(
          JSON.stringify({ error: 'Não autorizado' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { data: { user }, error: authError } = await supabase.auth.getUser(
        authHeader.replace('Bearer ', '')
      );

      if (authError || !user) {
        return new Response(
          JSON.stringify({ error: 'Não autorizado' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Use already parsed body or parse now
      const requestData = bodyData || await req.json();
      
      // Accept data directly or wrapped in propostaData
      const propostaData = (requestData.propostaData || requestData) as Record<string, unknown>;

      // Generate unique token
      const token = crypto.randomUUID().replace(/-/g, '');
      
      // Set expiration to 7 days
      const expiraEm = new Date();
      expiraEm.setDate(expiraEm.getDate() + 7);

      const { data: ficha, error: createError } = await supabase
        .from('fichas_cadastrais')
        .insert({
          proposta_id: sanitizeString(propostaData.proposta_id as string, 64) || null,
          token_acesso: token,
          expira_em: expiraEm.toISOString(),
          veiculo_marca: sanitizeString((propostaData.veiculo_marca || propostaData.marca) as string, 100),
          veiculo_modelo: sanitizeString((propostaData.veiculo_modelo || propostaData.modelo) as string, 100),
          veiculo_ano: sanitizeNumber(propostaData.veiculo_ano || propostaData.ano),
          veiculo_cor: sanitizeString((propostaData.veiculo_cor || propostaData.cor) as string, 50),
          valor_veiculo: sanitizeNumber(propostaData.valor_veiculo || propostaData.valorVeiculo),
          valor_entrada: sanitizeNumber(propostaData.valor_entrada || propostaData.entrada),
          parcelas: sanitizeNumber(propostaData.parcelas),
          valor_parcela: sanitizeNumber(propostaData.valor_parcela || propostaData.valorParcela),
          nome_completo: sanitizeString((propostaData.nome_completo || propostaData.nomeCliente) as string),
          cpf: sanitizeString((propostaData.cpf || propostaData.cpfCliente) as string, 20),
          nome_mae: sanitizeString((propostaData.nome_mae || propostaData.nomeMae) as string),
          data_nascimento: propostaData.data_nascimento || propostaData.dataNascimento || null,
          created_by: user.id,
          status: 'pendente'
        })
        .select()
        .single();

      if (createError) {
        return new Response(
          JSON.stringify({ error: 'Erro ao criar ficha' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          ficha,
          token: token,
          link: `${req.headers.get('origin')}/ficha-cadastral/${token}`
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Ação não encontrada' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    // Log error server-side only, return generic message to client
    console.error('Internal error:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
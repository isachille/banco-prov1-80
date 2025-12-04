import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
    const action = url.searchParams.get('action');

    // GET - Fetch ficha by token
    if (req.method === 'GET' && action === 'get') {
      const token = url.searchParams.get('token');
      
      if (!token) {
        return new Response(
          JSON.stringify({ error: 'Token não fornecido' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { data: ficha, error } = await supabase
        .from('fichas_cadastrais')
        .select('*')
        .eq('token_acesso', token)
        .maybeSingle();

      if (error) {
        console.error('Error fetching ficha:', error);
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

      if (!token) {
        return new Response(
          JSON.stringify({ error: 'Token não fornecido' }),
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

      // Update ficha
      const { error: updateError } = await supabase
        .from('fichas_cadastrais')
        .update({
          ...data,
          updated_at: new Date().toISOString()
        })
        .eq('id', ficha.id);

      if (updateError) {
        console.error('Error updating ficha:', updateError);
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

      // Upload file
      const fileExt = file.name.split('.').pop();
      const fileName = `${ficha.id}/${tipo}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('fichas-documentos')
        .upload(fileName, file, {
          upsert: true,
          contentType: file.type
        });

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
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

      const { propostaData } = await req.json();

      // Generate unique token
      const token = crypto.randomUUID().replace(/-/g, '');
      
      // Set expiration to 7 days
      const expiraEm = new Date();
      expiraEm.setDate(expiraEm.getDate() + 7);

      const { data: ficha, error: createError } = await supabase
        .from('fichas_cadastrais')
        .insert({
          proposta_id: propostaData.proposta_id || null,
          token_acesso: token,
          expira_em: expiraEm.toISOString(),
          veiculo_marca: propostaData.marca,
          veiculo_modelo: propostaData.modelo,
          veiculo_ano: propostaData.ano,
          veiculo_cor: propostaData.cor,
          valor_veiculo: propostaData.valorVeiculo,
          valor_entrada: propostaData.entrada,
          parcelas: propostaData.parcelas,
          valor_parcela: propostaData.valorParcela,
          nome_completo: propostaData.nomeCliente,
          cpf: propostaData.cpfCliente,
          nome_mae: propostaData.nomeMae,
          data_nascimento: propostaData.dataNascimento,
          created_by: user.id,
          status: 'pendente'
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating ficha:', createError);
        return new Response(
          JSON.stringify({ error: 'Erro ao criar ficha' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          ficha,
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
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
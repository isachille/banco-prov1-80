import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { proposal_id, decision } = await req.json();

    if (!proposal_id || !decision) {
      return new Response(
        JSON.stringify({ error: 'ID da proposta e decisão são obrigatórios' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!['aprovado', 'recusado'].includes(decision)) {
      return new Response(
        JSON.stringify({ error: 'Decisão deve ser "aprovado" ou "recusado"' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Token de autorização é obrigatório' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify user is admin
    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Usuário não autenticado' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user is admin
    const { data: adminData, error: adminError } = await supabase
      .from('users')
      .select('is_admin, role')
      .eq('id', user.id)
      .single();

    if (adminError || (!adminData?.is_admin && !['admin', 'dono'].includes(adminData?.role))) {
      return new Response(
        JSON.stringify({ error: 'Acesso negado. Apenas administradores podem processar propostas' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update proposal status
    const { error: updateError } = await supabase
      .from('propostas_financiamento')
      .update({
        status: decision,
        updated_at: new Date().toISOString(),
        admin_id: user.id
      })
      .eq('id', proposal_id);

    if (updateError) {
      console.error('Erro ao atualizar proposta:', updateError);
      return new Response(
        JSON.stringify({ error: 'Erro ao processar decisão da proposta' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Proposta ${decision} com sucesso`,
        status: decision 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erro no processamento:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
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

    const { codigo_contrato, cliente_email, cliente_nome } = await req.json();

    if (!codigo_contrato || !cliente_email) {
      return new Response(
        JSON.stringify({ error: 'Código do contrato e email são obrigatórios' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Buscar dados do contrato
    const { data: contrato, error: contratoError } = await supabase
      .from('contratos_financiamento')
      .select(`
        *,
        proposta:propostas_financiamento!contratos_financiamento_proposta_id_fkey(
          codigo,
          marca,
          modelo,
          ano,
          valorVeiculo,
          valorEntrada,
          parcelas,
          valorParcela
        )
      `)
      .eq('codigo_contrato', codigo_contrato)
      .single();

    if (contratoError || !contrato) {
      return new Response(
        JSON.stringify({ error: 'Contrato não encontrado' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Atualizar status de email enviado
    const { error: updateError } = await supabase
      .from('contratos_financiamento')
      .update({ 
        email_enviado: true,
        updated_at: new Date().toISOString()
      })
      .eq('codigo_contrato', codigo_contrato);

    if (updateError) {
      console.error('Erro ao atualizar status do email:', updateError);
    }

    // Aqui você pode implementar o envio real do email usando Resend ou outro serviço
    // Por enquanto, vamos simular o envio
    console.log('Email seria enviado para:', cliente_email);
    console.log('Dados do contrato:', contrato);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email enviado com sucesso',
        contrato_codigo: codigo_contrato
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erro no envio de email:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
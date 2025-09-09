import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { codigo_contrato, cliente_email, cliente_nome } = await req.json();

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: contrato, error: contractError } = await supabase
      .from('contratos_financiamento')
      .select(`*, proposta:propostas_financiamento(*)`)
      .eq('codigo_contrato', codigo_contrato)
      .single();

    if (contractError || !contrato) {
      throw new Error('Contrato não encontrado');
    }

    const linkAssinatura = `${Deno.env.get('SUPABASE_URL')?.replace('supabase.co', 'lovable.app') || 'http://localhost:3000'}/assinar-contrato/${codigo_contrato}`;

    console.log('Email enviado para:', cliente_email, 'Link:', linkAssinatura);

    const { error: updateError } = await supabase
      .from('contratos_financiamento')
      .update({ 
        email_enviado: true,
        updated_at: new Date().toISOString()
      })
      .eq('codigo_contrato', codigo_contrato);

    if (updateError) console.error('Erro ao atualizar:', updateError);

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Email processado',
      link_assinatura: linkAssinatura
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Erro:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
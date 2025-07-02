
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

    const { user_id, chave_pix, valor } = await req.json();

    if (!user_id || !chave_pix || !valor) {
      return new Response(
        JSON.stringify({ status: 'error', message: 'Dados incompletos' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Simular validação da chave PIX
    const validKeys = [
      '123.456.789-00',
      'usuario@email.com',
      '(61) 98765-4321',
      '7f4b8d2e-1a3c-4e5f-9g8h-1i2j3k4l5m6n'
    ];

    if (!validKeys.some(key => chave_pix.includes(key.substring(0, 3)))) {
      // Simular que é válida mesmo assim para demonstração
    }

    // Verificar saldo
    const { data: walletData, error: walletError } = await supabase
      .from('binance_wallets')
      .select('balance')
      .eq('user_id', user_id)
      .single();

    if (walletError || !walletData || walletData.balance < valor) {
      return new Response(
        JSON.stringify({ status: 'error', message: 'Saldo insuficiente' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Registrar transação
    const { error: transactionError } = await supabase
      .from('binance_transactions')
      .insert({
        user_id: user_id,
        tipo: 'PIX_out',
        valor: valor,
        moeda: 'BRL',
        chave_pix: chave_pix,
        status: 'concluido',
        metadata: { chave_pix }
      });

    if (transactionError) {
      console.error('Erro ao registrar transação:', transactionError);
      throw transactionError;
    }

    // Atualizar saldo
    const { error: updateError } = await supabase
      .from('binance_wallets')
      .update({ balance: walletData.balance - valor })
      .eq('user_id', user_id);

    if (updateError) {
      console.error('Erro ao atualizar saldo:', updateError);
      throw updateError;
    }

    return new Response(
      JSON.stringify({ 
        status: 'success', 
        message: 'PIX processado com sucesso',
        transaction_id: `PIX-${Date.now()}`
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erro ao processar PIX:', error);
    return new Response(
      JSON.stringify({ 
        status: 'error', 
        message: error.message || 'Erro interno do servidor' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

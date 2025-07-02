
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

    const { user_id, giftcard_name, valor } = await req.json();

    if (!user_id || !giftcard_name || !valor) {
      return new Response(
        JSON.stringify({ status: 'error', message: 'Dados incompletos' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
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

    // Gerar código do gift card
    const codigo = `${giftcard_name.toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Registrar gift card
    const { error: giftCardError } = await supabase
      .from('giftcards')
      .insert({
        user_id: user_id,
        nome: giftcard_name,
        valor: valor,
        codigo: codigo,
        status: 'ativo'
      });

    if (giftCardError) {
      console.error('Erro ao registrar gift card:', giftCardError);
      throw giftCardError;
    }

    // Registrar transação
    const { error: transactionError } = await supabase
      .from('binance_transactions')
      .insert({
        user_id: user_id,
        tipo: 'giftcard',
        valor: valor,
        moeda: 'BRL',
        status: 'concluido',
        metadata: { giftcard_name, codigo }
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
        message: 'Gift card comprado com sucesso',
        codigo: codigo,
        saldo_restante: walletData.balance - valor
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erro ao comprar gift card:', error);
    return new Response(
      JSON.stringify({ 
        status: 'error', 
        message: error.message || 'Erro interno do servidor' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

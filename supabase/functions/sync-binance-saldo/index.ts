
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Função sync-binance-saldo iniciada');

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse request body
    const { user_id } = await req.json();
    console.log('User ID recebido:', user_id);

    if (!user_id) {
      return new Response(
        JSON.stringify({ status: 'error', message: 'User ID é obrigatório' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Verificar se o usuário tem uma wallet cripto
    const { data: cryptoWallet, error: cryptoError } = await supabase
      .from('wallets_cripto_binance')
      .select('*')
      .eq('user_id', user_id)
      .single();

    if (cryptoError || !cryptoWallet) {
      console.error('Wallet cripto não encontrada:', cryptoError);
      return new Response(
        JSON.stringify({ status: 'error', message: 'Wallet cripto não encontrada. Ative sua conta cripto primeiro.' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Wallet cripto encontrada:', cryptoWallet);

    // Simular sincronização com Binance (aqui você integraria com a API real da Binance)
    // Por enquanto, vamos simular uma atualização dos saldos
    const novoSaldoCrypto = Math.round((Math.random() * 200 + 50) * 100) / 100; // Entre 50 e 250 USDT
    const cotacaoAtual = 5.50; // Cotação simulada USDT para BRL
    const novoSaldoBRL = novoSaldoCrypto * cotacaoAtual;

    // Atualizar a wallet cripto com os novos saldos
    const { data: updatedCryptoWallet, error: updateCryptoError } = await supabase
      .from('wallets_cripto_binance')
      .update({
        saldo_crypto: novoSaldoCrypto,
        saldo_em_brl: novoSaldoBRL,
        cotacao: cotacaoAtual,
        atualizado_em: new Date().toISOString()
      })
      .eq('id', cryptoWallet.id)
      .select()
      .single();

    if (updateCryptoError) {
      console.error('Erro ao atualizar wallet cripto:', updateCryptoError);
      return new Response(
        JSON.stringify({ status: 'error', message: 'Erro ao atualizar saldo cripto' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Calcular a diferença de saldo para atualizar a wallet principal
    const diferencaSaldo = novoSaldoBRL - cryptoWallet.saldo_em_brl;

    if (diferencaSaldo !== 0) {
      // Buscar a wallet principal do usuário
      const { data: walletPrincipal, error: walletError } = await supabase
        .from('wallets')
        .select('saldo')
        .eq('user_id', user_id)
        .single();

      if (walletError) {
        console.error('Erro ao buscar wallet principal:', walletError);
      } else {
        // Atualizar o saldo da wallet principal
        const { error: updateWalletError } = await supabase
          .from('wallets')
          .update({
            saldo: (walletPrincipal.saldo || 0) + diferencaSaldo
          })
          .eq('user_id', user_id);

        if (updateWalletError) {
          console.error('Erro ao atualizar wallet principal:', updateWalletError);
        }
      }
    }

    console.log('Sincronização concluída com sucesso');

    return new Response(
      JSON.stringify({ 
        status: 'ok', 
        message: 'Saldo Binance sincronizado com sucesso!',
        saldo_crypto: novoSaldoCrypto,
        saldo_brl: novoSaldoBRL,
        diferenca: diferencaSaldo
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Erro na função sync-binance-saldo:', error);
    return new Response(
      JSON.stringify({ 
        status: 'error', 
        message: error.message || 'Erro interno do servidor' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

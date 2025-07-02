
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
    console.log('Função criar-subconta iniciada');

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

    // Buscar dados do usuário
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('email, nome_completo')
      .eq('id', user_id)
      .single();

    if (userError || !userData) {
      console.error('Erro ao buscar usuário:', userError);
      return new Response(
        JSON.stringify({ status: 'error', message: 'Usuário não encontrado' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Dados do usuário:', userData);

    // Verificar se já existe uma subconta cripto para este usuário
    const { data: existingCrypto } = await supabase
      .from('wallets_cripto_binance')
      .select('id')
      .eq('user_id', user_id)
      .maybeSingle();

    if (existingCrypto) {
      return new Response(
        JSON.stringify({ status: 'error', message: 'Conta cripto já existe para este usuário' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Criar registro na tabela wallets_cripto_binance
    const { data: cryptoWallet, error: cryptoError } = await supabase
      .from('wallets_cripto_binance')
      .insert({
        user_id: user_id,
        subaccount_email: userData.email,
        moeda: 'USDT',
        saldo_crypto: 0,
        saldo_em_brl: 0,
        cotacao: 5.50 // Cotação simulada USDT para BRL
      })
      .select()
      .single();

    if (cryptoError) {
      console.error('Erro ao criar wallet cripto:', cryptoError);
      return new Response(
        JSON.stringify({ status: 'error', message: 'Erro ao criar conta cripto' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Wallet cripto criada:', cryptoWallet);

    // Simular saldo inicial de 100 USDT (R$ 550,00)
    const saldoInicialUSDT = 100;
    const saldoInicialBRL = saldoInicialUSDT * 5.50;

    // Atualizar o saldo na wallet cripto
    await supabase
      .from('wallets_cripto_binance')
      .update({
        saldo_crypto: saldoInicialUSDT,
        saldo_em_brl: saldoInicialBRL
      })
      .eq('id', cryptoWallet.id);

    // Atualizar o saldo na wallet principal do usuário
    const { error: walletUpdateError } = await supabase
      .from('wallets')
      .update({
        saldo: supabase.rpc('coalesce', { value: 0 }) + saldoInicialBRL
      })
      .eq('user_id', user_id);

    if (walletUpdateError) {
      console.error('Erro ao atualizar wallet principal:', walletUpdateError);
      // Não falhar aqui, pois a conta cripto foi criada com sucesso
    }

    // Buscar o saldo atualizado
    const { data: updatedWallet } = await supabase
      .from('wallets')
      .select('saldo')
      .eq('user_id', user_id)
      .single();

    console.log('Saldo atualizado:', updatedWallet?.saldo);

    return new Response(
      JSON.stringify({ 
        status: 'ok', 
        message: 'Conta cripto ativada com sucesso!',
        saldo_adicionado: saldoInicialBRL,
        saldo_total: updatedWallet?.saldo || 0
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Erro na função criar-subconta:', error);
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

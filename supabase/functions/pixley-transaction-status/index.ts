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
    const pixleyApiKey = Deno.env.get('PIXLEY_API_KEY')!;
    const pixleySecretKey = Deno.env.get('PIXLEY_SECRET_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from JWT token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ status: 'error', message: 'Token de autorização necessário' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return new Response(
        JSON.stringify({ status: 'error', message: 'Token inválido' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const url = new URL(req.url);
    const transactionId = url.pathname.split('/').pop();

    if (!transactionId) {
      return new Response(
        JSON.stringify({ status: 'error', message: 'ID da transação é obrigatório' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get transaction from our database first to verify ownership
    const { data: localTransaction, error: localError } = await supabase
      .from('pixley_transactions')
      .select('*')
      .eq('transaction_id', transactionId)
      .eq('user_id', user.id)
      .single();

    if (localError || !localTransaction) {
      return new Response(
        JSON.stringify({ status: 'error', message: 'Transação não encontrada' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Call Pixley API to get updated status
    const pixleyUrl = `https://crypto.sandbox.pixley.app/api/trade/on-ramp/${transactionId}`;
    
    const pixleyResponse = await fetch(pixleyUrl, {
      method: 'GET',
      headers: {
        'x-api-key': pixleyApiKey,
        'x-secret-key': pixleySecretKey,
      }
    });

    if (!pixleyResponse.ok) {
      const errorData = await pixleyResponse.text();
      console.error('Pixley API error:', errorData);
      return new Response(
        JSON.stringify({ 
          status: 'error', 
          message: 'Erro ao consultar status na API Pixley',
          details: errorData
        }),
        { status: pixleyResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const pixleyData = await pixleyResponse.json();
    console.log('Pixley status response:', pixleyData);

    // Update local transaction if status changed
    if (pixleyData.status !== localTransaction.status) {
      const { error: updateError } = await supabase
        .from('pixley_transactions')
        .update({
          status: pixleyData.status,
          tx_hash: pixleyData.tx_hash || localTransaction.tx_hash,
          explorer_url: pixleyData.explorer_url || localTransaction.explorer_url,
          metadata: {
            ...localTransaction.metadata,
            last_pixley_check: new Date().toISOString(),
            pixley_status_response: pixleyData
          }
        })
        .eq('id', localTransaction.id);

      if (updateError) {
        console.error('Database update error:', updateError);
      }
    }

    return new Response(
      JSON.stringify({
        status: 'success',
        data: {
          id: pixleyData.id,
          status: pixleyData.status,
          qr_code: pixleyData.qr_code,
          pix_status: pixleyData.pix_status,
          source_amount: pixleyData.source_amount,
          target_amount: pixleyData.target_amount,
          wallet_address: pixleyData.wallet_address,
          network: pixleyData.network,
          tx_hash: pixleyData.tx_hash,
          explorer_url: pixleyData.explorer_url,
          fees: pixleyData.fees,
          net_amount: pixleyData.net_amount,
          created_at: pixleyData.created_at,
          updated_at: pixleyData.updated_at
        }
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erro ao consultar status da transação:', error);
    return new Response(
      JSON.stringify({ 
        status: 'error', 
        message: error.message || 'Erro interno do servidor' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
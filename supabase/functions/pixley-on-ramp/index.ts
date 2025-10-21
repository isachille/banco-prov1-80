import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Validation schema for on-ramp requests
const OnRampSchema = z.object({
  source_currency: z.enum(['BRL', 'USD'], { errorMap: () => ({ message: 'Moeda de origem deve ser BRL ou USD' }) }),
  source_amount: z.number().positive('Valor deve ser positivo').min(10, 'Valor mínimo: 10').max(100000, 'Valor máximo: 100.000'),
  target_currency: z.enum(['BTC', 'ETH', 'USDT', 'USDC'], { errorMap: () => ({ message: 'Criptomoeda inválida' }) }),
  wallet_address: z.string().min(26, 'Endereço de carteira inválido').max(62, 'Endereço de carteira muito longo'),
  network: z.enum(['ethereum', 'bitcoin', 'polygon', 'bsc'], { errorMap: () => ({ message: 'Rede blockchain inválida' }) }),
  simulation: z.boolean().optional()
})

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

    // Parse and validate request body
    const requestData = await req.json();
    const validationResult = OnRampSchema.safeParse(requestData);
    
    if (!validationResult.success) {
      console.error('Validation error:', validationResult.error.format());
      return new Response(
        JSON.stringify({ 
          status: 'error', 
          message: 'Dados inválidos',
          errors: validationResult.error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { 
      source_currency, 
      source_amount, 
      target_currency, 
      wallet_address, 
      network,
      simulation = false
    } = validationResult.data;

    // Generate unique external ID for idempotency
    const externalId = `${user.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Call Pixley API
    const pixleyUrl = `https://crypto.sandbox.pixley.app/api/trade/on-ramp${simulation ? '?simulation=true' : ''}`;
    
    const pixleyResponse = await fetch(pixleyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': pixleyApiKey,
        'x-secret-key': pixleySecretKey,
      },
      body: JSON.stringify({
        source_currency,
        source_amount,
        target_currency,
        wallet_address,
        network
      })
    });

    if (!pixleyResponse.ok) {
      const errorData = await pixleyResponse.text();
      console.error('Pixley API error:', errorData);
      return new Response(
        JSON.stringify({ 
          status: 'error', 
          message: 'Erro na API Pixley',
          details: errorData
        }),
        { status: pixleyResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const pixleyData = await pixleyResponse.json();
    console.log('Pixley response:', pixleyData);

    // Save transaction to database (if not simulation)
    if (!simulation) {
      const { error: insertError } = await supabase
        .from('pixley_transactions')
        .insert({
          user_id: user.id,
          transaction_id: pixleyData.id,
          type: 'on-ramp',
          source_currency,
          source_amount,
          target_currency,
          target_amount: pixleyData.target_amount,
          wallet_address,
          network,
          status: pixleyData.status || 'pending',
          qr_code: pixleyData.qr_code,
          external_id: externalId,
          fees: pixleyData.fees || {},
          metadata: {
            pixley_response: pixleyData,
            simulation: false
          }
        });

      if (insertError) {
        console.error('Database insert error:', insertError);
        return new Response(
          JSON.stringify({ 
            status: 'error', 
            message: 'Erro ao salvar transação no banco de dados'
          }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    return new Response(
      JSON.stringify({
        status: 'success',
        data: {
          id: pixleyData.id,
          transaction_id: pixleyData.id,
          status: pixleyData.status,
          qr_code: pixleyData.qr_code,
          source_amount: pixleyData.source_amount,
          target_amount: pixleyData.target_amount,
          wallet_address: pixleyData.wallet_address,
          network: pixleyData.network,
          created_at: pixleyData.created_at,
          external_id: externalId,
          simulation
        }
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erro ao processar on-ramp:', error);
    return new Response(
      JSON.stringify({ 
        status: 'error', 
        message: error.message || 'Erro interno do servidor' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
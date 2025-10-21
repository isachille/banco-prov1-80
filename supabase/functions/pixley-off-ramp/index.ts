import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// PIX key validation schemas
const PixKeySchemas = {
  cpf: z.string().regex(/^\d{11}$/, 'CPF deve conter 11 dígitos'),
  cnpj: z.string().regex(/^\d{14}$/, 'CNPJ deve conter 14 dígitos'),
  email: z.string().email('Email inválido').max(77, 'Email muito longo'),
  phone: z.string().regex(/^\+55\d{10,11}$/, 'Telefone deve estar no formato +55XXXXXXXXXXX'),
  random: z.string().uuid('Chave aleatória inválida')
};

// Validation schema for off-ramp requests
const OffRampSchema = z.object({
  source_currency: z.enum(['BTC', 'ETH', 'USDT', 'USDC'], { errorMap: () => ({ message: 'Criptomoeda inválida' }) }),
  source_amount: z.number().positive('Valor deve ser positivo').min(0.001, 'Valor mínimo: 0.001').max(1000000, 'Valor máximo: 1.000.000'),
  target_currency: z.literal('PIX', { errorMap: () => ({ message: 'Moeda de destino deve ser PIX' }) }),
  pix_key: z.string().min(1, 'Chave PIX é obrigatória').max(140, 'Chave PIX muito longa'),
  pix_key_type: z.enum(['cpf', 'cnpj', 'email', 'phone', 'random'], { errorMap: () => ({ message: 'Tipo de chave PIX inválido' }) }),
  recipient_name: z.string().trim().min(3, 'Nome deve ter no mínimo 3 caracteres').max(100, 'Nome muito longo'),
  recipient_document: z.string().regex(/^\d{11}$|^\d{14}$/, 'Documento deve ser CPF (11 dígitos) ou CNPJ (14 dígitos)'),
  network: z.enum(['ethereum', 'bitcoin', 'polygon', 'bsc'], { errorMap: () => ({ message: 'Rede blockchain inválida' }) }),
  simulation: z.boolean().optional()
}).refine(
  (data) => {
    const keyType = data.pix_key_type as keyof typeof PixKeySchemas;
    return PixKeySchemas[keyType].safeParse(data.pix_key).success;
  },
  { message: 'Chave PIX inválida para o tipo especificado', path: ['pix_key'] }
)

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
    const validationResult = OffRampSchema.safeParse({
      ...requestData,
      target_currency: requestData.target_currency || 'PIX'
    });
    
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
      pix_key,
      pix_key_type,
      recipient_name,
      recipient_document,
      network,
      simulation = false
    } = validationResult.data;

    // Generate unique external ID for idempotency
    const externalId = `${user.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Call Pixley API
    const pixleyUrl = `https://crypto.sandbox.pixley.app/api/trade/off-ramp${simulation ? '?simulation=true' : ''}`;
    
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
        pix_key,
        pix_key_type,
        recipient_name,
        recipient_document,
        network,
        externalId
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
    console.log('Pixley off-ramp response:', pixleyData);

    // Save transaction to database (if not simulation)
    if (!simulation) {
      const { error: insertError } = await supabase
        .from('pixley_transactions')
        .insert({
          user_id: user.id,
          transaction_id: pixleyData.withdrawal_id,
          type: 'off-ramp',
          source_currency,
          source_amount,
          target_currency,
          target_amount: pixleyData.estimated_amount_received,
          pix_key,
          pix_key_type,
          recipient_name,
          recipient_document,
          network,
          status: pixleyData.status || 'pending',
          external_id: externalId,
          metadata: {
            pixley_response: pixleyData,
            simulation: false,
            estimated_completion: pixleyData.estimated_completion
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
          withdrawal_id: pixleyData.withdrawal_id,
          status: pixleyData.status,
          estimated_amount_received: pixleyData.estimated_amount_received,
          estimated_completion: pixleyData.estimated_completion,
          message: pixleyData.message,
          external_id: externalId,
          simulation
        }
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erro ao processar off-ramp:', error);
    return new Response(
      JSON.stringify({ 
        status: 'error', 
        message: error.message || 'Erro interno do servidor' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
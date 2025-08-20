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

    // Call Pixley API to get user limits
    const pixleyUrl = 'https://crypto.sandbox.pixley.app/api/users/me/limits';
    
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
          message: 'Erro ao consultar limites na API Pixley',
          details: errorData
        }),
        { status: pixleyResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const pixleyData = await pixleyResponse.json();
    console.log('Pixley limits response:', pixleyData);

    return new Response(
      JSON.stringify({
        status: 'success',
        data: {
          dailyLimits: pixleyData.dailyLimits,
          monthlyLimits: pixleyData.monthlyLimits,
          dailyUsage: pixleyData.dailyUsage,
          monthlyUsage: pixleyData.monthlyUsage,
          remainingLimits: pixleyData.remainingLimits
        }
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erro ao consultar limites do usuário:', error);
    return new Response(
      JSON.stringify({ 
        status: 'error', 
        message: error.message || 'Erro interno do servidor' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from JWT token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Authorization header required' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get SumUp API key
    const sumupApiKey = Deno.env.get('SUMUP_API_KEY');
    if (!sumupApiKey) {
      return new Response(JSON.stringify({ error: 'SumUp API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Parse URL to get the path
    const url = new URL(req.url);
    const pathSegments = url.pathname.split('/').filter(Boolean);
    const operation = pathSegments[pathSegments.length - 1]; // Last segment after /sumup

    console.log(`SumUp API operation: ${operation}`);

    // Handle different operations
    switch (operation) {
      case 'customers':
        if (req.method === 'POST') {
          return await handleCreateCustomer(req, user.id, sumupApiKey, supabase);
        }
        break;

      case 'checkouts':
        if (req.method === 'POST') {
          return await handleCreateCheckout(req, user.id, sumupApiKey, supabase);
        }
        break;

      case 'transactions':
        if (req.method === 'GET') {
          return await handleListTransactions(req, sumupApiKey);
        }
        break;

      case 'refunds':
        if (req.method === 'POST') {
          return await handleCreateRefund(req, user.id, sumupApiKey, supabase);
        }
        break;

      default:
        return new Response(JSON.stringify({ error: `Operation ${operation} not supported` }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

  } catch (error) {
    console.error('Error in SumUp function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function handleCreateCustomer(req: Request, userId: string, apiKey: string, supabase: any) {
  try {
    const body = await req.json();
    
    // Create customer in SumUp
    const response = await fetch('https://api.sumup.com/v0.1/customers', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customer_id: body.customer_id || `user_${userId}`,
        personal_details: body.personal_details
      }),
    });

    const sumupResponse = await response.json();
    
    if (!response.ok) {
      console.error('SumUp API error:', sumupResponse);
      return new Response(JSON.stringify({ error: sumupResponse }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Save to database
    const { error: dbError } = await supabase
      .from('sumup_customers')
      .insert({
        id: sumupResponse.id,
        user_id: userId,
        first_name: body.personal_details?.first_name,
        last_name: body.personal_details?.last_name,
        email: body.personal_details?.email,
        raw: sumupResponse
      });

    if (dbError) {
      console.error('Database error:', dbError);
    }

    return new Response(JSON.stringify(sumupResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error creating customer:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function handleCreateCheckout(req: Request, userId: string, apiKey: string, supabase: any) {
  try {
    const body = await req.json();
    
    // Create checkout in SumUp
    const response = await fetch('https://api.sumup.com/v0.1/checkouts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        checkout_reference: body.checkout_reference || crypto.randomUUID(),
        amount: body.amount,
        currency: body.currency || 'BRL',
        description: body.description,
        customer_id: body.customer_id
      }),
    });

    const sumupResponse = await response.json();
    
    if (!response.ok) {
      console.error('SumUp API error:', sumupResponse);
      return new Response(JSON.stringify({ error: sumupResponse }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Save to database
    const { error: dbError } = await supabase
      .from('sumup_checkouts')
      .insert({
        id: sumupResponse.id,
        user_id: userId,
        checkout_reference: sumupResponse.checkout_reference,
        amount: sumupResponse.amount,
        currency: sumupResponse.currency,
        description: sumupResponse.description,
        status: sumupResponse.status,
        raw: sumupResponse
      });

    if (dbError) {
      console.error('Database error:', dbError);
    }

    return new Response(JSON.stringify(sumupResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error creating checkout:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function handleListTransactions(req: Request, apiKey: string) {
  try {
    const url = new URL(req.url);
    const limit = url.searchParams.get('limit') || '20';
    const from = url.searchParams.get('from');
    const to = url.searchParams.get('to');

    let apiUrl = `https://api.sumup.com/v0.1/me/transactions?limit=${limit}`;
    if (from) apiUrl += `&from=${from}`;
    if (to) apiUrl += `&to=${to}`;

    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    const sumupResponse = await response.json();
    
    if (!response.ok) {
      console.error('SumUp API error:', sumupResponse);
      return new Response(JSON.stringify({ error: sumupResponse }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(sumupResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error listing transactions:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function handleCreateRefund(req: Request, userId: string, apiKey: string, supabase: any) {
  try {
    const body = await req.json();
    
    // Create refund in SumUp
    const response = await fetch('https://api.sumup.com/v0.1/me/refunds', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transaction_id: body.transaction_id,
        amount: body.amount,
        currency: body.currency || 'BRL'
      }),
    });

    const sumupResponse = await response.json();
    
    if (!response.ok) {
      console.error('SumUp API error:', sumupResponse);
      return new Response(JSON.stringify({ error: sumupResponse }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Save to database
    const { error: dbError } = await supabase
      .from('sumup_refunds')
      .insert({
        id: sumupResponse.id,
        user_id: userId,
        transaction_id: body.transaction_id,
        amount: body.amount,
        currency: body.currency || 'BRL',
        status: sumupResponse.status,
        raw: sumupResponse
      });

    if (dbError) {
      console.error('Database error:', dbError);
    }

    return new Response(JSON.stringify(sumupResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error creating refund:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SUMUP_API_BASE_URL = 'https://api.sumup.com/v0.1';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const sumupApiKey = Deno.env.get('SUMUP_API_KEY');
    if (!sumupApiKey) {
      throw new Error('SUMUP_API_KEY is not configured');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from Authorization header
    const authorization = req.headers.get('Authorization');
    if (!authorization) {
      return new Response(JSON.stringify({ error: 'Authorization header required' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const token = authorization.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid authentication' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const url = new URL(req.url);
    const path = url.pathname.replace('/sumup', '');
    const method = req.method;

    console.log(`SumUp API call: ${method} ${path}`);

    // Route handling
    let response;
    switch (path) {
      case '/customers':
        if (method === 'POST') {
          response = await handleCreateCustomer(req, user.id, sumupApiKey, supabase);
        } else {
          throw new Error('Method not allowed for /customers');
        }
        break;

      case '/checkouts':
        if (method === 'POST') {
          response = await handleCreateCheckout(req, user.id, sumupApiKey, supabase);
        } else {
          throw new Error('Method not allowed for /checkouts');
        }
        break;

      case '/me/transactions':
        if (method === 'GET') {
          response = await handleListTransactions(req, sumupApiKey);
        } else {
          throw new Error('Method not allowed for /me/transactions');
        }
        break;

      case '/me/refunds':
        if (method === 'POST') {
          response = await handleCreateRefund(req, user.id, sumupApiKey, supabase);
        } else {
          throw new Error('Method not allowed for /me/refunds');
        }
        break;

      default:
        throw new Error(`Unknown endpoint: ${path}`);
    }

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in sumup function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function handleCreateCustomer(req: Request, userId: string, apiKey: string, supabase: any) {
  const body = await req.json();
  
  // Call SumUp API to create customer
  const sumupResponse = await fetch(`${SUMUP_API_BASE_URL}/customers`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      customer_id: `user_${userId}`,
      personal_details: {
        first_name: body.personal_details?.first_name,
        last_name: body.personal_details?.last_name,
        email: body.personal_details?.email,
      }
    }),
  });

  if (!sumupResponse.ok) {
    const errorText = await sumupResponse.text();
    console.error('SumUp API error:', errorText);
    throw new Error(`SumUp API error: ${sumupResponse.status} ${errorText}`);
  }

  const sumupData = await sumupResponse.json();

  // Save to database
  const { error: dbError } = await supabase
    .from('sumup_customers')
    .insert({
      id: sumupData.id,
      user_id: userId,
      first_name: body.personal_details?.first_name,
      last_name: body.personal_details?.last_name,
      email: body.personal_details?.email,
      raw: sumupData,
    });

  if (dbError) {
    console.error('Database error:', dbError);
    throw new Error('Failed to save customer to database');
  }

  return sumupData;
}

async function handleCreateCheckout(req: Request, userId: string, apiKey: string, supabase: any) {
  const body = await req.json();
  
  // Call SumUp API to create checkout
  const sumupResponse = await fetch(`${SUMUP_API_BASE_URL}/checkouts`, {
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
      customer_id: body.customer_id,
    }),
  });

  if (!sumupResponse.ok) {
    const errorText = await sumupResponse.text();
    console.error('SumUp API error:', errorText);
    throw new Error(`SumUp API error: ${sumupResponse.status} ${errorText}`);
  }

  const sumupData = await sumupResponse.json();

  // Save to database
  const { error: dbError } = await supabase
    .from('sumup_checkouts')
    .insert({
      id: sumupData.id,
      user_id: userId,
      checkout_reference: sumupData.checkout_reference,
      amount: sumupData.amount,
      currency: sumupData.currency,
      description: sumupData.description,
      status: sumupData.status,
      raw: sumupData,
    });

  if (dbError) {
    console.error('Database error:', dbError);
    throw new Error('Failed to save checkout to database');
  }

  return sumupData;
}

async function handleListTransactions(req: Request, apiKey: string) {
  const url = new URL(req.url);
  const searchParams = new URLSearchParams();
  
  // Forward query parameters
  const limit = url.searchParams.get('limit');
  const from = url.searchParams.get('from');
  const to = url.searchParams.get('to');
  
  if (limit) searchParams.set('limit', limit);
  if (from) searchParams.set('from', from);
  if (to) searchParams.set('to', to);

  const sumupResponse = await fetch(`${SUMUP_API_BASE_URL}/me/transactions?${searchParams}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  });

  if (!sumupResponse.ok) {
    const errorText = await sumupResponse.text();
    console.error('SumUp API error:', errorText);
    throw new Error(`SumUp API error: ${sumupResponse.status} ${errorText}`);
  }

  const sumupData = await sumupResponse.json();
  return sumupData.items || sumupData;
}

async function handleCreateRefund(req: Request, userId: string, apiKey: string, supabase: any) {
  const body = await req.json();
  
  // Call SumUp API to create refund
  const sumupResponse = await fetch(`${SUMUP_API_BASE_URL}/me/refunds`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      transaction_id: body.transaction_id,
      amount: body.amount,
      currency: body.currency || 'BRL',
    }),
  });

  if (!sumupResponse.ok) {
    const errorText = await sumupResponse.text();
    console.error('SumUp API error:', errorText);
    throw new Error(`SumUp API error: ${sumupResponse.status} ${errorText}`);
  }

  const sumupData = await sumupResponse.json();

  // Save to database
  const { error: dbError } = await supabase
    .from('sumup_refunds')
    .insert({
      id: sumupData.id,
      user_id: userId,
      transaction_id: body.transaction_id,
      amount: body.amount,
      currency: body.currency || 'BRL',
      status: sumupData.status,
      raw: sumupData,
    });

  if (dbError) {
    console.error('Database error:', dbError);
    throw new Error('Failed to save refund to database');
  }

  return sumupData;
}
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const HIPERBANCO_BASE_URL = 'https://api.sandbox.hiperbanco.com.br/v1'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const hiperbancoApiKey = Deno.env.get('HIPERBANCO_API_KEY')
    const hiperbancoSecret = Deno.env.get('HIPERBANCO_SECRET')
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Validate HiperBanco credentials
    if (!hiperbancoApiKey || !hiperbancoSecret) {
      console.error('HiperBanco credentials not configured')
      return new Response(
        JSON.stringify({ error: 'Configuração do HiperBanco pendente' }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Authenticate user via JWT
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Token de autorização necessário' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Token inválido' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const url = new URL(req.url)
    const action = url.searchParams.get('action') || 'status'
    const body = req.method === 'POST' ? await req.json() : null

    console.log(`HiperBanco TED - Action: ${action}, User: ${user.id}`)

    // Create Basic Auth header for HiperBanco
    const hiperbancoAuth = btoa(`${hiperbancoApiKey}:${hiperbancoSecret}`)

    // Get user's HiperBanco account
    const { data: userData } = await supabase
      .from('users')
      .select('hiperbanco_account_id')
      .eq('id', user.id)
      .single()

    if (!userData?.hiperbanco_account_id && action !== 'status' && action !== 'listar-bancos') {
      return new Response(
        JSON.stringify({ error: 'Conta HiperBanco não vinculada. Crie uma conta primeiro.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const accountId = userData?.hiperbanco_account_id

    switch (action) {
      case 'enviar': {
        // Send TED transfer
        const { 
          banco_codigo, agencia, conta, tipo_conta,
          documento, nome_destinatario, valor, descricao 
        } = body

        if (!banco_codigo || !agencia || !conta || !documento || !nome_destinatario || !valor) {
          return new Response(
            JSON.stringify({ 
              error: 'Dados obrigatórios: banco_codigo, agencia, conta, documento, nome_destinatario, valor' 
            }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        if (valor <= 0) {
          return new Response(
            JSON.stringify({ error: 'Valor deve ser maior que zero' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        const tedPayload = {
          destinatario: {
            banco: banco_codigo,
            agencia: agencia.replace(/\D/g, ''),
            conta: conta.replace(/\D/g, ''),
            tipo_conta: tipo_conta || 'corrente',
            documento: documento.replace(/\D/g, ''),
            nome: nome_destinatario
          },
          valor: parseFloat(valor),
          descricao: descricao || 'Transferência TED'
        }

        const response = await fetch(`${HIPERBANCO_BASE_URL}/contas/${accountId}/ted`, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${hiperbancoAuth}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(tedPayload)
        })

        const result = await response.json()
        console.log('HiperBanco TED enviar response:', JSON.stringify(result))

        if (!response.ok) {
          return new Response(
            JSON.stringify({ error: result.message || 'Erro ao enviar TED', details: result }),
            { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Record transaction in database
        await supabase.from('transacoes').insert({
          user_id: user.id,
          tipo: 'ted_enviado',
          valor: -valor,
          descricao: `TED para ${nome_destinatario} - ${banco_codigo}`,
          status: result.status || 'processando'
        })

        return new Response(
          JSON.stringify({ success: true, transacao: result }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'listar-bancos': {
        // List available banks for TED
        const response = await fetch(`${HIPERBANCO_BASE_URL}/bancos`, {
          method: 'GET',
          headers: {
            'Authorization': `Basic ${hiperbancoAuth}`,
            'Content-Type': 'application/json'
          }
        })

        const result = await response.json()

        if (!response.ok) {
          return new Response(
            JSON.stringify({ error: result.message || 'Erro ao listar bancos' }),
            { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        return new Response(
          JSON.stringify({ success: true, bancos: result }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'consultar': {
        // Get TED transaction status
        const transacaoId = url.searchParams.get('transacao_id')

        if (!transacaoId) {
          return new Response(
            JSON.stringify({ error: 'ID da transação é obrigatório' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        const response = await fetch(`${HIPERBANCO_BASE_URL}/contas/${accountId}/ted/${transacaoId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Basic ${hiperbancoAuth}`,
            'Content-Type': 'application/json'
          }
        })

        const result = await response.json()

        if (!response.ok) {
          return new Response(
            JSON.stringify({ error: result.message || 'Transação não encontrada' }),
            { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        return new Response(
          JSON.stringify({ success: true, transacao: result }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'historico': {
        // TED transaction history
        const dataInicio = url.searchParams.get('data_inicio') || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        const dataFim = url.searchParams.get('data_fim') || new Date().toISOString().split('T')[0]

        const response = await fetch(
          `${HIPERBANCO_BASE_URL}/contas/${accountId}/ted?data_inicio=${dataInicio}&data_fim=${dataFim}`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Basic ${hiperbancoAuth}`,
              'Content-Type': 'application/json'
            }
          }
        )

        const result = await response.json()

        if (!response.ok) {
          return new Response(
            JSON.stringify({ error: result.message || 'Erro ao consultar histórico TED' }),
            { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        return new Response(
          JSON.stringify({ success: true, transacoes: result }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'favoritos': {
        // List saved transfer recipients
        const response = await fetch(`${HIPERBANCO_BASE_URL}/contas/${accountId}/favoritos`, {
          method: 'GET',
          headers: {
            'Authorization': `Basic ${hiperbancoAuth}`,
            'Content-Type': 'application/json'
          }
        })

        const result = await response.json()

        if (!response.ok) {
          return new Response(
            JSON.stringify({ error: result.message || 'Erro ao listar favoritos' }),
            { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        return new Response(
          JSON.stringify({ success: true, favoritos: result }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'salvar-favorito': {
        // Save a transfer recipient as favorite
        const { 
          banco_codigo, agencia, conta, tipo_conta,
          documento, nome_destinatario, apelido 
        } = body

        if (!banco_codigo || !agencia || !conta || !documento || !nome_destinatario) {
          return new Response(
            JSON.stringify({ 
              error: 'Dados obrigatórios: banco_codigo, agencia, conta, documento, nome_destinatario' 
            }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        const favoritoPayload = {
          banco: banco_codigo,
          agencia: agencia.replace(/\D/g, ''),
          conta: conta.replace(/\D/g, ''),
          tipo_conta: tipo_conta || 'corrente',
          documento: documento.replace(/\D/g, ''),
          nome: nome_destinatario,
          apelido: apelido || nome_destinatario
        }

        const response = await fetch(`${HIPERBANCO_BASE_URL}/contas/${accountId}/favoritos`, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${hiperbancoAuth}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(favoritoPayload)
        })

        const result = await response.json()

        if (!response.ok) {
          return new Response(
            JSON.stringify({ error: result.message || 'Erro ao salvar favorito' }),
            { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        return new Response(
          JSON.stringify({ success: true, favorito: result }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'status':
      default: {
        return new Response(
          JSON.stringify({ 
            success: true, 
            status: 'connected',
            message: 'HiperBanco TED API configurada',
            conta_vinculada: !!accountId
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

  } catch (error) {
    console.error('HiperBanco TED error:', error)
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

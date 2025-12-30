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

    console.log(`HiperBanco PIX - Action: ${action}, User: ${user.id}`)

    // Create Basic Auth header for HiperBanco
    const hiperbancoAuth = btoa(`${hiperbancoApiKey}:${hiperbancoSecret}`)

    // Get user's HiperBanco account
    const { data: userData } = await supabase
      .from('users')
      .select('hiperbanco_account_id')
      .eq('id', user.id)
      .single()

    if (!userData?.hiperbanco_account_id && action !== 'status') {
      return new Response(
        JSON.stringify({ error: 'Conta HiperBanco não vinculada. Crie uma conta primeiro.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const accountId = userData?.hiperbanco_account_id

    switch (action) {
      case 'enviar': {
        // Send PIX transfer
        const { chave_pix, tipo_chave, valor, descricao } = body

        if (!chave_pix || !valor) {
          return new Response(
            JSON.stringify({ error: 'Dados obrigatórios: chave_pix, valor' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        if (valor <= 0) {
          return new Response(
            JSON.stringify({ error: 'Valor deve ser maior que zero' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        const pixPayload = {
          chave: chave_pix,
          tipo_chave: tipo_chave || detectKeyType(chave_pix),
          valor: parseFloat(valor),
          descricao: descricao || 'Transferência PIX'
        }

        const response = await fetch(`${HIPERBANCO_BASE_URL}/contas/${accountId}/pix/transferir`, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${hiperbancoAuth}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(pixPayload)
        })

        const result = await response.json()
        console.log('HiperBanco PIX enviar response:', JSON.stringify(result))

        if (!response.ok) {
          return new Response(
            JSON.stringify({ error: result.message || 'Erro ao enviar PIX', details: result }),
            { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Record transaction in database
        await supabase.from('transacoes').insert({
          user_id: user.id,
          tipo: 'pix_enviado',
          valor: -valor,
          descricao: `PIX para ${chave_pix}`,
          status: result.status || 'processando'
        })

        return new Response(
          JSON.stringify({ success: true, transacao: result }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'gerar-qrcode': {
        // Generate QR Code for receiving PIX
        const { valor, descricao } = body

        const qrPayload = {
          valor: valor ? parseFloat(valor) : null,
          descricao: descricao || 'Pagamento via PIX'
        }

        const response = await fetch(`${HIPERBANCO_BASE_URL}/contas/${accountId}/pix/qrcode`, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${hiperbancoAuth}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(qrPayload)
        })

        const result = await response.json()
        console.log('HiperBanco PIX qrcode response:', JSON.stringify(result))

        if (!response.ok) {
          return new Response(
            JSON.stringify({ error: result.message || 'Erro ao gerar QR Code' }),
            { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        return new Response(
          JSON.stringify({ success: true, qrcode: result }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'consultar-chave': {
        // Lookup PIX key info before transfer
        const chave = url.searchParams.get('chave') || body?.chave

        if (!chave) {
          return new Response(
            JSON.stringify({ error: 'Chave PIX é obrigatória' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        const response = await fetch(`${HIPERBANCO_BASE_URL}/pix/chaves/${encodeURIComponent(chave)}`, {
          method: 'GET',
          headers: {
            'Authorization': `Basic ${hiperbancoAuth}`,
            'Content-Type': 'application/json'
          }
        })

        const result = await response.json()

        if (!response.ok) {
          return new Response(
            JSON.stringify({ error: result.message || 'Chave não encontrada' }),
            { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        return new Response(
          JSON.stringify({ success: true, destinatario: result }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'cadastrar-chave': {
        // Register a new PIX key for the account
        const { tipo_chave, valor_chave } = body

        if (!tipo_chave) {
          return new Response(
            JSON.stringify({ error: 'Tipo de chave é obrigatório (cpf, cnpj, email, telefone, aleatoria)' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        const keyPayload = {
          tipo: tipo_chave,
          valor: valor_chave // null for random key
        }

        const response = await fetch(`${HIPERBANCO_BASE_URL}/contas/${accountId}/pix/chaves`, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${hiperbancoAuth}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(keyPayload)
        })

        const result = await response.json()
        console.log('HiperBanco cadastrar-chave response:', JSON.stringify(result))

        if (!response.ok) {
          return new Response(
            JSON.stringify({ error: result.message || 'Erro ao cadastrar chave PIX' }),
            { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        return new Response(
          JSON.stringify({ success: true, chave: result }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'listar-chaves': {
        // List all PIX keys for the account
        const response = await fetch(`${HIPERBANCO_BASE_URL}/contas/${accountId}/pix/chaves`, {
          method: 'GET',
          headers: {
            'Authorization': `Basic ${hiperbancoAuth}`,
            'Content-Type': 'application/json'
          }
        })

        const result = await response.json()

        if (!response.ok) {
          return new Response(
            JSON.stringify({ error: result.message || 'Erro ao listar chaves' }),
            { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        return new Response(
          JSON.stringify({ success: true, chaves: result }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'historico': {
        // PIX transaction history
        const dataInicio = url.searchParams.get('data_inicio') || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        const dataFim = url.searchParams.get('data_fim') || new Date().toISOString().split('T')[0]

        const response = await fetch(
          `${HIPERBANCO_BASE_URL}/contas/${accountId}/pix/transacoes?data_inicio=${dataInicio}&data_fim=${dataFim}`,
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
            JSON.stringify({ error: result.message || 'Erro ao consultar histórico PIX' }),
            { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        return new Response(
          JSON.stringify({ success: true, transacoes: result }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'status':
      default: {
        return new Response(
          JSON.stringify({ 
            success: true, 
            status: 'connected',
            message: 'HiperBanco PIX API configurada',
            conta_vinculada: !!accountId
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

  } catch (error) {
    console.error('HiperBanco PIX error:', error)
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

// Helper function to detect PIX key type
function detectKeyType(key: string): string {
  const cleanKey = key.replace(/\D/g, '')
  
  if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(key)) {
    return 'email'
  }
  if (cleanKey.length === 11 && /^\d+$/.test(cleanKey)) {
    // Could be CPF or phone
    if (/^[1-9]{2}9/.test(cleanKey)) {
      return 'telefone'
    }
    return 'cpf'
  }
  if (cleanKey.length === 14) {
    return 'cnpj'
  }
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(key)) {
    return 'aleatoria'
  }
  return 'aleatoria'
}

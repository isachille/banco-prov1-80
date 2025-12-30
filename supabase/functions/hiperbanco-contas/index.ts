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

    console.log(`HiperBanco Contas - Action: ${action}, User: ${user.id}`)

    // Create Basic Auth header for HiperBanco
    const hiperbancoAuth = btoa(`${hiperbancoApiKey}:${hiperbancoSecret}`)

    switch (action) {
      case 'criar-conta-pf': {
        // Create individual account (Pessoa Física)
        const { 
          nome_completo, cpf, data_nascimento, email, telefone,
          endereco, numero, complemento, bairro, cidade, estado, cep,
          nome_mae, rg
        } = body

        if (!nome_completo || !cpf || !data_nascimento || !email) {
          return new Response(
            JSON.stringify({ error: 'Dados obrigatórios: nome_completo, cpf, data_nascimento, email' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        const accountPayload = {
          tipo: 'PF',
          nome: nome_completo,
          documento: cpf.replace(/\D/g, ''),
          data_nascimento,
          email,
          telefone: telefone?.replace(/\D/g, ''),
          endereco: {
            logradouro: endereco,
            numero,
            complemento,
            bairro,
            cidade,
            estado,
            cep: cep?.replace(/\D/g, '')
          },
          dados_adicionais: {
            nome_mae,
            rg
          }
        }

        const response = await fetch(`${HIPERBANCO_BASE_URL}/contas`, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${hiperbancoAuth}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(accountPayload)
        })

        const result = await response.json()
        console.log('HiperBanco criar-conta-pf response:', JSON.stringify(result))

        if (!response.ok) {
          return new Response(
            JSON.stringify({ error: result.message || 'Erro ao criar conta', details: result }),
            { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Save account reference in database
        await supabase.from('users').update({
          hiperbanco_account_id: result.id,
          hiperbanco_status: result.status
        }).eq('id', user.id)

        return new Response(
          JSON.stringify({ success: true, conta: result }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'criar-conta-pj': {
        // Create business account (Pessoa Jurídica)
        const { 
          razao_social, cnpj, email, telefone,
          endereco, numero, complemento, bairro, cidade, estado, cep,
          representante_nome, representante_cpf, representante_nascimento
        } = body

        if (!razao_social || !cnpj || !email || !representante_cpf) {
          return new Response(
            JSON.stringify({ error: 'Dados obrigatórios: razao_social, cnpj, email, representante_cpf' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        const accountPayload = {
          tipo: 'PJ',
          razao_social,
          documento: cnpj.replace(/\D/g, ''),
          email,
          telefone: telefone?.replace(/\D/g, ''),
          endereco: {
            logradouro: endereco,
            numero,
            complemento,
            bairro,
            cidade,
            estado,
            cep: cep?.replace(/\D/g, '')
          },
          representante: {
            nome: representante_nome,
            cpf: representante_cpf.replace(/\D/g, ''),
            data_nascimento: representante_nascimento
          }
        }

        const response = await fetch(`${HIPERBANCO_BASE_URL}/contas`, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${hiperbancoAuth}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(accountPayload)
        })

        const result = await response.json()
        console.log('HiperBanco criar-conta-pj response:', JSON.stringify(result))

        if (!response.ok) {
          return new Response(
            JSON.stringify({ error: result.message || 'Erro ao criar conta PJ', details: result }),
            { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        return new Response(
          JSON.stringify({ success: true, conta: result }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'consultar-conta': {
        // Get account details
        const accountId = url.searchParams.get('account_id')
        
        // Get user's HiperBanco account if no ID provided
        let targetAccountId = accountId
        if (!targetAccountId) {
          const { data: userData } = await supabase
            .from('users')
            .select('hiperbanco_account_id')
            .eq('id', user.id)
            .single()
          
          targetAccountId = userData?.hiperbanco_account_id
        }

        if (!targetAccountId) {
          return new Response(
            JSON.stringify({ error: 'Conta não encontrada' }),
            { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        const response = await fetch(`${HIPERBANCO_BASE_URL}/contas/${targetAccountId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Basic ${hiperbancoAuth}`,
            'Content-Type': 'application/json'
          }
        })

        const result = await response.json()

        if (!response.ok) {
          return new Response(
            JSON.stringify({ error: result.message || 'Erro ao consultar conta' }),
            { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        return new Response(
          JSON.stringify({ success: true, conta: result }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'saldo': {
        // Get account balance
        const { data: userData } = await supabase
          .from('users')
          .select('hiperbanco_account_id')
          .eq('id', user.id)
          .single()

        if (!userData?.hiperbanco_account_id) {
          return new Response(
            JSON.stringify({ error: 'Conta HiperBanco não vinculada' }),
            { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        const response = await fetch(`${HIPERBANCO_BASE_URL}/contas/${userData.hiperbanco_account_id}/saldo`, {
          method: 'GET',
          headers: {
            'Authorization': `Basic ${hiperbancoAuth}`,
            'Content-Type': 'application/json'
          }
        })

        const result = await response.json()

        if (!response.ok) {
          return new Response(
            JSON.stringify({ error: result.message || 'Erro ao consultar saldo' }),
            { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Update local wallet with HiperBanco balance
        await supabase.from('wallets').update({
          saldo: result.disponivel || result.saldo,
          updated_at: new Date().toISOString()
        }).eq('user_id', user.id)

        return new Response(
          JSON.stringify({ success: true, saldo: result }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'extrato': {
        // Get account statement
        const { data: userData } = await supabase
          .from('users')
          .select('hiperbanco_account_id')
          .eq('id', user.id)
          .single()

        if (!userData?.hiperbanco_account_id) {
          return new Response(
            JSON.stringify({ error: 'Conta HiperBanco não vinculada' }),
            { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        const dataInicio = url.searchParams.get('data_inicio') || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        const dataFim = url.searchParams.get('data_fim') || new Date().toISOString().split('T')[0]

        const response = await fetch(
          `${HIPERBANCO_BASE_URL}/contas/${userData.hiperbanco_account_id}/extrato?data_inicio=${dataInicio}&data_fim=${dataFim}`,
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
            JSON.stringify({ error: result.message || 'Erro ao consultar extrato' }),
            { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        return new Response(
          JSON.stringify({ success: true, extrato: result }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'status':
      default: {
        // Check connection status
        return new Response(
          JSON.stringify({ 
            success: true, 
            status: 'connected',
            message: 'HiperBanco API configurada',
            ambiente: 'sandbox'
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

  } catch (error) {
    console.error('HiperBanco Contas error:', error)
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

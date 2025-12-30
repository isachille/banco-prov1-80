import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { createHmac } from 'node:crypto'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-hiperbanco-signature',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const hiperbancoSecret = Deno.env.get('HIPERBANCO_SECRET')
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get raw body for signature verification
    const rawBody = await req.text()
    const body = JSON.parse(rawBody)

    // Verify webhook signature (HMAC-SHA256)
    const signature = req.headers.get('x-hiperbanco-signature')
    
    if (hiperbancoSecret && signature) {
      const expectedSignature = createHmac('sha256', hiperbancoSecret)
        .update(rawBody)
        .digest('hex')
      
      if (signature !== expectedSignature) {
        console.error('Invalid webhook signature')
        return new Response(
          JSON.stringify({ error: 'Assinatura inválida' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    console.log('HiperBanco Webhook received:', JSON.stringify(body))

    const { evento, dados, timestamp } = body

    switch (evento) {
      case 'pix.recebido': {
        // PIX payment received
        const { conta_id, valor, chave, pagador, e2e_id } = dados

        // Find user by HiperBanco account ID
        const { data: userData } = await supabase
          .from('users')
          .select('id')
          .eq('hiperbanco_account_id', conta_id)
          .single()

        if (userData) {
          // Record incoming transaction
          await supabase.from('transacoes').insert({
            user_id: userData.id,
            tipo: 'pix_recebido',
            valor: valor,
            descricao: `PIX recebido de ${pagador?.nome || 'N/A'}`,
            status: 'concluida'
          })

          // Update wallet balance
          await supabase.rpc('atualizar_saldo', {
            p_user_id: userData.id,
            p_valor: valor
          })

          console.log(`PIX received: ${valor} for user ${userData.id}`)
        }
        break
      }

      case 'pix.enviado': {
        // PIX transfer completed
        const { conta_id, transacao_id, status } = dados

        const { data: userData } = await supabase
          .from('users')
          .select('id')
          .eq('hiperbanco_account_id', conta_id)
          .single()

        if (userData) {
          // Update transaction status
          await supabase
            .from('transacoes')
            .update({ status: status === 'sucesso' ? 'concluida' : 'falha' })
            .eq('user_id', userData.id)
            .eq('tipo', 'pix_enviado')
            .order('created_at', { ascending: false })
            .limit(1)

          console.log(`PIX sent status updated: ${status} for user ${userData.id}`)
        }
        break
      }

      case 'ted.concluida': {
        // TED transfer completed
        const { conta_id, transacao_id, status } = dados

        const { data: userData } = await supabase
          .from('users')
          .select('id')
          .eq('hiperbanco_account_id', conta_id)
          .single()

        if (userData) {
          await supabase
            .from('transacoes')
            .update({ status: status === 'sucesso' ? 'concluida' : 'falha' })
            .eq('user_id', userData.id)
            .eq('tipo', 'ted_enviado')
            .order('created_at', { ascending: false })
            .limit(1)

          console.log(`TED status updated: ${status} for user ${userData.id}`)
        }
        break
      }

      case 'conta.ativada': {
        // Account activated
        const { conta_id, status } = dados

        await supabase
          .from('users')
          .update({ hiperbanco_status: 'ativa' })
          .eq('hiperbanco_account_id', conta_id)

        console.log(`Account activated: ${conta_id}`)
        break
      }

      case 'conta.bloqueada': {
        // Account blocked
        const { conta_id, motivo } = dados

        await supabase
          .from('users')
          .update({ hiperbanco_status: 'bloqueada' })
          .eq('hiperbanco_account_id', conta_id)

        console.log(`Account blocked: ${conta_id}, reason: ${motivo}`)
        break
      }

      case 'kyc.aprovado': {
        // KYC approved
        const { conta_id } = dados

        await supabase
          .from('users')
          .update({ 
            hiperbanco_status: 'ativa',
            status: 'ativo'
          })
          .eq('hiperbanco_account_id', conta_id)

        console.log(`KYC approved for account: ${conta_id}`)
        break
      }

      case 'kyc.reprovado': {
        // KYC rejected
        const { conta_id, motivo } = dados

        await supabase
          .from('users')
          .update({ 
            hiperbanco_status: 'kyc_reprovado'
          })
          .eq('hiperbanco_account_id', conta_id)

        console.log(`KYC rejected for account: ${conta_id}, reason: ${motivo}`)
        break
      }

      default:
        console.log(`Unhandled webhook event: ${evento}`)
    }

    return new Response(
      JSON.stringify({ success: true, received: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('HiperBanco Webhook error:', error)
    return new Response(
      JSON.stringify({ error: 'Erro ao processar webhook' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

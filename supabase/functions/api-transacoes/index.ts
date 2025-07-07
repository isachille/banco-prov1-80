
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TransacaoData {
  tipo: 'pix' | 'boleto' | 'ted';
  valor: number;
  taxa_efi?: number;
  taxa_sua?: number;
  descricao?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Token de autorização não fornecido');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Usuário não autenticado');
    }

    const transacaoData: TransacaoData = await req.json();

    // Buscar subconta do usuário
    const { data: subconta, error: subcontaError } = await supabase
      .from('subcontas')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (subcontaError || !subconta) {
      throw new Error('Subconta não encontrada');
    }

    // Criar transação
    const { data: transacao, error: transacaoError } = await supabase
      .from('transacoes')
      .insert({
        subconta_id: subconta.id,
        tipo: transacaoData.tipo,
        valor: transacaoData.valor,
        taxa_efi: transacaoData.taxa_efi || 0,
        taxa_sua: transacaoData.taxa_sua || 0,
        descricao: transacaoData.descricao,
        status: 'concluida'
      })
      .select()
      .single();

    if (transacaoError) {
      throw new Error('Erro ao criar transação: ' + transacaoError.message);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Transação criada com sucesso!',
        transacao: transacao
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Erro na função api-transacoes:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Erro interno do servidor' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

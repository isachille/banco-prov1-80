
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

    // Buscar subconta do usuário
    const { data: subconta, error: subcontaError } = await supabase
      .from('subcontas')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (subcontaError || !subconta) {
      throw new Error('Subconta não encontrada');
    }

    // Buscar todas as transações
    const { data: transacoes, error: transacoesError } = await supabase
      .from('transacoes')
      .select('*')
      .eq('subconta_id', subconta.id)
      .order('criada_em', { ascending: false });

    if (transacoesError) {
      throw new Error('Erro ao buscar transações');
    }

    // Calcular métricas
    const totalTransacoes = transacoes?.length || 0;
    const valorTotal = transacoes?.reduce((sum, t) => sum + Number(t.valor), 0) || 0;
    const lucroTotal = transacoes?.reduce((sum, t) => sum + Number(t.lucro), 0) || 0;

    // Agrupar por mês
    const transacoesPorMes = transacoes?.reduce((acc, transacao) => {
      const data = new Date(transacao.criada_em);
      const mesAno = `${String(data.getMonth() + 1).padStart(2, '0')}/${data.getFullYear()}`;
      
      if (!acc[mesAno]) {
        acc[mesAno] = { mes: mesAno, lucro: 0, transacoes: 0 };
      }
      
      acc[mesAno].lucro += Number(transacao.lucro);
      acc[mesAno].transacoes += 1;
      
      return acc;
    }, {} as Record<string, any>) || {};

    return new Response(
      JSON.stringify({ 
        success: true,
        data: {
          totalTransacoes,
          valorTotal,
          lucroTotal,
          transacoesPorMes: Object.values(transacoesPorMes),
          transacoesRecentes: transacoes?.slice(0, 10) || []
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Erro na função api-dashboard:', error);
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

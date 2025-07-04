
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

    const { 
      user_id, 
      cliente_nome,
      cliente_cpf,
      cliente_nascimento,
      cliente_mae,
      cliente_profissao,
      veiculo_marca,
      veiculo_modelo,
      veiculo_ano,
      valor_veiculo,
      valor_entrada, 
      parcelas
    } = await req.json();

    if (!user_id || !cliente_nome || !cliente_cpf || !veiculo_marca || !veiculo_modelo || !valor_veiculo || !valor_entrada || !parcelas) {
      return new Response(
        JSON.stringify({ status: 'error', message: 'Dados incompletos' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calcular financiamento
    const valorFinanciado = valor_veiculo - valor_entrada;
    const taxaJuros = 0.015; // 1.5% ao mês (exemplo)
    const valorParcela = (valorFinanciado * (1 + taxaJuros * parcelas)) / parcelas;
    const valorTotal = valorParcela * parcelas;

    // Gerar código da proposta
    const codigoProposta = `PM-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Salvar proposta na nova tabela
    const { error: proposalError } = await supabase
      .from('propostas_financiamento')
      .insert({
        user_id: user_id,
        codigo_proposta: codigoProposta,
        cliente_nome: cliente_nome,
        cliente_cpf: cliente_cpf,
        cliente_nascimento: cliente_nascimento ? new Date(cliente_nascimento).toISOString().split('T')[0] : null,
        cliente_mae: cliente_mae,
        cliente_profissao: cliente_profissao,
        veiculo: `${veiculo_marca} ${veiculo_modelo}`,
        marca: veiculo_marca,
        modelo: veiculo_modelo,
        ano_veiculo: veiculo_ano,
        valor_veiculo: valor_veiculo,
        valor_entrada: valor_entrada,
        parcelas: parcelas,
        valor_parcela: Math.round(valorParcela * 100) / 100,
        valor_total: Math.round(valorTotal * 100) / 100,
        taxa_juros: taxaJuros * 100,
        criado_por: user_id,
        status: 'pendente'
      });

    if (proposalError) {
      console.error('Erro ao salvar proposta:', proposalError);
      throw proposalError;
    }

    return new Response(
      JSON.stringify({ 
        status: 'success', 
        message: 'Proposta gerada com sucesso',
        proposta: {
          codigo: codigoProposta,
          veiculo: `${veiculo_marca} ${veiculo_modelo} ${veiculo_ano}`,
          valor_veiculo: valor_veiculo,
          valor_entrada: valor_entrada,
          valor_financiado: valorFinanciado,
          parcelas: parcelas,
          valor_parcela: Math.round(valorParcela * 100) / 100,
          valor_total: Math.round(valorTotal * 100) / 100,
          taxa_juros: taxaJuros * 100
        }
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erro ao simular financiamento:', error);
    return new Response(
      JSON.stringify({ 
        status: 'error', 
        message: error.message || 'Erro interno do servidor' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

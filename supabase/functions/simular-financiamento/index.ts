
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
      veiculo_id, 
      valor_entrada, 
      parcelas,
      kyc_data 
    } = await req.json();

    if (!user_id || !veiculo_id || !valor_entrada || !parcelas) {
      return new Response(
        JSON.stringify({ status: 'error', message: 'Dados incompletos' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Buscar dados do veículo
    const { data: vehicleData, error: vehicleError } = await supabase
      .from('veiculos_pro_motors')
      .select('*')
      .eq('id', veiculo_id)
      .single();

    if (vehicleError || !vehicleData) {
      return new Response(
        JSON.stringify({ status: 'error', message: 'Veículo não encontrado' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Salvar/atualizar dados KYC se fornecidos
    if (kyc_data) {
      const { error: kycError } = await supabase
        .from('perfil_kyc')
        .upsert({
          user_id: user_id,
          nome_completo: kyc_data.nome_completo,
          cpf: kyc_data.cpf,
          data_nascimento: kyc_data.data_nascimento,
          nome_mae: kyc_data.nome_mae,
          profissao: kyc_data.profissao
        });

      if (kycError) {
        console.error('Erro ao salvar KYC:', kycError);
      }
    }

    // Calcular financiamento
    const valorVeiculo = vehicleData.preco;
    const valorFinanciado = valorVeiculo - valor_entrada;
    const taxaJuros = 0.015; // 1.5% ao mês (exemplo)
    const valorParcela = (valorFinanciado * (1 + taxaJuros * parcelas)) / parcelas;

    // Gerar código da proposta
    const codigoProposta = `PM-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Salvar proposta
    const { error: proposalError } = await supabase
      .from('propostas_financiamento')
      .insert({
        user_id: user_id,
        codigo_proposta: codigoProposta,
        veiculo: `${vehicleData.marca} ${vehicleData.modelo}`,
        ano_veiculo: vehicleData.ano,
        valor_entrada: valor_entrada,
        parcelas: parcelas,
        valor_parcela: valorParcela,
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
          veiculo: `${vehicleData.marca} ${vehicleData.modelo} ${vehicleData.ano}`,
          valor_veiculo: valorVeiculo,
          valor_entrada: valor_entrada,
          valor_financiado: valorFinanciado,
          parcelas: parcelas,
          valor_parcela: Math.round(valorParcela * 100) / 100,
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

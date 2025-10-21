import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Validation schemas
const ProposalSchema = z.object({
  user_id: z.string().uuid('ID de usuário inválido'),
  cliente_nome: z.string().trim().min(3, 'Nome deve ter no mínimo 3 caracteres').max(100, 'Nome muito longo'),
  cliente_cpf: z.string().regex(/^\d{11}$/, 'CPF deve conter 11 dígitos'),
  cliente_nascimento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data de nascimento inválida').optional(),
  cliente_mae: z.string().trim().min(3, 'Nome da mãe deve ter no mínimo 3 caracteres').max(100).optional(),
  cliente_profissao: z.string().trim().max(100).optional(),
  veiculo_marca: z.string().trim().min(2, 'Marca deve ter no mínimo 2 caracteres').max(50, 'Marca muito longa'),
  veiculo_modelo: z.string().trim().min(2, 'Modelo deve ter no mínimo 2 caracteres').max(100, 'Modelo muito longo'),
  veiculo_ano: z.number().int('Ano deve ser um número inteiro').min(1950, 'Ano muito antigo').max(new Date().getFullYear() + 1, 'Ano inválido').optional(),
  valor_veiculo: z.number().positive('Valor do veículo deve ser positivo').max(10000000, 'Valor do veículo muito alto'),
  valor_entrada: z.number().nonnegative('Valor de entrada não pode ser negativo').max(10000000, 'Valor de entrada muito alto'),
  parcelas: z.number().int('Parcelas deve ser um número inteiro').min(6, 'Mínimo 6 parcelas').max(96, 'Máximo 96 parcelas'),
  taxa_juros: z.number().positive('Taxa de juros deve ser positiva').min(0.1, 'Taxa de juros mínima: 0.1%').max(10, 'Taxa de juros máxima: 10%').optional()
}).refine(
  data => data.valor_entrada <= data.valor_veiculo,
  { message: 'Valor de entrada não pode ser maior que o valor do veículo', path: ['valor_entrada'] }
)

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse and validate request body
    const requestData = await req.json();
    const validationResult = ProposalSchema.safeParse(requestData);
    
    if (!validationResult.success) {
      console.error('Validation error:', validationResult.error.format());
      return new Response(
        JSON.stringify({ 
          status: 'error', 
          message: 'Dados inválidos',
          errors: validationResult.error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

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
      parcelas,
      taxa_juros
    } = validationResult.data;

    // Calcular financiamento
    const valorFinanciado = valor_veiculo - valor_entrada;
    const taxaJuros = taxa_juros ? taxa_juros / 100 : 0.015; // Converter de percentual para decimal
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

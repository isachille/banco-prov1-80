import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Input validation schema
const TransacaoSchema = z.object({
  tipo: z.enum(['pix', 'boleto', 'ted'], {
    errorMap: () => ({ message: 'Tipo de transação inválido. Use: pix, boleto ou ted' })
  }),
  valor: z.number({
    required_error: 'Valor é obrigatório',
    invalid_type_error: 'Valor deve ser um número'
  })
    .positive('Valor deve ser positivo')
    .max(1000000, 'Valor máximo: R$ 1.000.000'),
  taxa_efi: z.number().min(0).max(1000).optional(),
  taxa_sua: z.number().min(0).max(1000).optional(),
  descricao: z.string()
    .max(500, 'Descrição muito longa (máximo 500 caracteres)')
    .optional()
});

type TransacaoData = z.infer<typeof TransacaoSchema>;

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
      return new Response(
        JSON.stringify({ success: false, error: 'Token de autorização não fornecido' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: 'Usuário não autenticado' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse and validate input
    const rawData = await req.json();
    const validationResult = TransacaoSchema.safeParse(rawData);
    
    if (!validationResult.success) {
      console.error('Validation errors:', validationResult.error.errors);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Dados inválidos',
          details: validationResult.error.errors.map(e => e.message)
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const transacaoData: TransacaoData = validationResult.data;
    console.log('Transação validada para usuário:', user.id);

    // Buscar subconta do usuário
    const { data: subconta, error: subcontaError } = await supabase
      .from('subcontas')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (subcontaError || !subconta) {
      return new Response(
        JSON.stringify({ success: false, error: 'Subconta não encontrada' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Criar transação with validated data
    const { data: transacao, error: transacaoError } = await supabase
      .from('transacoes')
      .insert({
        subconta_id: subconta.id,
        user_id: user.id,
        tipo: transacaoData.tipo,
        valor: transacaoData.valor,
        taxa_efi: transacaoData.taxa_efi || 0,
        taxa_sua: transacaoData.taxa_sua || 0,
        descricao: transacaoData.descricao || null,
        status: 'concluida'
      })
      .select()
      .single();

    if (transacaoError) {
      console.error('Erro ao criar transação:', transacaoError);
      return new Response(
        JSON.stringify({ success: false, error: 'Erro ao criar transação' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Transação criada com sucesso:', transacao.id);

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
      JSON.stringify({ success: false, error: 'Erro interno do servidor' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

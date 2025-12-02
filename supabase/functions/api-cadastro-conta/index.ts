import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// CPF validation regex (with or without formatting)
const cpfRegex = /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/;

// Input validation schema
const CadastroSchema = z.object({
  nome: z.string()
    .trim()
    .min(2, { message: 'Nome deve ter pelo menos 2 caracteres' })
    .max(200, { message: 'Nome muito longo' }),
  email: z.string()
    .trim()
    .email({ message: 'Email inválido' })
    .max(255, { message: 'Email muito longo' }),
  cpf: z.string()
    .trim()
    .regex(cpfRegex, { message: 'CPF inválido' }),
  telefone: z.string()
    .trim()
    .min(10, { message: 'Telefone deve ter pelo menos 10 dígitos' })
    .max(20, { message: 'Telefone muito longo' }),
  data_nascimento: z.string()
    .trim()
    .refine((date) => {
      const parsed = new Date(date);
      return !isNaN(parsed.getTime()) && parsed < new Date();
    }, { message: 'Data de nascimento inválida' })
});

type CadastroData = z.infer<typeof CadastroSchema>;

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
    const validationResult = CadastroSchema.safeParse(rawData);
    
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

    const cadastroData: CadastroData = validationResult.data;
    console.log('Cadastro validado para usuário:', user.id);

    // Insert validated data into subcontas table
    const { data: subconta, error: subcontaError } = await supabase
      .from('subcontas')
      .insert({
        nome: cadastroData.nome,
        email: cadastroData.email,
        cpf: cadastroData.cpf,
        telefone: cadastroData.telefone,
        data_nascimento: cadastroData.data_nascimento,
        user_id: user.id,
        id_efi: `conta_${Date.now()}`
      })
      .select()
      .single();

    if (subcontaError) {
      console.error('Erro ao criar subconta:', subcontaError);
      return new Response(
        JSON.stringify({ success: false, error: 'Erro ao criar subconta' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Subconta criada com sucesso:', subconta.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Conta criada com sucesso!',
        subconta_id: subconta.id,
        id_conta: subconta.id_efi
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erro na função api-cadastro-conta:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Erro interno do servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

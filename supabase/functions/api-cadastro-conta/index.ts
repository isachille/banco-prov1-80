
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CadastroData {
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  data_nascimento: string;
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

    // Verificar usuário autenticado
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Usuário não autenticado');
    }

    const cadastroData: CadastroData = await req.json();
    console.log('Dados recebidos para cadastro:', cadastroData);

    // Validar dados obrigatórios
    if (!cadastroData.nome || !cadastroData.email || !cadastroData.cpf || !cadastroData.telefone || !cadastroData.data_nascimento) {
      throw new Error('Todos os campos são obrigatórios');
    }

    // Inserir dados na tabela subcontas
    const { data: subconta, error: subcontaError } = await supabase
      .from('subcontas')
      .insert({
        nome: cadastroData.nome,
        email: cadastroData.email,
        cpf: cadastroData.cpf,
        telefone: cadastroData.telefone,
        data_nascimento: cadastroData.data_nascimento,
        user_id: user.id,
        id_efi: `conta_${Date.now()}` // ID gerado internamente
      })
      .select()
      .single();

    if (subcontaError) {
      console.error('Erro ao criar subconta:', subcontaError);
      throw new Error('Erro ao criar subconta: ' + subcontaError.message);
    }

    console.log('Subconta criada:', subconta);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Conta criada com sucesso!',
        subconta_id: subconta.id,
        id_conta: subconta.id_efi
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Erro na função api-cadastro-conta:', error);
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

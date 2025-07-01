
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const redirectUserByStatus = async (userId: string) => {
    try {
      console.log('Buscando dados do usuário:', userId);
      
      const { data: userData, error } = await supabase
        .from('users')
        .select('status, is_admin, role')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        toast.error('Erro ao verificar dados do usuário');
        return;
      }

      console.log('Dados do usuário encontrados:', userData);

      // Se o usuário não existe na tabela users, criar um registro
      if (!userData) {
        console.log('Usuário não encontrado na tabela users, criando registro...');
        const { data: authUser } = await supabase.auth.getUser();
        
        if (authUser.user) {
          console.log('Dados do auth user:', {
            id: authUser.user.id,
            email: authUser.user.email,
            metadata: authUser.user.user_metadata
          });

          const newUserData = {
            id: authUser.user.id,
            email: authUser.user.email || '',
            nome: authUser.user.user_metadata?.nome || '',
            nome_completo: authUser.user.user_metadata?.nome_completo || '',
            cpf_cnpj: authUser.user.user_metadata?.cpf_cnpj || '',
            telefone: authUser.user.user_metadata?.telefone || '',
            tipo: 'cliente',
            status: 'pendente',
            role: 'cliente' // Mudança aqui: usar 'cliente' em vez de 'usuario'
          };

          console.log('Tentando inserir usuário com dados:', newUserData);

          const { error: insertError } = await supabase
            .from('users')
            .insert(newUserData);
          
          if (insertError) {
            console.error('Erro detalhado ao criar usuário:', {
              code: insertError.code,
              message: insertError.message,
              details: insertError.details,
              hint: insertError.hint
            });
            
            // Verificar se é erro de duplicação
            if (insertError.code === '23505') {
              console.log('Usuário já existe, tentando buscar novamente...');
              // Tentar buscar o usuário novamente
              const { data: existingUser, error: fetchError } = await supabase
                .from('users')
                .select('status, is_admin, role')
                .eq('id', userId)
                .maybeSingle();
              
              if (fetchError) {
                console.error('Erro ao buscar usuário existente:', fetchError);
                toast.error('Erro ao verificar dados do usuário existente');
                return;
              }
              
              if (existingUser) {
                console.log('Usuário existente encontrado:', existingUser);
                // Continuar com a lógica de redirecionamento
                redirectBasedOnUserData(existingUser);
                return;
              }
            } else {
              toast.error('Erro ao criar dados do usuário: ' + insertError.message);
              return;
            }
          }
          
          console.log('Usuário criado com sucesso, redirecionando para aguardando-aprovacao');
          navigate('/aguardando-aprovacao');
          return;
        } else {
          console.error('Não foi possível obter dados do usuário autenticado');
          toast.error('Erro ao obter dados do usuário');
          return;
        }
      }

      redirectBasedOnUserData(userData);

    } catch (error) {
      console.error('Erro geral ao verificar status:', error);
      toast.error('Erro interno ao verificar status da conta');
    }
  };

  const redirectBasedOnUserData = (userData: any) => {
    console.log('Redirecionando baseado em dados do usuário:', userData);
    console.log('Verificando condições de admin:', {
      is_admin: userData.is_admin,
      role: userData.role,
      status: userData.status
    });
    
    // Verificar se é admin/gerente/dono primeiro - PRIORIDADE MÁXIMA
    const isAdminUser = userData.is_admin === true || 
                       userData.role === 'admin' || 
                       userData.role === 'gerente' || 
                       userData.role === 'dono';
    
    console.log('É usuário admin/gerente/dono?', isAdminUser);
    
    if (isAdminUser) {
      console.log('REDIRECIONANDO PARA PAINEL ADMIN - Usuário é:', userData.role);
      navigate('/painel-admin');
      return;
    }

    // Redirecionar baseado no status para usuários normais
    console.log('Usuário normal, verificando status:', userData.status);
    switch (userData.status) {
      case 'ativo':
        console.log('Status ativo, redirecionando para home');
        navigate('/home');
        break;
      case 'pendente':
        console.log('Status pendente, redirecionando para aguardando-aprovacao');
        navigate('/aguardando-aprovacao');
        break;
      case 'recusado':
        console.log('Status recusado, redirecionando para conta-recusada');
        navigate('/conta-recusada');
        break;
      default:
        console.log('Status desconhecido:', userData.status, 'redirecionando para aguardando-aprovacao');
        navigate('/aguardando-aprovacao');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Tentativa de login:', formData.email);
      
      // Limpar qualquer sessão anterior
      await supabase.auth.signOut();
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.senha
      });

      if (error) {
        console.error('Erro no login:', error);
        if (error.message === 'Invalid login credentials') {
          toast.error('Email ou senha incorretos.');
        } else if (error.message === 'Email not confirmed') {
          toast.error('Por favor, confirme seu email antes de fazer login. Verifique sua caixa de entrada.');
        } else {
          toast.error('Erro no login: ' + error.message);
        }
        return;
      }

      if (data.user && data.session) {
        console.log('Login bem-sucedido:', data.user.id);
        
        // Verificar se o email foi confirmado
        if (!data.user.email_confirmed_at) {
          toast.error('Por favor, confirme seu email antes de fazer login.');
          await supabase.auth.signOut();
          return;
        }
        
        toast.success('Login realizado com sucesso!');
        
        // Aguardar um pouco para garantir que a sessão foi estabelecida
        setTimeout(() => {
          redirectUserByStatus(data.user.id);
        }, 500);
      }
    } catch (error) {
      console.error('Erro no login:', error);
      toast.error('Erro no login. Verifique suas credenciais.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-blue-900 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="w-full max-w-md space-y-4">
        <Card>
          <CardHeader className="text-center">
            <img 
              src="/lovable-uploads/4712549c-a705-4aad-8498-4702dc3cdd8f.png" 
              alt="Banco Pro" 
              className="h-16 w-auto mx-auto mb-4"
            />
            <CardTitle className="text-2xl font-bold text-[#0057FF]">Banco Pro</CardTitle>
            <p className="text-muted-foreground">Entre na sua conta</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Input
                  type="email"
                  name="email"
                  placeholder="E-mail"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="h-12"
                />
              </div>
              <div>
                <Input
                  type="password"
                  name="senha"
                  placeholder="Senha"
                  value={formData.senha}
                  onChange={handleInputChange}
                  required
                  className="h-12"
                />
              </div>
              <Button
                type="submit"
                className="w-full h-12 bg-[#0057FF] hover:bg-[#0047CC] text-white font-medium"
                disabled={isLoading}
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <button
                onClick={() => navigate('/cadastro')}
                className="text-[#0057FF] hover:underline"
              >
                Ainda não tem conta? Cadastre-se
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Card informativo sobre confirmação de email */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <p className="text-sm text-blue-800">
              <strong>📧 Confirme seu email:</strong> Após se cadastrar, verifique sua caixa de entrada e clique no link de confirmação para ativar sua conta.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;


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

  const redirectUserByStatus = async () => {
    try {
      // Verificar sessão e dados do usuário
      const { data: { user }, error: sessionError } = await supabase.auth.getUser();
      
      if (sessionError || !user) {
        console.error('Erro ao obter usuário:', sessionError);
        toast.error('Erro ao verificar usuário');
        return;
      }

      console.log('Usuário logado:', user.id);
      console.log('Email confirmado em:', user.email_confirmed_at);

      // Verificar se email foi confirmado
      if (!user.email_confirmed_at) {
        console.log('Email não confirmado, redirecionando para confirme-email');
        navigate('/confirme-email');
        return;
      }

      // Aguardar um pouco para garantir que os dados estão sincronizados
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Buscar dados do usuário na tabela users
      const { data: userData, error } = await supabase
        .from('users')
        .select('status, is_admin, role')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        toast.error('Erro ao verificar dados do usuário');
        return;
      }

      console.log('Dados do usuário encontrados:', userData);

      // Se usuário não foi encontrado na tabela, pode estar em processo de criação
      if (!userData) {
        console.log('Usuário não encontrado na tabela users, redirecionando para confirme-email');
        navigate('/confirme-email');
        return;
      }

      // Verificar se é admin/gerente/dono primeiro
      const isAdminUser = userData.is_admin === true || 
                         userData.role === 'admin' || 
                         userData.role === 'gerente' || 
                         userData.role === 'dono';
      
      if (isAdminUser) {
        console.log('Redirecionando admin para /admin');
        navigate('/admin');
        return;
      }

      // Redirecionar baseado no status usando as novas páginas
      switch (userData.status) {
        case 'ativo':
          console.log('Status ativo, redirecionando para home');
          navigate('/home');
          break;
        case 'pendente':
          console.log('Status pendente, redirecionando para /pendente');
          navigate('/pendente');
          break;
        case 'recusado':
          console.log('Status recusado, redirecionando para /recusado');
          navigate('/recusado');
          break;
        default:
          console.log('Status desconhecido, redirecionando para /pendente');
          navigate('/pendente');
      }

    } catch (error) {
      console.error('Erro ao verificar status:', error);
      toast.error('Erro interno ao verificar status da conta');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Tentativa de login para:', formData.email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.senha
      });

      if (error) {
        console.error('Erro no login:', error);
        if (error.message === 'Invalid login credentials') {
          toast.error('Email ou senha incorretos.');
        } else if (error.message === 'Email not confirmed') {
          toast.error('Por favor, confirme seu email antes de fazer login.');
          navigate('/confirme-email');
        } else {
          toast.error('Erro no login: ' + error.message);
        }
        return;
      }

      if (data.user && data.session) {
        console.log('Login bem-sucedido:', data.user.id);
        toast.success('Login realizado com sucesso!');
        
        // Aguardar para garantir sessão estabelecida
        setTimeout(() => {
          redirectUserByStatus();
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
      </div>
    </div>
  );
};

export default Login;

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
      const { data: userData, error } = await supabase
        .from('users')
        .select('status, is_admin, role')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        toast.error('Erro ao verificar status da conta');
        return;
      }

      console.log('Dados do usuário:', userData);

      // Verificar se é admin/gerente primeiro
      if (userData.is_admin || userData.role === 'admin' || userData.role === 'gerente' || userData.role === 'dono') {
        navigate('/painel-admin');
        return;
      }

      // Redirecionar baseado no status para usuários normais
      switch (userData.status) {
        case 'ativo':
          navigate('/home');
          break;
        case 'pendente':
          navigate('/aguardando-aprovacao');
          break;
        case 'recusado':
          navigate('/conta-recusada');
          break;
        default:
          navigate('/aguardando-aprovacao');
      }
    } catch (error) {
      console.error('Erro ao verificar status:', error);
      toast.error('Erro ao verificar status da conta');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Tentativa de login:', formData);
      
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
        console.log('Login bem-sucedido:', data);
        
        // Verificar se o email foi confirmado
        if (!data.user.email_confirmed_at) {
          toast.error('Por favor, confirme seu email antes de fazer login.');
          await supabase.auth.signOut();
          return;
        }
        
        toast.success('Login realizado com sucesso!');
        
        // Redirecionar baseado no status e role
        await redirectUserByStatus(data.user.id);
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

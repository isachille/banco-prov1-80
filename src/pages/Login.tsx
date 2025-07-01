
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Tentativa de login:', formData);
      
      // Fazer login usando Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.senha
      });

      if (error) {
        console.error('Erro no login:', error);
        if (error.message === 'Invalid login credentials') {
          toast.error('Email ou senha incorretos. Verifique se você já se cadastrou.');
        } else {
          toast.error('Erro no login: ' + error.message);
        }
        return;
      }

      if (data.user && data.session) {
        console.log('Login bem-sucedido:', data);
        
        // Salvar token e user_id globalmente no localStorage
        localStorage.setItem('token', data.session.access_token);
        localStorage.setItem('user_id', data.user.id);
        
        // Buscar dados do usuário na tabela users
        console.log('Buscando dados do usuário...');
        try {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', data.user.id)
            .single();

          if (userError) {
            console.error('Erro ao buscar dados do usuário:', userError);
            // Continuar mesmo se não conseguir buscar os dados do usuário
            toast.success('Login realizado! (Dados do perfil não encontrados, mas você pode continuar)');
          } else if (userData) {
            console.log('Dados do usuário:', userData);
            
            // Salvar dados adicionais do usuário
            localStorage.setItem('nome_completo', userData.nome_completo || '');
            localStorage.setItem('cpf', userData.cpf_cnpj || '');
            localStorage.setItem('tipo', userData.tipo || '');
            localStorage.setItem('status', userData.status || '');
            localStorage.setItem('is_admin', userData.is_admin ? 'true' : 'false');
            
            toast.success('Login realizado com sucesso!');
          }
        } catch (userFetchError) {
          console.error('Erro ao buscar dados do usuário:', userFetchError);
          toast.success('Login realizado! (Erro ao carregar perfil, mas você pode continuar)');
        }
        
        // Verificar se é o administrador principal
        if (formData.email === 'isac.soares23@gmail.com') {
          console.log('Admin login detectado, redirecionando para PainelAdmin');
          navigate('/painel-admin');
        } else {
          console.log('Login de usuário regular, redirecionando para home');
          navigate('/home');
        }
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

        {/* Card de ajuda para teste */}
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <p className="text-sm text-yellow-800">
              <strong>Para testar:</strong> Vá em Configurações → Área de Desenvolvimento e clique em "Cadastrar Teste" primeiro!
            </p>
            <Button
              onClick={() => navigate('/configuracoes')}
              variant="outline"
              size="sm"
              className="mt-2 w-full"
            >
              Ir para Configurações
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;

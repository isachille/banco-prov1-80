
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { cleanupAuthState } from '@/utils/authCleanup';

const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Verificar se usuário já está logado
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          // Se já está logado, verificar role e redirecionar
          const { data: userData } = await supabase
            .from('users')
            .select('role, status')
            .eq('id', session.user.id)
            .single();

          if (userData) {
            if (userData.status === 'ativo' || ['admin', 'dono'].includes(userData.role)) {
              navigate('/home');
            }
          }
        }
      } catch (error) {
        // Error checking user - silently continue
      }
    };
    checkUser();
  }, [navigate]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loading) return; // Prevenir múltiplos submits
    
    setLoading(true);

    try {
      // Limpar estado anterior
      cleanupAuthState();
      
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Preventive logout failed - continue
      }

      // Aguardar um pouco para garantir limpeza
      await new Promise(resolve => setTimeout(resolve, 300));

      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        // Login error - show user-friendly message
        
        if (error.message.includes('Email not confirmed')) {
          toast.error('Por favor, confirme seu email antes de fazer login. Verifique sua caixa de entrada.');
        } else if (error.message.includes('Invalid login credentials')) {
          toast.error('Email ou senha incorretos. Verifique suas credenciais.');
        } else {
          toast.error('Erro no login. Tente novamente em alguns momentos.');
        }
        return;
      }

      if (data.user) {
        // Verificar dados do usuário na tabela users
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role, status, nome_completo')
          .eq('id', data.user.id)
          .single();

        if (userError) {
          // Error fetching user data
          toast.error('Erro ao verificar dados do usuário');
          return;
        }

        if (!userData) {
          toast.error('Usuário não encontrado no sistema');
          return;
        }

        // Login successful

        if (userData.status === 'pendente' && !['admin', 'dono'].includes(userData.role)) {
          toast.info('Sua conta está pendente de aprovação');
          navigate('/pendente');
          return;
        }

        if (userData.status === 'recusado') {
          toast.error('Sua conta foi recusada');
          navigate('/recusado');
          return;
        }

        toast.success(`Bem-vindo, ${userData.nome_completo || 'usuário'}!`);
        
        // Aguardar um pouco antes de redirecionar
        setTimeout(() => {
          navigate('/home');
        }, 500);
      }
    } catch (error: unknown) {
      // General login error
      toast.error('Erro interno. Tente novamente em alguns momentos.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loading) return; // Prevenir múltiplos submits
    
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast.error('As senhas não coincidem');
      setLoading(false);
      return;
    }

    try {
      // Limpar estado anterior
      cleanupAuthState();
      
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch {
        // Preventive logout failed - continue
      }

      // Aguardar um pouco para garantir limpeza
      await new Promise(resolve => setTimeout(resolve, 300));

      const redirectUrl = `${window.location.origin}/email-confirmado`;
      
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: redirectUrl
        }
      });

      if (error) {
        // Signup error - show user-friendly message
        
        if (error.message.includes('User already registered')) {
          toast.error('Este email já está cadastrado. Tente fazer login.');
        } else if (error.message.includes('Invalid email')) {
          toast.error('E-mail inválido. Verifique o formato.');
        } else {
          toast.error('Erro no cadastro. Tente novamente em alguns momentos.');
        }
        return;
      }

      if (data.user) {
        toast.success('Cadastro realizado! Verifique seu email para confirmar a conta.');
        
        // Aguardar um pouco antes de navegar
        setTimeout(() => {
          navigate('/confirme-email');
        }, 1000);
      }
    } catch (error: unknown) {
      // General signup error
      toast.error('Erro interno. Tente novamente em alguns momentos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001B3A] to-[#003F5C] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img 
              src="/lovable-uploads/4712549c-a705-4aad-8498-4702dc3cdd8f.png" 
              alt="Banco Pro" 
              className="h-16 w-auto"
            />
          </div>
          <CardTitle className="text-2xl text-[#001B3A]">
            {isLogin ? 'Entrar' : 'Criar Conta'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={isLogin ? handleLogin : handleSignUp} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                disabled={loading}
              />
            </div>
            
            <div>
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-[#0057FF] hover:bg-[#0047CC] disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{isLogin ? 'Entrando...' : 'Cadastrando...'}</span>
                </div>
              ) : (
                <>
                  {isLogin ? <LogIn className="w-4 h-4 mr-2" /> : <UserPlus className="w-4 h-4 mr-2" />}
                  {isLogin ? 'Entrar' : 'Criar Conta'}
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-[#0057FF] hover:underline disabled:opacity-50"
              disabled={loading}
            >
              {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Faça login'}
            </button>
          </div>

          <div className="mt-4 text-center">
            <Link
              to="/cadastro"
              className="text-sm text-gray-600 hover:text-[#0057FF] hover:underline"
            >
              Cadastro Completo (PF/PJ)
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;

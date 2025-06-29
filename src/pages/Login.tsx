
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
      console.log('Login attempt:', formData);
      
      // Verificar se é o e-mail do administrador principal
      if (formData.email === 'isac.soares23@gmail.com') {
        console.log('Admin login detected, redirecting to PainelAdmin');
        navigate('/painel-admin');
        toast.success('Bem-vindo ao Painel Administrativo!');
      } else {
        console.log('Regular user login, redirecting to home');
        navigate('/home');
        toast.success('Login realizado com sucesso!');
      }
    } catch (error) {
      toast.error('Erro no login. Verifique suas credenciais.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-blue-900 flex items-center justify-center p-4 transition-colors duration-300">
      <Card className="w-full max-w-md">
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
                name="password"
                placeholder="Senha"
                value={formData.password}
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
  );
};

export default Login;

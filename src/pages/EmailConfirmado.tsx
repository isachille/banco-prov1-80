
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const EmailConfirmado = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Verificar se o usuário tem sessão ativa
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }
    };

    checkSession();

    // Countdown para redirecionamento automático
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleContinue();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleContinue = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/login');
        return;
      }

      // Buscar dados do usuário na tabela users
      const { data: userData, error } = await supabase
        .from('users')
        .select('status, role, is_admin')
        .eq('id', session.user.id)
        .maybeSingle();

      if (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        navigate('/login');
        return;
      }

      // Se não encontrou o usuário, aguardar o trigger
      if (!userData) {
        console.log('Usuário não encontrado na tabela users, aguardando trigger...');
        // Aguardar um pouco e tentar novamente
        setTimeout(() => {
          navigate('/home');
        }, 2000);
        return;
      }

      // Verificar se é admin/gerente/dono
      const isAdminUser = userData.is_admin === true || 
                         userData.role === 'admin' || 
                         userData.role === 'gerente' || 
                         userData.role === 'dono';
      
      if (isAdminUser) {
        navigate('/painel-admin');
        return;
      }

      // Para usuários normais, redirecionar para home (independente do status)
      // A verificação de status será feita na própria home
      navigate('/home');

    } catch (error) {
      console.error('Erro ao verificar status:', error);
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 dark:from-gray-900 dark:to-green-900 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="w-full max-w-md">
        <Card className="text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <img 
                src="/lovable-uploads/4712549c-a705-4aad-8498-4702dc3cdd8f.png" 
                alt="Banco Pro" 
                className="h-16 w-auto"
              />
            </div>
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-600">
              E-mail Confirmado!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 leading-relaxed">
                Seu e-mail foi confirmado com sucesso! Sua conta está sendo finalizada.
              </p>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-800">Próximos passos:</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>✅ E-mail confirmado</li>
                <li>🔄 Conta sendo configurada</li>
                <li>🏠 Redirecionando para a área do cliente</li>
              </ul>
            </div>

            <div className="pt-4 border-t border-gray-200 space-y-4">
              <p className="text-sm text-gray-600">
                Redirecionamento automático em {countdown} segundos...
              </p>
              
              <Button 
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={handleContinue}
              >
                <ArrowRight className="h-4 w-4 mr-2" />
                Continuar Agora
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmailConfirmado;

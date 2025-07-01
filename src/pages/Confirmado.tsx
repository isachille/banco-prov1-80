
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Confirmado = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userStatus, setUserStatus] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        // Verificar se há uma sessão ativa
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log('Nenhuma sessão encontrada após confirmação');
          setMessage('Sessão não encontrada. Redirecionando para login...');
          setTimeout(() => navigate('/login'), 2000);
          return;
        }

        console.log('Email confirmado com sucesso para:', session.user.email);
        
        // Aguardar um pouco para os triggers processarem
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Verificar se o usuário foi criado na tabela users
        const { data: userData, error } = await supabase
          .from('users')
          .select('id, status, role')
          .eq('id', session.user.id)
          .maybeSingle();

        if (error) {
          console.error('Erro ao verificar usuário:', error);
          setMessage('Erro ao verificar dados do usuário');
          return;
        }

        if (!userData) {
          console.log('Usuário ainda não foi criado, aguardando triggers...');
          setMessage('Estamos ativando sua conta, tente novamente em alguns minutos.');
          setLoading(false);
          return;
        }

        console.log('Status do usuário:', userData.status);
        setUserStatus(userData.status);

        // Verificar status e redirecionar se necessário
        switch (userData.status) {
          case 'ativo':
            console.log('Usuário ativo, redirecionando para /home');
            toast.success('Conta ativada! Redirecionando...');
            setTimeout(() => navigate('/home'), 2000);
            break;
          case 'pendente':
            console.log('Usuário pendente, mantendo na tela');
            setMessage('Conta confirmada com sucesso! Aguardando aprovação do administrador.');
            break;
          case 'recusado':
            console.log('Usuário recusado, redirecionando para /recusado');
            setTimeout(() => navigate('/recusado'), 2000);
            break;
          default:
            setMessage('Conta confirmada com sucesso! Aguardando aprovação do administrador.');
            break;
        }

      } catch (error) {
        console.error('Erro ao verificar status:', error);
        setMessage('Erro ao verificar status da conta');
      } finally {
        setLoading(false);
      }
    };

    checkUserStatus();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 dark:from-gray-900 dark:to-green-900 flex items-center justify-center p-4 transition-colors duration-300">
        <div className="w-full max-w-md">
          <Card className="text-center border-green-200 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex justify-center mb-4">
                <img 
                  src="/lovable-uploads/4712549c-a705-4aad-8498-4702dc3cdd8f.png" 
                  alt="Banco Pro" 
                  className="h-16 w-auto"
                />
              </div>
              <div className="flex justify-center mb-4">
                <Loader2 className="h-20 w-20 text-blue-500 animate-spin" />
              </div>
              <CardTitle className="text-2xl font-bold text-blue-600 mb-2">
                Processando confirmação...
              </CardTitle>
              <p className="text-lg text-gray-600">
                Aguarde enquanto verificamos sua conta
              </p>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 dark:from-gray-900 dark:to-green-900 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="w-full max-w-md">
        <Card className="text-center border-green-200 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex justify-center mb-4">
              <img 
                src="/lovable-uploads/4712549c-a705-4aad-8498-4702dc3cdd8f.png" 
                alt="Banco Pro" 
                className="h-16 w-auto"
              />
            </div>
            <div className="flex justify-center mb-4">
              <div className="relative">
                <CheckCircle className="h-20 w-20 text-green-500" />
                <div className="absolute inset-0 animate-ping">
                  <CheckCircle className="h-20 w-20 text-green-400 opacity-30" />
                </div>
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-green-600 mb-2">
              🎉 Email Confirmado!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-6 bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 rounded-xl">
              <p className="text-lg font-semibold text-green-700 mb-4">
                {message || 'Conta confirmada com sucesso! Aguardando aprovação do administrador.'}
              </p>
              
              {userStatus === 'pendente' && (
                <div className="text-green-700 text-sm space-y-2">
                  <p>✅ Email confirmado com sucesso</p>
                  <p>📝 Conta criada e aguardando aprovação</p>
                  <p>👨‍💼 Nossa equipe analisará sua solicitação</p>
                  <p>📧 Você receberá um email quando aprovado</p>
                </div>
              )}
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <Button 
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105"
                onClick={() => navigate('/login')}
              >
                <ArrowRight className="h-5 w-5 mr-2" />
                Ir para Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Confirmado;

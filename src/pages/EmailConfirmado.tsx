
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, Wallet } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const EmailConfirmado = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const setupUserAccount = async () => {
      try {
        // Verificar sessão atual
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log('Nenhuma sessão encontrada, redirecionando para login');
          navigate('/login');
          return;
        }

        console.log('Sessão confirmada para usuário:', session.user.id);

        // Aguardar um pouco para os triggers do banco processarem
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Verificar se o usuário existe na tabela users
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id, status, is_admin, role')
          .eq('id', session.user.id)
          .maybeSingle();

        if (userError) {
          console.error('Erro ao verificar usuário:', userError);
        }

        console.log('Dados do usuário:', userData);

        // Se usuário não existe ainda, aguardar mais um pouco
        if (!userData) {
          console.log('Usuário ainda não foi criado, aguardando mais...');
          await new Promise(resolve => setTimeout(resolve, 3000));
          
          // Tentar novamente
          const { data: userData2 } = await supabase
            .from('users')
            .select('id, status, is_admin, role')
            .eq('id', session.user.id)
            .maybeSingle();
          
          if (!userData2) {
            console.log('Usuário ainda não foi criado após aguardar');
            toast.error('Erro ao configurar conta. Tente fazer login novamente.');
            navigate('/login');
            return;
          }
        }

        // Verificar/criar carteira
        const { data: walletData } = await supabase
          .from('wallets')
          .select('id')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (!walletData) {
          console.log('Criando carteira para o usuário...');
          const { error: createWalletError } = await supabase
            .from('wallets')
            .insert({
              user_id: session.user.id,
              saldo: 0,
              limite: 1000,
              rendimento_mes: 0,
              status: 'ativa'
            });

          if (createWalletError) {
            console.error('Erro ao criar carteira:', createWalletError);
            toast.error('Erro ao criar carteira');
          } else {
            console.log('Carteira criada com sucesso!');
            toast.success('Carteira digital ativada!');
          }
        }

        setLoading(false);

      } catch (error) {
        console.error('Erro ao configurar conta:', error);
        toast.error('Erro ao configurar conta');
        navigate('/login');
      }
    };

    setupUserAccount();

    // Countdown para redirecionamento automático
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/home');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const handleContinue = () => {
    navigate('/home');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-100 dark:from-gray-900 dark:to-green-900 flex items-center justify-center p-4 transition-colors duration-300">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <img 
              src="/lovable-uploads/4712549c-a705-4aad-8498-4702dc3cdd8f.png" 
              alt="Banco Pro" 
              className="h-16 w-auto mx-auto mb-6"
            />
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0057FF] mx-auto mb-4"></div>
            <p className="text-muted-foreground">
              Ativando sua conta...
            </p>
          </CardContent>
        </Card>
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
              🎉 Parabéns!
            </CardTitle>
            <p className="text-xl font-semibold text-gray-800">
              Sua conta foi ativada com sucesso!
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-6 bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 rounded-xl">
              <div className="flex items-center justify-center mb-4">
                <Wallet className="h-8 w-8 text-green-600 mr-2" />
                <h3 className="text-lg font-bold text-green-700">
                  Carteira Digital Ativada!
                </h3>
              </div>
              <p className="text-green-700 leading-relaxed">
                Sua carteira digital foi criada e está pronta para uso. 
                Você já pode acessar todas as funcionalidades do Banco Pro!
              </p>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-800">O que você pode fazer agora:</h3>  
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center space-x-2 text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span>Verificar saldo</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span>Fazer transferências</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span>Pagar contas</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span>Investir</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-700 font-medium">
                  💳 Limite inicial: R$ 1.000,00
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Seu limite pode ser aumentado conforme o uso da conta
                </p>
              </div>
              
              <p className="text-sm text-gray-600 font-medium">
                Redirecionamento automático em {countdown} segundos...
              </p>
              
              <Button 
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105"
                onClick={handleContinue}
              >
                <ArrowRight className="h-5 w-5 mr-2" />
                Acessar Minha Conta
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmailConfirmado;

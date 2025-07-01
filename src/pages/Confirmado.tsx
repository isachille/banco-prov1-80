
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Confirmado = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const setupAccount = async () => {
      try {
        // Verificar se há uma sessão ativa
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log('Nenhuma sessão encontrada após confirmação');
          navigate('/login');
          return;
        }

        console.log('Email confirmado com sucesso para:', session.user.email);
        
        // Aguardar um pouco para os triggers processarem
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Verificar se o usuário foi criado na tabela users
        const { data: userData } = await supabase
          .from('users')
          .select('id, status')
          .eq('id', session.user.id)
          .maybeSingle();

        if (userData) {
          console.log('Usuário criado com status:', userData.status);
          toast.success('Conta criada com sucesso! Aguardando aprovação.');
        } else {
          console.log('Usuário ainda não foi criado, aguardando triggers...');
          toast.success('Email confirmado! Sua conta será configurada em breve.');
        }

        // Redirecionar para login após 3 segundos
        setTimeout(() => {
          navigate('/login');
        }, 3000);

      } catch (error) {
        console.error('Erro ao configurar conta:', error);
        toast.error('Erro ao configurar conta');
        navigate('/login');
      }
    };

    setupAccount();
  }, [navigate]);

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
            <p className="text-xl font-semibold text-gray-800">
              Sua conta foi criada com sucesso!
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-6 bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 rounded-xl">
              <h3 className="text-lg font-bold text-green-700 mb-2">
                Próximos Passos:
              </h3>
              <div className="text-green-700 text-sm space-y-2">
                <p>✅ Email confirmado com sucesso</p>
                <p>📝 Conta criada e aguardando aprovação</p>
                <p>👨‍💼 Nossa equipe analisará sua solicitação</p>
                <p>📧 Você receberá um email quando aprovado</p>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 font-medium mb-4">
                Redirecionando para login em 3 segundos...
              </p>
              
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

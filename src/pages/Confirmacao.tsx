
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

const Confirmacao = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        // Pegar os parâmetros da URL
        const access_token = searchParams.get('access_token');
        const refresh_token = searchParams.get('refresh_token');
        const token_hash = searchParams.get('token_hash');
        const type = searchParams.get('type');

        console.log('Parâmetros de confirmação:', { access_token, refresh_token, token_hash, type });

        // Verificar se temos os tokens necessários
        if (!access_token && !token_hash) {
          console.log('Tokens não encontrados, redirecionando para login');
          navigate('/login');
          return;
        }

        let result;

        // Usar verifyOtp com token_hash se disponível
        if (token_hash && type) {
          console.log('Usando verifyOtp com token_hash');
          result = await supabase.auth.verifyOtp({
            token_hash,
            type: type as any
          });
        } 
        // Usar setSession com access_token se disponível
        else if (access_token) {
          console.log('Usando setSession com access_token');
          result = await supabase.auth.setSession({
            access_token,
            refresh_token: refresh_token || ''
          });
        }

        if (result?.error) {
          console.error('Erro na confirmação:', result.error);
          toast.error('Erro ao confirmar email: ' + result.error.message);
          navigate('/login');
          return;
        }

        if (result?.data?.user) {
          console.log('Email confirmado com sucesso!', result.data.user.id);
          
          // Atualizar status do usuário para "analise" em vez de "ativo"
          try {
            const { error: updateError } = await supabase
              .from('users')
              .update({ status: 'analise' })
              .eq('id', result.data.user.id);

            if (updateError) {
              console.error('Erro ao atualizar status:', updateError);
            } else {
              console.log('Status atualizado para análise');
            }
          } catch (err) {
            console.error('Erro ao atualizar status:', err);
          }

          toast.success('Email confirmado! Sua conta está em análise.');
          
          // Redirecionar para a página de análise
          navigate('/analise');
        } else {
          console.log('Não foi possível confirmar o email');
          toast.error('Não foi possível confirmar o email');
          navigate('/login');
        }

      } catch (error) {
        console.error('Erro geral na confirmação:', error);
        toast.error('Erro ao confirmar email');
        navigate('/login');
      }
    };

    handleEmailConfirmation();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-blue-900 flex items-center justify-center p-4 transition-colors duration-300">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <img 
            src="/lovable-uploads/4712549c-a705-4aad-8498-4702dc3cdd8f.png" 
            alt="Banco Pro" 
            className="h-16 w-auto mx-auto mb-6"
          />
          <h1 className="text-3xl font-bold text-[#0057FF] mb-4">
            Confirmando seu e-mail...
          </h1>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0057FF] mx-auto"></div>
          <p className="text-muted-foreground mt-4">
            Aguarde enquanto confirmamos sua conta
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Confirmacao;

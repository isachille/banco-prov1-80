
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';

const Confirmacao = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const verifyEmail = async () => {
      const access_token = searchParams.get('access_token');
      const refresh_token = searchParams.get('refresh_token');
      
      if (!access_token) {
        alert("❌ Token de acesso não encontrado.");
        navigate('/login');
        return;
      }

      try {
        // Set the session using the tokens from the URL
        const { error } = await supabase.auth.setSession({
          access_token,
          refresh_token: refresh_token || ''
        });

        if (error) {
          throw error;
        }

        alert("✅ E-mail confirmado com sucesso!");
        navigate('/login');
      } catch (error) {
        console.error('Erro ao confirmar e-mail:', error);
        alert("❌ Erro ao confirmar. Tente novamente.");
        navigate('/login');
      }
    };

    // Executa a verificação automaticamente quando a página carrega
    verifyEmail();
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
            Verificando seu e-mail...
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

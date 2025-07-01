
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, ArrowLeft, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Recusado = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      toast.error('Erro ao fazer logout');
    }
  };

  const handleContact = () => {
    window.location.href = 'mailto:suporte@bancopro.com.br?subject=Revisão de Conta Recusada';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 dark:from-gray-900 dark:to-red-900 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="w-full max-w-md">
        <Card className="text-center border-red-200 shadow-lg">
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
                <XCircle className="h-20 w-20 text-red-500" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-red-600 mb-2">
              ❌ Conta Recusada
            </CardTitle>
            <p className="text-xl font-semibold text-gray-800">
              Sua solicitação não foi aprovada
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-6 bg-gradient-to-br from-red-50 to-pink-50 border border-red-200 rounded-xl">
              <h3 className="text-lg font-bold text-red-700 mb-3">
                Motivos Comuns para Recusa:
              </h3>
              <div className="text-red-700 text-sm space-y-2">
                <p>• Documentação incompleta ou ilegível</p>
                <p>• Dados inconsistentes ou incorretos</p>
                <p>• Não atendimento aos critérios mínimos</p>
                <p>• Informações não validadas</p>
              </div>
            </div>
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Quer tentar novamente?</h4>
              <p className="text-sm text-blue-700">
                Entre em contato conosco para entender os motivos específicos 
                da recusa e como corrigir sua solicitação.
              </p>
            </div>
            
            <div className="pt-4 border-t border-gray-200 space-y-3">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleContact}
              >
                <Mail className="h-4 w-4 mr-2" />
                Contatar Suporte
              </Button>
              
              <Button 
                variant="outline"
                className="w-full"
                onClick={handleLogout}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Recusado;

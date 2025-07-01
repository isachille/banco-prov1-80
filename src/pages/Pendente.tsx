
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, ArrowLeft, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Pendente = () => {
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

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 dark:from-gray-900 dark:to-yellow-900 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="w-full max-w-md">
        <Card className="text-center border-yellow-200 shadow-lg">
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
                <Clock className="h-20 w-20 text-yellow-500" />
                <div className="absolute inset-0 animate-pulse">
                  <Clock className="h-20 w-20 text-yellow-400 opacity-30" />
                </div>
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-yellow-600 mb-2">
              ⏳ Aguardando Aprovação
            </CardTitle>
            <p className="text-xl font-semibold text-gray-800">
              Sua conta está sendo analisada
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl">
              <h3 className="text-lg font-bold text-yellow-700 mb-3">
                Status da Sua Conta:
              </h3>
              <div className="text-yellow-700 text-sm space-y-2">
                <p>✅ Email confirmado com sucesso</p>
                <p>📝 Documentação recebida</p>
                <p>🔍 Em análise pela nossa equipe</p>
                <p>⏰ Aguardando aprovação final</p>
              </div>
            </div>
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">O que acontece agora?</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Nossa equipe analisa sua solicitação</li>
                <li>• Processo pode levar até 24 horas</li>
                <li>• Você receberá email quando aprovado</li>
                <li>• Acesso completo será liberado</li>
              </ul>
            </div>
            
            <div className="pt-4 border-t border-gray-200 space-y-3">
              <Button 
                variant="outline"
                className="w-full"
                onClick={handleRefresh}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Atualizar Status
              </Button>
              
              <Button 
                variant="outline"
                className="w-full"
                onClick={handleLogout}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Fazer Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Pendente;

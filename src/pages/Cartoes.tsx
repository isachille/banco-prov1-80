
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const Cartoes = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleRequestCard = async () => {
    setLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Usuário não autenticado');
        return;
      }

      // Verificar saldo
      const { data: walletData, error: walletError } = await supabase
        .from('wallets')
        .select('saldo')
        .eq('user_id', user.id)
        .single();

      if (walletError || !walletData) {
        toast.error('Erro ao verificar saldo');
        return;
      }

      if (walletData.saldo < 19.99) {
        toast.error('Saldo insuficiente. Valor da emissão: R$ 19,99');
        return;
      }

      // Descontar taxa de emissão
      const { error: updateError } = await supabase
        .from('wallets')
        .update({ saldo: walletData.saldo - 19.99 })
        .eq('user_id', user.id);

      if (updateError) {
        throw updateError;
      }

      toast.success('Cartão solicitado com sucesso! Taxa de R$ 19,99 debitada. Você receberá seu cartão em até 7 dias úteis.');
      
    } catch (error) {
      console.error('Erro ao solicitar cartão:', error);
      toast.error('Erro ao processar solicitação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#6B46C1] to-[#8B5CF6] text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/home')}
              className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Meus Cartões</h1>
              <p className="text-purple-100">Gerencie seus cartões</p>
            </div>
          </div>
          <img 
            src="/lovable-uploads/4712549c-a705-4aad-8498-4702dc3cdd8f.png" 
            alt="Banco Pro" 
            className="h-12 w-auto"
          />
        </div>
      </div>

      <div className="container mx-auto p-6 max-w-4xl">
        <Card className="mb-6">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-[#6B46C1] to-[#8B5CF6] rounded-full flex items-center justify-center mb-4">
              <CreditCard className="h-8 w-8 text-white" />
            </div>
            <CardTitle>Solicite seu Cartão</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Tenha acesso ao seu cartão de débito Banco Pro
              </p>
              <div className="bg-gradient-to-r from-[#6B46C1]/10 to-[#8B5CF6]/10 p-4 rounded-lg">
                <p className="font-semibold text-[#6B46C1]">Taxa de emissão: R$ 19,99</p>
                <p className="text-xs text-gray-600 mt-1">
                  Valor será debitado do seu saldo disponível
                </p>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Cartão de débito internacional</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Aceito em todo o mundo</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Entrega em até 7 dias úteis</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Sem anuidade</span>
              </div>
            </div>

            <Button
              onClick={handleRequestCard}
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#6B46C1] to-[#8B5CF6] hover:from-[#553C9A] hover:to-[#7C3AED]"
            >
              {loading ? 'Processando...' : 'Solicitar Cartão - R$ 19,99'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Cartoes;


import React, { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Transferencias = () => {
  const navigate = useNavigate();
  const [contaDestino, setContaDestino] = useState('');
  const [valor, setValor] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTransfer = async () => {
    if (!contaDestino || !valor) {
      toast.error('Preencha todos os campos');
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Usuário não autenticado');
        return;
      }

      const valorNumerico = parseFloat(valor.replace(',', '.'));

      // Verificar saldo na tabela wallets
      const { data: walletData } = await supabase
        .from('wallets')
        .select('saldo')
        .eq('user_id', user.id)
        .single();

      if (!walletData || walletData.saldo < valorNumerico) {
        toast.error('Saldo insuficiente');
        return;
      }

      // Atualizar saldo na carteira
      const { error } = await supabase
        .from('wallets')
        .update({ saldo: walletData.saldo - valorNumerico })
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Transferência realizada com sucesso!');
      setContaDestino('');
      setValor('');
    } catch (error) {
      console.error('Erro na transferência:', error);
      toast.error('Erro ao realizar transferência');
    } finally {
      setLoading(false);
    }
  };

  const transferOptions = [
    {
      title: 'Contas Bradesco e Next',
      description: 'Transferência entre contas do mesmo grupo',
      icon: '🔄',
      route: '/transferir'
    },
    {
      title: 'Contas de outros bancos',
      description: 'TED para outros bancos',
      icon: '🏦',
      route: '/ted'
    },
    {
      title: 'Pix',
      description: 'Transferência instantânea',
      icon: '⚡',
      route: '/pix'
    },
    {
      title: 'Conta de pagamento',
      description: 'Carteiras digitais',
      icon: '💳',
      route: '/pagamentos'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/home')}
              className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold">Transferências</h1>
          </div>
        </div>
      </div>

      <div className="p-6 -mt-4">
        <div className="space-y-4">
          {transferOptions.map((option, index) => (
            <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(option.route)}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/20 rounded-full flex items-center justify-center">
                    <span className="text-2xl">{option.icon}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{option.title}</h3>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Transferencias;

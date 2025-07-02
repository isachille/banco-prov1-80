
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, Send, Gift, PiggyBank, FileText, Shield, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

const Home = () => {
  const navigate = useNavigate();

  // Fetch user data and wallet balance
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      return { ...user, ...userData };
    }
  });

  const { data: wallet } = useQuery({
    queryKey: ['wallet', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data } = await supabase
        .from('binance_wallets')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      return data;
    },
    enabled: !!user?.id
  });

  const { data: cryptoWallet } = useQuery({
    queryKey: ['crypto-wallet', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data } = await supabase
        .from('wallets_cripto_binance')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      return data;
    },
    enabled: !!user?.id
  });

  const handleSyncBinance = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('sync-binance-saldo', {
        body: { user_id: user?.id }
      });
      
      if (error) throw error;
      
      toast.success('Sincronização realizada com sucesso!');
    } catch (error) {
      console.error('Erro na sincronização:', error);
      toast.error('Erro ao sincronizar com Binance');
    }
  };

  const menuItems = [
    {
      titulo: "PIX",
      icone: Send,
      acao: () => navigate('/pix'),
      bgColor: "bg-gradient-to-r from-blue-500 to-blue-600"
    },
    {
      titulo: "Transferências",
      icone: TrendingUp,
      acao: () => navigate('/transferencias'),
      bgColor: "bg-gradient-to-r from-green-500 to-green-600"
    },
    {
      titulo: "Gift Cards",
      icone: Gift,
      acao: () => navigate('/gift-cards-page'),
      bgColor: "bg-gradient-to-r from-pink-500 to-pink-600"
    },
    {
      titulo: "Cofrinho",
      icone: PiggyBank,
      acao: () => navigate('/cofrinho'),
      bgColor: "bg-gradient-to-r from-yellow-500 to-yellow-600"
    },
    {
      titulo: "Financiamento",
      icone: FileText,
      acao: () => navigate('/financing-page'),
      bgColor: "bg-gradient-to-r from-indigo-500 to-indigo-600"
    }
  ];

  // Add admin panel if user is 'dono'
  if (user?.role === 'dono') {
    menuItems.push({
      titulo: "Painel Admin",
      icone: Shield,
      acao: () => navigate('/admin/users'),
      bgColor: "bg-gradient-to-r from-red-500 to-red-600"
    });
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Header com saudação */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-6 rounded-b-3xl">
        <h1 className="text-2xl font-bold">Olá, {user?.nome || 'Usuário'}!</h1>
        <p className="text-purple-100 mt-1">Bem-vindo ao seu banco digital</p>
      </div>

      {/* Cartão de Saldo */}
      <Card className="mx-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Minha Carteira</CardTitle>
            <p className="text-gray-300 text-sm">Saldo disponível</p>
          </div>
          <Wallet className="h-8 w-8 text-gray-300" />
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-2xl font-bold">
              R$ {wallet?.balance?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
            </p>
            <p className="text-sm text-gray-300">Saldo em Real (BRL)</p>
          </div>
          
          {cryptoWallet && (
            <div className="pt-2 border-t border-gray-600">
              <p className="text-lg font-semibold">
                {cryptoWallet.saldo_crypto || 0} USDT
              </p>
              <p className="text-sm text-gray-300">
                ≈ R$ {(cryptoWallet.saldo_em_brl || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-gray-400">
                Cotação: R$ {cryptoWallet.cotacao || 0}
              </p>
            </div>
          )}
          
          <Button 
            onClick={handleSyncBinance}
            variant="secondary" 
            size="sm" 
            className="w-full mt-3"
          >
            Sincronizar com Binance
          </Button>
        </CardContent>
      </Card>

      {/* Menu de Ações */}
      <div className="px-4">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Ações Rápidas</h2>
        <div className="grid grid-cols-2 gap-4">
          {menuItems.map((item, index) => {
            const IconComponent = item.icone;
            return (
              <Card 
                key={index} 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={item.acao}
              >
                <CardContent className="p-4 text-center">
                  <div className={`w-12 h-12 ${item.bgColor} rounded-full flex items-center justify-center mx-auto mb-3`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <p className="font-medium text-gray-800">{item.titulo}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Ações Rápidas Adicionais */}
      <div className="px-4">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Outros Serviços</h2>
        <div className="space-y-3">
          <Button 
            variant="outline" 
            className="w-full justify-start" 
            onClick={() => navigate('/extrato-page')}
          >
            <FileText className="h-4 w-4 mr-2" />
            Ver Extrato Completo
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start" 
            onClick={() => navigate('/investimentos')}
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Investimentos
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;

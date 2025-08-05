
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Gift, 
  CreditCard, 
  Smartphone, 
  ShoppingBag, 
  Gamepad2, 
  Music,
  ArrowLeft,
  RefreshCw,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const GiftCards = () => {
  const navigate = useNavigate();
  const [userBalance, setUserBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncingBinance, setIsSyncingBinance] = useState(false);
  const [isCreatingSubaccount, setIsCreatingSubaccount] = useState(false);

  useEffect(() => {
    const getUserBalance = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: walletData } = await supabase
          .from('wallets')
          .select('saldo')
          .eq('user_id', user.id)
          .single();

        if (walletData) {
          setUserBalance(walletData.saldo || 0);
        }
      }
    };

    getUserBalance();
  }, []);

  const syncBinanceBalance = async () => {
    setIsSyncingBinance(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Usuário não autenticado');
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch('https://hjcvpozwjyydbegrcskq.functions.supabase.co/sync-binance-saldo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({})
      });

      if (!response.ok) {
        throw new Error('Erro na sincronização');
      }

      const result = await response.json();
      
      if (result.status === 'ok') {
        // Atualizar o saldo local após sincronização
        const { data: walletData } = await supabase
          .from('wallets')
          .select('saldo')
          .eq('user_id', user.id)
          .single();

        if (walletData) {
          setUserBalance(walletData.saldo || 0);
        }

        toast.success('Saldo Binance sincronizado com sucesso!');
      } else {
        toast.error('Falha na sincronização do saldo Binance');
      }
    } catch (error) {
      console.error('Erro ao sincronizar saldo Binance:', error);
      toast.error('Erro ao sincronizar saldo Binance');
    } finally {
      setIsSyncingBinance(false);
    }
  };

  const createBinanceSubaccount = async () => {
    setIsCreatingSubaccount(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Usuário não autenticado');
        return;
      }

      console.log('Tentando criar subconta para usuário:', user.id);

      // Tentar usar o método do Supabase primeiro
      try {
        const { data, error } = await supabase.functions.invoke('criar-subconta', {
          body: {}
        });

        if (error) {
          console.error('Erro na função Supabase:', error);
          throw error;
        }

        console.log('Resposta da função:', data);

        if (data?.status === 'ok') {
          toast.success('Subconta Binance criada com sucesso!');
        } else {
          toast.error(data?.message || 'Erro na criação da subconta Binance');
        }
      } catch (supabaseError) {
        console.error('Erro ao usar supabase.functions.invoke:', supabaseError);
        
        // Fallback para fetch direto
        console.log('Tentando fetch direto...');
        
        const response = await fetch('https://hjcvpozwjyydbegrcskq.functions.supabase.co/criar-subconta', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          },
          body: JSON.stringify({})
        });

        console.log('Status da resposta:', response.status);
        console.log('Headers da resposta:', [...response.headers.entries()]);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Erro na resposta:', errorText);
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const result = await response.json();
        console.log('Resultado:', result);
        
        if (result.status === 'ok') {
          toast.success('Subconta Binance criada com sucesso!');
        } else {
          toast.error(result.message || 'Erro na criação da subconta Binance');
        }
      }
    } catch (error) {
      console.error('Erro ao criar subconta Binance:', error);
      toast.error(`Erro ao criar subconta Binance: ${error.message}`);
    } finally {
      setIsCreatingSubaccount(false);
    }
  };

  const giftCardCategories = [
    {
      icon: ShoppingBag,
      title: 'E-commerce',
      description: 'Amazon, Mercado Livre, Americanas',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      options: [
        { name: 'Amazon', values: [50, 100, 200, 500] },
        { name: 'Mercado Livre', values: [25, 50, 100, 250] },
        { name: 'Americanas', values: [30, 75, 150, 300] }
      ]
    },
    {
      icon: Gamepad2,
      title: 'Gaming',
      description: 'Steam, PlayStation, Xbox, Nintendo',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      options: [
        { name: 'Steam', values: [20, 50, 100, 200] },
        { name: 'PlayStation', values: [25, 50, 100, 150] },
        { name: 'Xbox', values: [25, 50, 100, 150] }
      ]
    },
    {
      icon: Music,
      title: 'Streaming',
      description: 'Spotify, Netflix, Disney+, Amazon Prime',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      options: [
        { name: 'Spotify', values: [15, 30, 60] },
        { name: 'Netflix', values: [30, 60, 120] },
        { name: 'Disney+', values: [25, 50, 100] }
      ]
    },
    {
      icon: Smartphone,
      title: 'Mobile',
      description: 'Google Play, App Store, Recarga',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      options: [
        { name: 'Google Play', values: [10, 25, 50, 100] },
        { name: 'App Store', values: [10, 25, 50, 100] },
        { name: 'Recarga Tim', values: [15, 25, 50] }
      ]
    }
  ];

  const handlePurchase = async (service: string, value: number) => {
    if (userBalance < value) {
      toast.error('Saldo insuficiente para esta compra');
      return;
    }

    setIsLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Usuário não autenticado');
        return;
      }

      // Buscar saldo atual da carteira
      const { data: walletData, error: walletError } = await supabase
        .from('wallets')
        .select('saldo')
        .eq('user_id', user.id)
        .single();

      if (walletError || !walletData) {
        toast.error('Erro ao verificar saldo');
        return;
      }

      if (walletData.saldo < value) {
        toast.error('Saldo insuficiente');
        return;
      }

      // Atualizar saldo na carteira
      const { error: updateError } = await supabase
        .from('wallets')
        .update({ saldo: walletData.saldo - value })
        .eq('user_id', user.id);

      if (updateError) {
        throw updateError;
      }

      // Atualizar saldo local
      setUserBalance(prev => prev - value);
      
      toast.success(`Gift Card ${service} de R$ ${value} comprado com sucesso!`);
      
    } catch (error) {
      console.error('Erro na compra:', error);
      toast.error('Erro ao processar a compra');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/home')}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                <Gift className="h-6 w-6 mr-2 text-purple-600" />
                Gift Cards
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Compre gift cards para suas lojas favoritas
              </p>
            </div>
          </div>
        </div>

        {/* Saldo e Sincronização Binance */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Saldo disponível</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(userBalance)}
                </p>
              </div>
              <div className="flex space-x-3">
                <Button
                  onClick={createBinanceSubaccount}
                  disabled={isCreatingSubaccount}
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                >
                  {isCreatingSubaccount ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  Criar Subconta Binance
                </Button>
                <Button
                  onClick={syncBinanceBalance}
                  disabled={isSyncingBinance}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white"
                >
                  {isSyncingBinance ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  Sincronizar saldo cripto
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Categorias de Gift Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {giftCardCategories.map((category, categoryIndex) => (
            <Card key={categoryIndex} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${category.bgColor}`}>
                    <category.icon className={`h-6 w-6 ${category.color}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{category.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {category.description}
                    </p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {category.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">{option.name}</h4>
                        <Badge variant="secondary">Disponível</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {option.values.map((value, valueIndex) => (
                          <Button
                            key={valueIndex}
                            variant="outline"
                            size="sm"
                            onClick={() => handlePurchase(option.name, value)}
                            disabled={isLoading || userBalance < value}
                            className="text-sm"
                          >
                            {formatCurrency(value)}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Informações importantes */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">ℹ️ Informações Importantes</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>• Os gift cards são entregues instantaneamente por email</li>
              <li>• Códigos válidos por 12 meses a partir da compra</li>
              <li>• Não é possível cancelar ou reembolsar após a compra</li>
              <li>• Valores em reais (BRL) - taxas já incluídas</li>
              <li>• Suporte disponível 24/7 para questões técnicas</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GiftCards;

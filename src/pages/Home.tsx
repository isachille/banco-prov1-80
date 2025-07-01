
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Wallet, TrendingUp, CreditCard, DollarSign } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface WalletData {
  id: string;
  saldo: number;
  limite: number;
  rendimento_mes: number;
  status: string;
}

interface UserData {
  nome: string;
  nome_completo: string;
  status: string;
  tipo: string;
}

const Home = () => {
  const [showBalance, setShowBalance] = useState(false);
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error('Usuário não autenticado');
        return;
      }

      // Carregar dados do usuário
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('nome, nome_completo, status, tipo')
        .eq('id', session.user.id)
        .single();

      if (userError) {
        console.error('Erro ao carregar dados do usuário:', userError);
        toast.error('Erro ao carregar dados do usuário');
        return;
      }

      setUserData(user);

      // Só carregar dados da carteira se o usuário estiver ativo
      if (user.status === 'ativo') {
        const { data: wallet, error: walletError } = await supabase
          .from('wallets')
          .select('*')
          .eq('user_id', session.user.id)
          .single();

        if (walletError) {
          console.error('Erro ao carregar dados da carteira:', walletError);
          toast.error('Erro ao carregar dados da carteira');
          return;
        }

        setWalletData(wallet);
      }

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const toggleBalanceVisibility = () => {
    setShowBalance(!showBalance);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#0057FF]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header de boas-vindas */}
      <div className="bg-gradient-to-r from-[#0057FF] to-[#0047CC] text-white p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              Olá, {userData?.nome || 'Usuário'}! 👋
            </h1>
            <p className="text-blue-100 mt-1">
              Bem-vindo ao seu Banco Pro
            </p>
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded">
                {userData?.tipo === 'PF' ? 'Pessoa Física' : 'Pessoa Jurídica'}
              </span>
              <span className={`text-xs px-2 py-1 rounded ${
                userData?.status === 'ativo' 
                  ? 'bg-green-500 bg-opacity-20 text-green-100' 
                  : 'bg-yellow-500 bg-opacity-20 text-yellow-100'
              }`}>
                {userData?.status === 'ativo' ? 'Conta Ativa' : 'Status: ' + userData?.status}
              </span>
            </div>
          </div>
          <img 
            src="/lovable-uploads/4712549c-a705-4aad-8498-4702dc3cdd8f.png" 
            alt="Banco Pro" 
            className="h-12 w-auto opacity-80"
          />
        </div>
      </div>

      {/* Verificar se o usuário está ativo para mostrar funcionalidades bancárias */}
      {userData?.status !== 'ativo' ? (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-6">
            <div className="text-center">
              <Wallet className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                Conta em Análise
              </h3>
              <p className="text-yellow-700">
                Suas funcionalidades bancárias serão liberadas após a aprovação da sua conta pela nossa equipe.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Card do Saldo */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saldo Disponível</CardTitle>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleBalanceVisibility}
                  className="h-8 w-8 p-0"
                >
                  {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {showBalance 
                  ? formatCurrency(walletData?.saldo || 0)
                  : '••••••'
                }
              </div>
              <p className="text-xs text-muted-foreground">
                Carteira Digital • {walletData?.status || 'Ativa'}
              </p>
            </CardContent>
          </Card>

          {/* Cards de Informações */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Limite Disponível</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {showBalance 
                    ? formatCurrency(walletData?.limite || 0)
                    : '••••••'
                  }
                </div>
                <p className="text-xs text-muted-foreground">
                  Limite de crédito
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rendimento do Mês</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {showBalance 
                    ? formatCurrency(walletData?.rendimento_mes || 0)
                    : '••••••'
                  }
                </div>
                <p className="text-xs text-muted-foreground">
                  Rendimento acumulado
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Ações Rápidas */}
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button variant="outline" className="h-16 flex flex-col items-center justify-center space-y-1">
                  <DollarSign className="h-5 w-5" />
                  <span className="text-xs">Transferir</span>
                </Button>
                <Button variant="outline" className="h-16 flex flex-col items-center justify-center space-y-1">
                  <CreditCard className="h-5 w-5" />
                  <span className="text-xs">Pagar</span>
                </Button>
                <Button variant="outline" className="h-16 flex flex-col items-center justify-center space-y-1">
                  <TrendingUp className="h-5 w-5" />
                  <span className="text-xs">Investir</span>
                </Button>
                <Button variant="outline" className="h-16 flex flex-col items-center justify-center space-y-1">
                  <Wallet className="h-5 w-5" />
                  <span className="text-xs">Extrato</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default Home;

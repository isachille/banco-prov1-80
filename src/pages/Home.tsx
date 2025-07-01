
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Wallet, TrendingUp, CreditCard, DollarSign, ArrowRight, FileText, Smartphone } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

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
        } else {
          setWalletData(wallet);
        }
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
    <div className="space-y-6 animate-fade-in">
      {/* Header de boas-vindas */}
      <div className="bg-gradient-to-r from-[#0057FF] to-[#0047CC] text-white p-8 rounded-2xl shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Olá, {userData?.nome || 'Usuário'}! 👋
            </h1>
            <p className="text-blue-100 text-lg mb-4">
              Bem-vindo ao seu Banco Pro
            </p>
            <div className="flex items-center space-x-3">
              <span className="text-sm bg-white bg-opacity-20 px-3 py-1 rounded-full">
                {userData?.tipo === 'PF' ? 'Pessoa Física' : 'Pessoa Jurídica'}
              </span>
              <span className={`text-sm px-3 py-1 rounded-full ${
                userData?.status === 'ativo' 
                  ? 'bg-green-500 bg-opacity-20 text-green-100' 
                  : 'bg-yellow-500 bg-opacity-20 text-yellow-100'
              }`}>
                {userData?.status === 'ativo' ? 'Conta Ativa' : 'Status: ' + userData?.status}
              </span>
            </div>
          </div>
          <div className="text-right opacity-80">
            <div className="text-6xl font-bold">
              {new Date().getDate()}
            </div>
            <div className="text-lg">
              {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
            </div>
          </div>
        </div>
      </div>

      {/* Verificar se o usuário está ativo para mostrar funcionalidades bancárias */}
      {userData?.status !== 'ativo' ? (
        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
          <CardContent className="p-8">
            <div className="text-center">
              <Wallet className="h-16 w-16 text-yellow-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-yellow-800 dark:text-yellow-200 mb-3">
                Conta em Análise
              </h3>
              <p className="text-yellow-700 dark:text-yellow-300 text-lg">
                Suas funcionalidades bancárias serão liberadas após a aprovação da sua conta pela nossa equipe.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Card do Saldo Principal */}
          <Card className="bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-2xl">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium text-slate-300">Saldo Disponível</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleBalanceVisibility}
                  className="text-white hover:bg-white/10"
                >
                  {showBalance ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="text-4xl font-bold mb-2">
                  {showBalance 
                    ? formatCurrency(walletData?.saldo || 0)
                    : '••••••'
                  }
                </div>
                <p className="text-slate-400">
                  Carteira Digital • {walletData?.status || 'Ativa'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Limite Disponível</p>
                  <p className="text-xl font-semibold">
                    {showBalance 
                      ? formatCurrency(walletData?.limite || 0)
                      : '••••••'
                    }
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Rendimento do Mês</p>
                  <p className="text-xl font-semibold text-green-400">
                    {showBalance 
                      ? formatCurrency(walletData?.rendimento_mes || 0)
                      : '••••••'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ações Rápidas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center space-y-2 hover-scale"
                  onClick={() => navigate('/transferir')}
                >
                  <ArrowRight className="h-6 w-6 text-[#0057FF]" />
                  <span className="text-sm font-medium">Transferir</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center space-y-2 hover-scale"
                  onClick={() => navigate('/pagar')}
                >
                  <Smartphone className="h-6 w-6 text-[#0057FF]" />
                  <span className="text-sm font-medium">Pagar</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center space-y-2 hover-scale"
                  onClick={() => navigate('/investir')}
                >
                  <TrendingUp className="h-6 w-6 text-[#0057FF]" />
                  <span className="text-sm font-medium">Investir</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center space-y-2 hover-scale"
                  onClick={() => navigate('/extrato')}
                >
                  <FileText className="h-6 w-6 text-[#0057FF]" />
                  <span className="text-sm font-medium">Extrato</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Cards de informações adicionais */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="hover-scale">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cartões</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
                <p className="text-xs text-muted-foreground">Ativos</p>
              </CardContent>
            </Card>

            <Card className="hover-scale">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Investimentos</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {showBalance ? '+2.5%' : '••••'}
                </div>
                <p className="text-xs text-muted-foreground">Este mês</p>
              </CardContent>
            </Card>

            <Card className="hover-scale">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Transações</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">Este mês</p>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;

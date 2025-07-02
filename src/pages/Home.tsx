import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Eye, EyeOff, ArrowUp, ArrowDown, 
  CreditCard, Smartphone, Send, Receipt,
  Settings, TrendingUp, Gift, Coins,
  Globe, FileText, Building, HelpCircle,
  Wrench, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Home = () => {
  const navigate = useNavigate();
  const [showBalance, setShowBalance] = useState(true);
  const [userRole, setUserRole] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [userBalance, setUserBalance] = useState(0);
  const [isActivatingCrypto, setIsActivatingCrypto] = useState(false);
  const [hasCryptoAccount, setHasCryptoAccount] = useState(false);

  useEffect(() => {
    const getUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: userData } = await supabase
          .from('users')
          .select('role, nome_completo')
          .eq('id', user.id)
          .single();

        if (userData) {
          setUserRole(userData.role);
          setUserName(userData.nome_completo || 'Usuário');
        }

        // Buscar saldo da wallet
        const { data: walletData } = await supabase
          .from('wallets')
          .select('saldo')
          .eq('user_id', user.id)
          .single();

        if (walletData) {
          setUserBalance(walletData.saldo || 0);
        }

        // Verificar se já tem conta cripto
        const { data: cryptoData } = await supabase
          .from('wallets_cripto_binance')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        setHasCryptoAccount(!!cryptoData);
      }
    };

    getUserData();
  }, []);

  const activateCryptoAccount = async () => {
    setIsActivatingCrypto(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Usuário não autenticado');
        return;
      }

      console.log('Ativando conta cripto para usuário:', user.id);

      // Tentar primeiro com supabase.functions.invoke
      try {
        console.log('Tentando via supabase.functions.invoke...');
        const { data, error } = await supabase.functions.invoke('criar-subconta', {
          body: {
            user_id: user.id
          }
        });

        if (error) {
          console.error('Erro com supabase.functions.invoke:', error);
          throw error;
        }

        console.log('Resposta da função:', data);

        if (data?.status === 'ok') {
          // Atualizar o saldo local após ativação
          const { data: walletData } = await supabase
            .from('wallets')
            .select('saldo')
            .eq('user_id', user.id)
            .single();

          if (walletData) {
            setUserBalance(walletData.saldo || 0);
          }

          setHasCryptoAccount(true);
          toast.success('Conta cripto ativada!');
          return;
        } else {
          toast.error(data?.message || 'Erro na ativação da conta cripto');
          return;
        }
      } catch (supabaseError) {
        console.error('Erro ao usar supabase.functions.invoke:', supabaseError);
        console.log('Tentando fetch direto como fallback...');
      }

      // Fallback para fetch direto
      const session = await supabase.auth.getSession();
      const accessToken = session.data.session?.access_token;

      console.log('Fazendo requisição fetch com token:', !!accessToken);

      const response = await fetch('https://hjcvpozwjyydbegrcskq.functions.supabase.co/criar-subconta', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhqY3Zwb3p3anl5ZGJlZ3Jjc2txIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyNDU1NzYsImV4cCI6MjA2NjgyMTU3Nn0.ndEdb2KTe0LfPfFis41H4hU4mNBnlvizcHhYtIBkeUE'
        },
        body: JSON.stringify({
          user_id: user.id
        })
      });

      console.log('Status da resposta fetch:', response.status);
      console.log('Headers da resposta:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erro na resposta fetch:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log('Resultado fetch:', result);
      
      if (result.status === 'ok') {
        // Atualizar o saldo local após ativação
        const { data: walletData } = await supabase
          .from('wallets')
          .select('saldo')
          .eq('user_id', user.id)
          .single();

        if (walletData) {
          setUserBalance(walletData.saldo || 0);
        }

        setHasCryptoAccount(true);
        toast.success('Conta cripto ativada!');
      } else {
        toast.error(result.message || 'Erro na ativação da conta cripto');
      }
    } catch (error) {
      console.error('Erro geral ao ativar conta cripto:', error);
      
      // Fornecer mensagem de erro mais específica
      let errorMessage = 'Erro desconhecido';
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          errorMessage = 'Falha na conexão. Verifique sua internet e tente novamente.';
        } else if (error.message.includes('NetworkError')) {
          errorMessage = 'Erro de rede. Verifique sua conexão.';
        } else {
          errorMessage = error.message;
        }
      }
      
      toast.error(`Erro ao ativar conta cripto: ${errorMessage}`);
    } finally {
      setIsActivatingCrypto(false);
    }
  };

  const quickActions = [
    { icon: Smartphone, label: 'Pix', path: '/pix', color: 'text-purple-600' },
    { icon: Send, label: 'Transferir', path: '/transferir', color: 'text-blue-600' },
    { icon: Receipt, label: 'Pagar', path: '/pagar', color: 'text-green-600' },
    { icon: ArrowDown, label: 'Cobrança', path: '/cobranca', color: 'text-orange-600' },
  ];

  const services = [
    { icon: CreditCard, label: 'Cartões', path: '/cartoes' },
    { icon: TrendingUp, label: 'Investir', path: '/investir' },
    { icon: Building, label: 'Financiamento', path: '/financiamento' },
    { icon: Gift, label: 'Gift Cards', path: '/gift-cards' },
    { icon: Coins, label: 'Cofrinho', path: '/cofrinho' },
    { icon: Globe, label: 'Open Finance', path: '/open-finance' },
  ];

  const adminServices = [
    { icon: Globe, label: 'Transações Globais', path: '/transacoes-globais' },
    { icon: FileText, label: 'Auditoria', path: '/auditoria' },
    { icon: ArrowUp, label: 'Realocação de Fundos', path: '/realocacao-fundos' },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="pb-20">
      {/* Header com saldo */}
      <Card className="bg-gradient-to-r from-[#0047AB] to-[#0056CC] text-white mb-6">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-blue-100 text-sm">Olá,</p>
              <h2 className="text-xl font-bold">{userName}</h2>
              {userRole && (
                <Badge variant="secondary" className="mt-1 bg-white/20 text-white">
                  {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                </Badge>
              )}
            </div>
            
            {/* Ícone do painel admin para dono/admin */}
            {['dono', 'admin'].includes(userRole) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/admin')}
                className="text-white hover:bg-white/20"
                title="Painel Administrativo"
              >
                <Wrench className="h-5 w-5" />
              </Button>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Saldo disponível</p>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold">
                  {showBalance ? formatCurrency(userBalance) : '••••••'}
                </span>
                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className="text-blue-100 hover:text-white"
                >
                  {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Botão Ativar Conta Cripto */}
          {!hasCryptoAccount && (
            <div className="mt-4 pt-4 border-t border-white/20">
              <Button
                onClick={activateCryptoAccount}
                disabled={isActivatingCrypto}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                {isActivatingCrypto ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Coins className="h-4 w-4 mr-2" />
                )}
                Ativar Conta Cripto
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ações rápidas */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Ações rápidas</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-20 flex-col space-y-2 hover:shadow-md transition-shadow"
              onClick={() => navigate(action.path)}
            >
              <action.icon className={`h-6 w-6 ${action.color}`} />
              <span className="text-xs font-medium">{action.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Serviços */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Serviços</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {services.map((service, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-16 flex-col space-y-1 hover:shadow-md transition-shadow"
              onClick={() => navigate(service.path)}
            >
              <service.icon className="h-5 w-5 text-gray-600" />
              <span className="text-xs">{service.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Serviços administrativos para dono/admin */}
      {['dono', 'admin'].includes(userRole) && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Administração</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {adminServices.map((service, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-16 flex-col space-y-1 hover:shadow-md transition-shadow border-orange-200 hover:border-orange-300"
                onClick={() => navigate(service.path)}
              >
                <service.icon className="h-5 w-5 text-orange-600" />
                <span className="text-xs">{service.label}</span>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Acesso rápido */}
      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          className="h-12 justify-start space-x-2"
          onClick={() => navigate('/extrato')}
        >
          <FileText className="h-4 w-4 text-gray-600" />
          <span>Extrato</span>
        </Button>
        <Button
          variant="outline"
          className="h-12 justify-start space-x-2"
          onClick={() => navigate('/ajuda')}
        >
          <HelpCircle className="h-4 w-4 text-gray-600" />
          <span>Ajuda</span>
        </Button>
      </div>
    </div>
  );
};

export default Home;

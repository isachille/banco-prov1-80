
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, Send, Receipt, Car, 
  TrendingUp, Gift, PiggyBank, Eye, EyeOff 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Dashboard = () => {
  const navigate = useNavigate();
  const [showBalance, setShowBalance] = useState(true);
  const [balance, setBalance] = useState(0);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Buscar dados do usuário
        const { data: userData } = await supabase
          .from('users')
          .select('nome_completo')
          .eq('id', user.id)
          .single();
        
        if (userData) {
          setUserName(userData.nome_completo || 'Usuário');
        }

        // Buscar saldo na carteira Binance
        const { data: walletData } = await supabase
          .from('binance_wallets')
          .select('balance')
          .eq('user_id', user.id)
          .single();

        if (walletData) {
          setBalance(walletData.balance || 0);
        }
      }
    };

    fetchUserData();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const quickActions = [
    { 
      icon: Receipt, 
      label: 'Ver Extrato', 
      path: '/extrato',
      color: 'text-blue-600' 
    },
    { 
      icon: Send, 
      label: 'Enviar PIX', 
      path: '/pix',
      color: 'text-green-600' 
    },
    { 
      icon: CreditCard, 
      label: 'Transferir', 
      path: '/transferencias',
      color: 'text-purple-600' 
    },
    { 
      icon: Car, 
      label: 'Financiar Veículo', 
      path: '/financiamento',
      color: 'text-orange-600' 
    }
  ];

  const services = [
    { icon: Gift, label: 'Gift Cards', path: '/gift-cards' },
    { icon: PiggyBank, label: 'Cofrinho', path: '/cofrinho' },
    { icon: TrendingUp, label: 'Investimentos', path: '/investimentos' }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header com saldo */}
      <Card className="bg-gradient-to-r from-[#0047AB] to-[#0056CC] text-white">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-blue-100 text-sm">Olá,</p>
              <h2 className="text-xl font-bold">{userName}</h2>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Saldo Disponível</p>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold">
                  {showBalance ? formatCurrency(balance) : '••••••'}
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
        </CardContent>
      </Card>

      {/* Ações rápidas */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Ações Rápidas</h3>
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
      <div>
        <h3 className="text-lg font-semibold mb-4">Serviços</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
    </div>
  );
};

export default Dashboard;

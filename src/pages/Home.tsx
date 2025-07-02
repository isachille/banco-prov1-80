
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Eye, EyeOff, ArrowUp, ArrowDown, 
  CreditCard, Smartphone, Send, Receipt,
  Settings, TrendingUp, Gift, Coins,
  Globe, FileText, Building, HelpCircle,
  Wrench
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

const Home = () => {
  const navigate = useNavigate();
  const [showBalance, setShowBalance] = useState(true);
  const [userRole, setUserRole] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [userBalance, setUserBalance] = useState(0);

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
      }
    };

    getUserData();
  }, []);

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

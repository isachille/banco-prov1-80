
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, FileText, Smartphone, ArrowRightLeft, 
  CreditCard, Receipt, Archive, Users, Building2, 
  BarChart3, User, Settings, Send, 
  TrendingUp, TrendingDown, Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface WalletAtiva {
  wallet_id: string;
  user_id: string;
  nome_completo: string;
  email: string;
  cpf: string;
  telefone: string;
  role: string;
  tipo: string;
  status: string;
  saldo: number;
  limite: number;
  rendimento_mes: number;
}

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [transferValues, setTransferValues] = useState<Record<string, string>>({});
  const [transferDestinations, setTransferDestinations] = useState<Record<string, string>>({});

  // Verificar permissão de acesso
  useEffect(() => {
    const checkUserPermission = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      if (!userData || (userData.role !== 'admin' && userData.role !== 'dono')) {
        navigate('/home');
        return;
      }
    };

    checkUserPermission();
  }, [navigate]);

  // Buscar usuários ativos
  const { data: walletsAtivas, isLoading, refetch } = useQuery({
    queryKey: ['wallets_ativas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('wallets_ativas')
        .select('*')
        .order('nome_completo');

      if (error) throw error;
      return data as WalletAtiva[];
    }
  });

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'extrato', label: 'Extrato', icon: FileText },
    { id: 'pix', label: 'Pix', icon: Smartphone },
    { id: 'transferencias', label: 'Transferências', icon: ArrowRightLeft },
    { id: 'pagamentos', label: 'Pagamentos', icon: CreditCard },
    { id: 'cobrancas', label: 'Cobranças', icon: Receipt },
    { id: 'arquivos', label: 'Arquivos', icon: Archive },
    { id: 'cedentes', label: 'Cedentes / Pagadores', icon: Users },
    { id: 'bureaux', label: 'Bureaux', icon: Building2 },
    { id: 'relatorios', label: 'Relatórios', icon: BarChart3 },
    { id: 'conta', label: 'Conta / Faturamento', icon: User },
    { id: 'configuracoes', label: 'Configurações', icon: Settings },
  ];

  const summaryCards = [
    {
      title: 'Saldo disponível',
      value: 'R$ 1.500.673,45',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Cobranças a vencer',
      value: 'R$ 900.432,34',
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Cobranças vencidas',
      value: 'R$ 2.234,67',
      icon: TrendingDown,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  ];

  const handleTransferencia = async (userId: string) => {
    const valor = parseFloat(transferValues[userId]);
    const destinatarioId = transferDestinations[userId];

    if (!valor || valor <= 0) {
      toast({
        title: "Erro",
        description: "Valor deve ser maior que zero",
        variant: "destructive",
      });
      return;
    }

    if (!destinatarioId) {
      toast({
        title: "Erro",
        description: "Selecione um destinatário",
        variant: "destructive",
      });
      return;
    }

    if (destinatarioId === userId) {
      toast({
        title: "Erro",
        description: "Não é possível transferir para a mesma conta",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase.rpc('transferir_saldo', {
        p_de: userId,
        p_para: destinatarioId,
        p_valor: valor
      });

      if (error) throw error;

      toast({
        title: "✅ Transferência realizada com sucesso",
        description: `Valor: R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      });

      // Limpar campos
      setTransferValues(prev => ({ ...prev, [userId]: '' }));
      setTransferDestinations(prev => ({ ...prev, [userId]: '' }));

      // Atualizar lista
      refetch();
    } catch (error: any) {
      toast({
        title: "Erro na transferência",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r border-gray-200 shadow-sm">
        <div className="flex items-center h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-[#0057FF] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">BP</span>
            </div>
            <span className="text-xl font-bold text-[#0057FF]">Banco Pro</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
              className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                activeMenu === item.id
                  ? 'bg-[#0057FF] text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="grid grid-cols-4 gap-1 p-2">
          {menuItems.slice(0, 4).map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
              className={`flex flex-col items-center p-2 rounded-lg ${
                activeMenu === item.id
                  ? 'bg-[#0057FF] text-white'
                  : 'text-gray-600'
              }`}
            >
              <item.icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium truncate">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64 pb-20 lg:pb-0">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
            <p className="text-gray-600 mt-1">Gerenciamento de carteiras e transferências</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {summaryCards.map((card, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">{card.title}</p>
                      <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
                    </div>
                    <div className={`w-12 h-12 ${card.bgColor} rounded-lg flex items-center justify-center`}>
                      <card.icon className={`w-6 h-6 ${card.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Wallets Ativas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Carteiras Ativas - Transferências
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {walletsAtivas?.map((wallet) => (
                  <Card key={wallet.user_id} className="border border-gray-200 hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {/* Informações do usuário */}
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900">{wallet.nome_completo}</h3>
                          <p className="text-sm text-gray-600">{wallet.email}</p>
                          <p className="text-sm text-gray-600">{wallet.telefone}</p>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              {wallet.role}
                            </span>
                            <span className="text-lg font-bold text-green-600">
                              R$ {wallet.saldo?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
                            </span>
                          </div>
                        </div>

                        {/* Campos de transferência */}
                        <div className="space-y-3 pt-4 border-t border-gray-200">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Valor da Transferência
                            </label>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="0,00"
                              value={transferValues[wallet.user_id] || ''}
                              onChange={(e) =>
                                setTransferValues(prev => ({
                                  ...prev,
                                  [wallet.user_id]: e.target.value
                                }))
                              }
                              className="w-full"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Destinatário
                            </label>
                            <Select
                              value={transferDestinations[wallet.user_id] || ''}
                              onValueChange={(value) =>
                                setTransferDestinations(prev => ({
                                  ...prev,
                                  [wallet.user_id]: value
                                }))
                              }
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecionar destinatário" />
                              </SelectTrigger>
                              <SelectContent>
                                {walletsAtivas
                                  ?.filter(w => w.user_id !== wallet.user_id)
                                  .map((destinatario) => (
                                    <SelectItem key={destinatario.user_id} value={destinatario.user_id}>
                                      {destinatario.nome_completo}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <Button
                            onClick={() => handleTransferencia(wallet.user_id)}
                            className="w-full bg-[#0057FF] hover:bg-blue-700"
                            disabled={!transferValues[wallet.user_id] || !transferDestinations[wallet.user_id]}
                          >
                            <Send className="w-4 h-4 mr-2" />
                            Transferir Saldo
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {!walletsAtivas?.length && (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma carteira ativa encontrada</h3>
                  <p className="text-gray-500">Não há usuários ativos no sistema no momento.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Admin;

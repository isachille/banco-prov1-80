
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, FileText, Smartphone, ArrowRightLeft, 
  CreditCard, Receipt, Archive, Users, Building2, 
  BarChart3, User, Settings, Send, 
  TrendingUp, TrendingDown, Calendar, UserCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface Usuario {
  id: string;
  email: string;
  nome_completo: string;
  cpf_cnpj: string;
  telefone: string;
  role: string;
  tipo: string;
  status: string;
  created_at: string;
}

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
  const queryClient = useQueryClient();
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [transferValues, setTransferValues] = useState<Record<string, string>>({});
  const [transferDestinations, setTransferDestinations] = useState<Record<string, string>>({});
  const [updatingUsers, setUpdatingUsers] = useState<Set<string>>(new Set());
  const [filtro, setFiltro] = useState('');

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

      if (!userData || !['admin', 'dono'].includes(userData.role)) {
        toast.error('Acesso negado. Você não tem permissão para acessar esta área.');
        navigate('/home');
        return;
      }
    };

    checkUserPermission();
  }, [navigate]);

  // Buscar usuários pendentes
  const { data: usuariosPendentes = [], isLoading: loadingPendentes, refetch: refetchPendentes } = useQuery({
    queryKey: ['usuarios_pendentes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('status', 'pendente')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Usuario[];
    },
    refetchInterval: 5000,
  });

  // Buscar usuários ativos para transferências
  const { data: walletsAtivas = [], isLoading: loadingWallets, refetch: refetchWallets } = useQuery({
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
    { id: 'usuarios', label: 'Ativação de Usuários', icon: UserCheck },
    { id: 'extrato', label: 'Extrato', icon: FileText },
    { id: 'pix', label: 'Pix', icon: Smartphone },
    { id: 'transferencias', label: 'Transferências', icon: ArrowRightLeft },
    { id: 'pagamentos', label: 'Pagamentos', icon: CreditCard },
    { id: 'cobrancas', label: 'Cobranças', icon: Receipt },
    { id: 'relatorios', label: 'Relatórios', icon: BarChart3 },
    { id: 'conta', label: 'Conta / Faturamento', icon: User },
    { id: 'configuracoes', label: 'Configurações', icon: Settings },
  ];

  const summaryCards = [
    {
      title: 'Usuários Pendentes',
      value: usuariosPendentes.length.toString(),
      icon: UserCheck,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Saldo Total',
      value: `R$ ${walletsAtivas.reduce((sum, w) => sum + (w.saldo || 0), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Usuários Ativos',
      value: walletsAtivas.length.toString(),
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
  ];

  const ativarUsuario = async (userId: string) => {
    if (updatingUsers.has(userId)) return;
    
    setUpdatingUsers(prev => new Set(prev).add(userId));
    
    try {
      const { error } = await supabase
        .from('users')
        .update({ status: 'ativo' })
        .eq('id', userId);

      if (error) throw error;

      toast.success('Conta ativada com sucesso!');
      refetchPendentes();
      refetchWallets();
      
    } catch (error: any) {
      console.error('Erro ao ativar usuário:', error);
      toast.error('Erro ao ativar conta');
    } finally {
      setUpdatingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  const alterarPermissao = async (userId: string, novaRole: string) => {
    if (updatingUsers.has(userId)) return;
    
    setUpdatingUsers(prev => new Set(prev).add(userId));
    
    try {
      const { error } = await supabase
        .from('users')
        .update({ role: novaRole })
        .eq('id', userId);

      if (error) throw error;

      toast.success(`Permissão atualizada para ${novaRole}`);
      refetchPendentes();
      
    } catch (error: any) {
      console.error('Erro ao alterar permissão:', error);
      toast.error('Erro ao alterar permissão');
    } finally {
      setUpdatingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  const handleTransferencia = async (userId: string) => {
    const valor = parseFloat(transferValues[userId]);
    const destinatarioId = transferDestinations[userId];

    if (!valor || valor <= 0) {
      toast.error('Valor deve ser maior que zero');
      return;
    }

    if (!destinatarioId) {
      toast.error('Selecione um destinatário');
      return;
    }

    if (destinatarioId === userId) {
      toast.error('Não é possível transferir para a mesma conta');
      return;
    }

    try {
      const { data, error } = await supabase.rpc('transferir_saldo', {
        p_de: userId,
        p_para: destinatarioId,
        p_valor: valor
      });

      if (error) throw error;

      toast.success(`Transferência de R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} realizada com sucesso!`);

      // Limpar campos
      setTransferValues(prev => ({ ...prev, [userId]: '' }));
      setTransferDestinations(prev => ({ ...prev, [userId]: '' }));

      // Atualizar lista
      refetchWallets();
    } catch (error: any) {
      toast.error(error.message || 'Erro na transferência');
    }
  };

  const usuariosFiltrados = usuariosPendentes.filter(usuario => {
    if (filtro.trim() === '') return true;
    
    const termoBusca = filtro.toLowerCase();
    return (
      usuario.nome_completo?.toLowerCase().includes(termoBusca) ||
      usuario.email?.toLowerCase().includes(termoBusca) ||
      usuario.cpf_cnpj?.includes(filtro.replace(/\D/g, ''))
    );
  });

  const formatarDocumento = (documento: string, tipo: string) => {
    if (!documento) return 'Não informado';
    
    if (tipo === 'PF' && documento.length === 11) {
      return documento.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (tipo === 'PJ' && documento.length === 14) {
      return documento.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    return documento;
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'dono': return 'bg-purple-100 text-purple-800';
      case 'admin': return 'bg-red-100 text-red-800';
      case 'gerente': return 'bg-blue-100 text-blue-800';
      case 'analista': return 'bg-green-100 text-green-800';
      case 'usuario': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderContent = () => {
    switch (activeMenu) {
      case 'usuarios':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Ativação de Usuários</h2>
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Buscar por nome, email ou documento..."
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                  className="w-80"
                />
                {filtro && (
                  <Button variant="outline" size="sm" onClick={() => setFiltro('')}>
                    Limpar
                  </Button>
                )}
              </div>
            </div>

            {loadingPendentes ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0057FF] mx-auto"></div>
                <p className="mt-2">Carregando usuários...</p>
              </div>
            ) : usuariosFiltrados.length === 0 ? (
              <div className="text-center py-8">
                <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  {filtro ? 'Nenhum usuário encontrado' : 'Nenhum usuário pendente no momento'}
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {usuariosFiltrados.map((usuario) => (
                  <Card key={usuario.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-lg">{usuario.nome_completo}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs ${getRoleBadgeColor(usuario.role)}`}>
                              {usuario.role}
                            </span>
                          </div>
                          <p className="text-gray-600">{usuario.email}</p>
                          <p className="text-sm text-gray-500">
                            {usuario.tipo === 'PF' ? 'CPF' : 'CNPJ'}: {formatarDocumento(usuario.cpf_cnpj, usuario.tipo)}
                          </p>
                          <p className="text-sm text-gray-500">Tel: {usuario.telefone}</p>
                          <p className="text-xs text-gray-400">
                            Cadastrado em: {new Date(usuario.created_at).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Select
                            value={usuario.role}
                            onValueChange={(value) => alterarPermissao(usuario.id, value)}
                            disabled={updatingUsers.has(usuario.id)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="dono">Dono</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="gerente">Gerente</SelectItem>
                              <SelectItem value="analista">Analista</SelectItem>
                              <SelectItem value="usuario">Usuário</SelectItem>
                            </SelectContent>
                          </Select>
                          
                          <Button
                            onClick={() => ativarUsuario(usuario.id)}
                            disabled={updatingUsers.has(usuario.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            {updatingUsers.has(usuario.id) ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                              'Ativar Conta'
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        );

      case 'transferencias':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Transferências Administrativas</h2>
            
            {loadingWallets ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0057FF] mx-auto"></div>
                <p className="mt-2">Carregando carteiras...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {walletsAtivas.map((wallet) => (
                  <Card key={wallet.user_id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold text-lg">{wallet.nome_completo}</h3>
                          <p className="text-sm text-gray-600">{wallet.email}</p>
                          <p className="text-sm text-gray-600">{wallet.telefone}</p>
                          <div className="flex justify-between items-center mt-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${getRoleBadgeColor(wallet.role)}`}>
                              {wallet.role}
                            </span>
                            <span className="text-lg font-bold text-green-600">
                              R$ {wallet.saldo?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-3 pt-4 border-t">
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="Valor da transferência"
                            value={transferValues[wallet.user_id] || ''}
                            onChange={(e) =>
                              setTransferValues(prev => ({
                                ...prev,
                                [wallet.user_id]: e.target.value
                              }))
                            }
                          />

                          <Select
                            value={transferDestinations[wallet.user_id] || ''}
                            onValueChange={(value) =>
                              setTransferDestinations(prev => ({
                                ...prev,
                                [wallet.user_id]: value
                              }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecionar destinatário" />
                            </SelectTrigger>
                            <SelectContent>
                              {walletsAtivas
                                .filter(w => w.user_id !== wallet.user_id)
                                .map((destinatario) => (
                                  <SelectItem key={destinatario.user_id} value={destinatario.user_id}>
                                    {destinatario.nome_completo}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>

                          <Button
                            onClick={() => handleTransferencia(wallet.user_id)}
                            className="w-full"
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
            )}
          </div>
        );

      case 'pix':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">PIX Administrativo</h2>
            <Card>
              <CardContent className="p-6">
                <p className="text-center text-gray-500 py-8">
                  Funcionalidade PIX em desenvolvimento
                </p>
              </CardContent>
            </Card>
          </div>
        );

      case 'extrato':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Extrato Administrativo</h2>
            <Card>
              <CardContent className="p-6">
                <p className="text-center text-gray-500 py-8">
                  Funcionalidade Extrato em desenvolvimento
                </p>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Dashboard Administrativo</h2>
            
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

            <Card>
              <CardHeader>
                <CardTitle>Resumo do Sistema</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{walletsAtivas.length}</p>
                    <p className="text-sm text-gray-600">Usuários Ativos</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-orange-600">{usuariosPendentes.length}</p>
                    <p className="text-sm text-gray-600">Pendentes</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      R$ {walletsAtivas.reduce((sum, w) => sum + (w.saldo || 0), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-sm text-gray-600">Saldo Total</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-600">
                      {walletsAtivas.filter(w => ['admin', 'dono'].includes(w.role)).length}
                    </p>
                    <p className="text-sm text-gray-600">Administradores</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r border-gray-200 shadow-sm">
        <div className="flex items-center h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-[#0057FF] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">BP</span>
            </div>
            <span className="text-xl font-bold text-[#0057FF]">Banco Pro Admin</span>
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
        
        <div className="p-4 border-t">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate('/home')}
          >
            Voltar ao App
          </Button>
        </div>
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
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Admin;

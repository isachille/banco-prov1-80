
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, DollarSign, TrendingUp, Users, UserCheck, Clock, Shield, AlertTriangle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Fetch estatísticas de usuários
  const { data: estatisticas } = useQuery({
    queryKey: ['admin_estatisticas'],
    queryFn: async () => {
      const [pendentesResult, ativosResult, todosResult] = await Promise.all([
        supabase.from('users').select('*', { count: 'exact' }).eq('status', 'pendente'),
        supabase.from('users').select('*', { count: 'exact' }).eq('status', 'ativo'),
        supabase.from('users').select('*', { count: 'exact' })
      ]);

      return {
        pendentes: pendentesResult.count || 0,
        ativos: ativosResult.count || 0,
        total: todosResult.count || 0,
        usuariosPendentes: pendentesResult.data || []
      };
    },
    refetchInterval: 30000 // Atualização a cada 30 segundos
  });

  // Fetch últimas atividades
  const { data: ultimasAtividades = [] } = useQuery({
    queryKey: ['ultimas_atividades'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('nome_completo, email, status, created_at, updated_at')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    },
    refetchInterval: 30000
  });

  const summaryCards = [
    {
      title: 'Usuários Pendentes',
      value: estatisticas?.pendentes?.toString() || '0',
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      trend: estatisticas?.pendentes > 0 ? 'Requer atenção' : 'Sem pendências',
      action: () => navigate('/admin/users')
    },
    {
      title: 'Usuários Ativos',
      value: estatisticas?.ativos?.toString() || '0',
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      trend: '+12% este mês',
      action: () => navigate('/admin/users')
    },
    {
      title: 'Total de Usuários',
      value: estatisticas?.total?.toString() || '0',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      trend: 'Crescimento constante',
      action: () => navigate('/admin/users')
    },
    {
      title: 'Transações Hoje',
      value: '47',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      trend: '+8.1% vs ontem',
      action: () => navigate('/admin/transferencias')
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Administrativo</h1>
          <p className="text-gray-600 dark:text-gray-400">Visão geral do sistema com atualizações automáticas</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-green-600">
            <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
            <span className="text-sm">Atualização automática ativa</span>
          </div>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={card.action}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <div className={`w-8 h-8 ${card.bgColor} rounded-lg flex items-center justify-center`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${card.color}`}>{card.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{card.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alertas e Notificações */}
      {estatisticas?.pendentes > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <div className="flex-1">
                <h3 className="font-medium text-yellow-800">
                  {estatisticas.pendentes} usuário(s) aguardando aprovação
                </h3>
                <p className="text-sm text-yellow-700">
                  Há contas pendentes que precisam ser analisadas e aprovadas.
                </p>
              </div>
              <Button 
                size="sm" 
                onClick={() => navigate('/admin/users')}
                className="bg-yellow-600 hover:bg-yellow-700"
              >
                Revisar Agora
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Últimas Atividades */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Últimas Atividades
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ultimasAtividades.length === 0 ? (
                <p className="text-center text-gray-500 py-4">Nenhuma atividade recente</p>
              ) : (
                ultimasAtividades.slice(0, 6).map((atividade, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{atividade.nome_completo || 'Usuário'}</p>
                      <p className="text-xs text-gray-600">{atividade.email}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(atividade.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <Badge className={
                      atividade.status === 'ativo' ? 'bg-green-100 text-green-800' :
                      atividade.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }>
                      {atividade.status}
                    </Badge>
                  </div>
                ))
              )}
            </div>
            {ultimasAtividades.length > 6 && (
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => navigate('/admin/users')}
              >
                Ver Todos os Usuários
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Ações Rápidas */}
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              onClick={() => navigate('/admin/users')}
            >
              <UserCheck className="h-4 w-4 mr-2" />
              Gerenciar Usuários
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              onClick={() => navigate('/admin/pix')}
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Transações PIX
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              onClick={() => navigate('/admin/transferencias')}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Transferências
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              onClick={() => navigate('/admin/relatorios')}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Relatórios
            </Button>

            <Button 
              variant="outline" 
              className="w-full justify-start" 
              onClick={() => navigate('/admin/configuracoes')}
            >
              <Shield className="h-4 w-4 mr-2" />
              Configurações
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Status do Sistema */}
      <Card>
        <CardHeader>
          <CardTitle>Status do Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
              <p className="text-sm font-medium">Supabase</p>
              <p className="text-xs text-green-600">Online</p>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
              <p className="text-sm font-medium">API PIX</p>
              <p className="text-xs text-green-600">Pronto</p>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
              <p className="text-sm font-medium">Atualizações</p>
              <p className="text-xs text-green-600">Ativo (30s)</p>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="w-3 h-3 bg-blue-500 rounded-full mx-auto mb-2"></div>
              <p className="text-sm font-medium">Integrações</p>
              <p className="text-xs text-blue-600">Preparado</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;

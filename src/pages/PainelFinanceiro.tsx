
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { DollarSign, TrendingUp, Activity, Calendar, Plus } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface DashboardData {
  totalTransacoes: number;
  valorTotal: number;
  lucroTotal: number;
  transacoesPorMes: Array<{
    mes: string;
    lucro: number;
    transacoes: number;
  }>;
  transacoesRecentes: Array<any>;
}

interface UserProfile {
  id: string;
  nome_completo: string | null;
  email: string;
  cpf: string | null;
}

const PainelFinanceiro = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalTransacoes: 0,
    valorTotal: 0,
    lucroTotal: 0,
    transacoesPorMes: [],
    transacoesRecentes: []
  });
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // Buscar dados do usuário
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, nome_completo, email, cpf')
        .eq('id', user.id)
        .single();

      if (userError && userError.code !== 'PGRST116') {
        throw userError;
      }

      setUserProfile(userData);

      // Buscar dados do dashboard usando nossa API
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await supabase.functions.invoke('api-dashboard', {
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      });

      if (response.error) {
        throw new Error(response.error.message || 'Erro ao carregar dashboard');
      }

      const result = response.data;
      if (result.success) {
        setDashboardData(result.data);
      }

    } catch (error: any) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados do painel');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const adicionarTransacao = async (tipo: 'pix' | 'boleto' | 'ted') => {
    try {
      // Valores de exemplo para cada tipo
      const valores = {
        pix: { valor: 100, taxa_efi: 2.5, taxa_sua: 1.0 },
        boleto: { valor: 250, taxa_efi: 3.5, taxa_sua: 1.5 },
        ted: { valor: 500, taxa_efi: 8.0, taxa_sua: 2.0 }
      };

      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await supabase.functions.invoke('api-transacoes', {
        body: JSON.stringify({
          tipo,
          ...valores[tipo],
          descricao: `Transação ${tipo.toUpperCase()} de teste`
        }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        }
      });

      if (response.error) {
        throw new Error(response.error.message || 'Erro ao criar transação');
      }

      const result = response.data;
      if (result.success) {
        toast.success(`Transação ${tipo.toUpperCase()} criada com sucesso!`);
        fetchDashboardData(); // Recarregar dados
      } else {
        throw new Error(result.error || 'Erro ao criar transação');
      }
      
    } catch (error: any) {
      console.error('Erro ao criar transação:', error);
      toast.error('Erro ao criar transação');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Cadastro Necessário</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Você precisa completar seu cadastro para acessar o painel financeiro.
            </p>
            <Button 
              onClick={() => window.location.href = '/cadastro-efi'}
              className="w-full"
            >
              Completar Cadastro
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Painel Financeiro</h1>
          <p className="text-gray-600">
            Bem-vindo, {userProfile.nome_completo || userProfile.email}! Gerencie suas transações e acompanhe seu lucro.
          </p>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Transações</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.totalTransacoes}</div>
              <p className="text-xs text-muted-foreground">
                transações processadas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat('pt-BR', { 
                  style: 'currency', 
                  currency: 'BRL' 
                }).format(dashboardData.valorTotal)}
              </div>
              <p className="text-xs text-muted-foreground">
                em transações
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lucro Líquido</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {new Intl.NumberFormat('pt-BR', { 
                  style: 'currency', 
                  currency: 'BRL' 
                }).format(dashboardData.lucroTotal)}
              </div>
              <p className="text-xs text-muted-foreground">
                lucro total
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Ações Rápidas */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Criar Transações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={() => adicionarTransacao('pix')}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Criar PIX (R$ 100)
              </Button>
              <Button 
                onClick={() => adicionarTransacao('boleto')}
                className="bg-orange-600 hover:bg-orange-700"
              >
                Criar Boleto (R$ 250)
              </Button>
              <Button 
                onClick={() => adicionarTransacao('ted')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Criar TED (R$ 500)
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Gráfico */}
        {dashboardData.transacoesPorMes.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Lucro por Mês
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  lucro: {
                    label: "Lucro",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dashboardData.transacoesPorMes}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <ChartTooltip 
                      content={<ChartTooltipContent />}
                      formatter={(value: any) => [
                        new Intl.NumberFormat('pt-BR', { 
                          style: 'currency', 
                          currency: 'BRL' 
                        }).format(value),
                        'Lucro'
                      ]}
                    />
                    <Bar dataKey="lucro" fill="var(--color-lucro)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PainelFinanceiro;

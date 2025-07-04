
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, User, Car, Phone, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface PropostaOperador {
  id: string;
  proposta_id: string;
  operador_nome: string;
  operador_telefone: string;
  status: string;
  created_at: string;
  propostas_financiamento: {
    codigo_proposta: string;
    cliente_nome: string;
    cliente_cpf: string;
    veiculo: string;
    valor_veiculo: number;
    valor_parcela: number;
    parcelas: number;
  };
}

const PainelOperador = () => {
  const navigate = useNavigate();
  const [operadorId, setOperadorId] = useState<string | null>(null);

  useEffect(() => {
    const checkOperatorId = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Buscar ID do operador baseado no usuário logado
      const { data: operadorData } = await supabase
        .from('operadores_cadastrados' as any)
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (operadorData) {
        setOperadorId(operadorData.id);
      }
    };

    checkOperatorId();
  }, []);

  const { data: minhasPropostas = [], isLoading } = useQuery({
    queryKey: ['propostas_operador', operadorId],
    queryFn: async () => {
      if (!operadorId) return [];

      try {
        const { data, error } = await supabase
          .from('propostas_operadores' as any)
          .select(`
            *,
            propostas_financiamento (
              codigo_proposta,
              cliente_nome,
              cliente_cpf,
              veiculo,
              valor_veiculo,
              valor_parcela,
              parcelas
            )
          `)
          .eq('operador_id', operadorId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        return (data || []) as PropostaOperador[];
      } catch (error) {
        console.error('Erro ao buscar propostas do operador:', error);
        return [];
      }
    },
    enabled: !!operadorId,
    refetchInterval: 30000, // Atualizar a cada 30 segundos
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const formatPhone = (phone: string) => {
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  if (!operadorId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Acesso Negado</h1>
          <p className="text-gray-600 mb-4">Você não está cadastrado como operador no sistema.</p>
          <Button onClick={() => navigate('/home')}>
            Voltar ao Início
          </Button>
        </div>
      </div>
    );
  }

  const propostasPendentes = minhasPropostas.filter(p => p.status === 'pendente');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#001B3A] to-[#003F5C] text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/home')}
              className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Painel do Operador</h1>
              <p className="text-blue-100">Gerencie seus clientes e propostas</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {propostasPendentes.length > 0 && (
              <div className="relative">
                <Bell className="h-6 w-6" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {propostasPendentes.length}
                </span>
              </div>
            )}
            <img 
              src="/lovable-uploads/4712549c-a705-4aad-8498-4702dc3cdd8f.png" 
              alt="Banco Pro" 
              className="h-12 w-auto"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6">
        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Propostas</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{minhasPropostas.length}</div>
              <p className="text-xs text-muted-foreground">Atribuídas a você</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
              <Bell className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{propostasPendentes.length}</div>
              <p className="text-xs text-muted-foreground">Aguardando contato</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
              <Phone className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {minhasPropostas.filter(p => p.status === 'em_andamento').length}
              </div>
              <p className="text-xs text-muted-foreground">Em atendimento</p>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Propostas */}
        <Card>
          <CardHeader>
            <CardTitle>Minhas Propostas</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0057FF] mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Carregando propostas...</p>
              </div>
            ) : minhasPropostas.length === 0 ? (
              <div className="text-center py-8">
                <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhuma proposta atribuída ainda</p>
              </div>
            ) : (
              <div className="space-y-4">
                {minhasPropostas.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center space-x-2">
                        <Badge variant={item.status === 'pendente' ? 'secondary' : 'default'}>
                          {item.status === 'pendente' ? 'Novo Cliente' : 'Em Atendimento'}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(item.created_at)}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-sm">{item.propostas_financiamento?.codigo_proposta}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-blue-500" />
                          <div>
                            <p className="font-medium">{item.propostas_financiamento?.cliente_nome}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatCPF(item.propostas_financiamento?.cliente_cpf)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Car className="h-4 w-4 text-green-500" />
                          <div>
                            <p className="font-medium">{item.propostas_financiamento?.veiculo}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatCurrency(item.propostas_financiamento?.valor_veiculo)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-purple-500" />
                          <div>
                            <p className="font-medium">
                              {item.propostas_financiamento?.parcelas}x de {formatCurrency(item.propostas_financiamento?.valor_parcela)}
                            </p>
                            <p className="text-sm text-muted-foreground">Parcelas mensais</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-orange-500" />
                          <div>
                            <p className="font-medium">{formatPhone(item.operador_telefone)}</p>
                            <p className="text-sm text-muted-foreground">Contato do operador</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">
                        {item.status === 'pendente' ? 
                          'Cliente aguardando seu contato' : 
                          'Cliente em atendimento'
                        }
                      </div>
                      <Button
                        size="sm"
                        onClick={() => navigate(`/proposta/${item.proposta_id}`)}
                      >
                        Ver Detalhes
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PainelOperador;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Clock, CheckCircle, Eye, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface Proposta {
  id: string;
  codigo_proposta: string;
  cliente_nome: string;
  cliente_cpf: string;
  veiculo: string;
  valor_veiculo: number;
  valor_parcela: number;
  parcelas: number;
  status: string;
  operador_nome?: string;
  operador_telefone?: string;
  created_at: string;
}

interface Operador {
  id: string;
  nome: string;
  telefone: string;
  email?: string;
  ativo: boolean;
}

const FinancingAdmin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedOperator, setSelectedOperator] = useState<{ [key: string]: string }>({});

  // Buscar propostas
  const { data: propostas = [], isLoading: loadingPropostas } = useQuery({
    queryKey: ['propostas_financiamento'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('propostas_financiamento')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Proposta[];
    },
    refetchInterval: 5000, // Atualizar a cada 5 segundos
  });

  // Buscar operadores
  const { data: operadores = [] } = useQuery({
    queryKey: ['operadores_cadastrados'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('operadores_cadastrados')
        .select('*')
        .eq('ativo', true)
        .order('nome');

      if (error) throw error;
      return data as Operador[];
    },
  });

  const atribuirOperador = async (propostaId: string, operadorId: string) => {
    try {
      const { data, error } = await supabase.rpc('atribuir_proposta_operador', {
        p_proposta_id: propostaId,
        p_operador_id: operadorId
      });

      if (error) throw error;

      toast.success('Proposta atribuída ao operador com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['propostas_financiamento'] });
    } catch (error) {
      console.error('Erro ao atribuir operador:', error);
      toast.error('Erro ao atribuir operador à proposta');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      case 'em_andamento': return 'bg-blue-100 text-blue-800';
      case 'aprovado': return 'bg-green-100 text-green-800';
      case 'recusado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const propostalsPendentes = propostas.filter(p => p.status === 'pendente');
  const propostasAndamento = propostas.filter(p => p.status === 'em_andamento');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#001B3A] to-[#003F5C] text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/admin')}
              className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Gestão de Financiamentos</h1>
              <p className="text-blue-100">Propostas e atribuição de operadores</p>
            </div>
          </div>
          <img 
            src="/lovable-uploads/4712549c-a705-4aad-8498-4702dc3cdd8f.png" 
            alt="Banco Pro" 
            className="h-12 w-auto"
          />
        </div>
      </div>

      <div className="container mx-auto p-6">
        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Propostas</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{propostas.length}</div>
              <p className="text-xs text-muted-foreground">Todas as propostas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{propostalsPendentes.length}</div>
              <p className="text-xs text-muted-foreground">Aguardando atribuição</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
              <CheckCircle className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{propostasAndamento.length}</div>
              <p className="text-xs text-muted-foreground">Com operadores</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Operadores Ativos</CardTitle>
              <UserPlus className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{operadores.length}</div>
              <p className="text-xs text-muted-foreground">Disponíveis</p>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Propostas */}
        <Card>
          <CardHeader>
            <CardTitle>Propostas de Financiamento</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingPropostas ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0057FF] mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Carregando propostas...</p>
              </div>
            ) : propostas.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhuma proposta encontrada</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Veículo</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Parcelas</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Operador</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {propostas.map((proposta) => (
                    <TableRow key={proposta.id}>
                      <TableCell className="font-medium">{proposta.codigo_proposta}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{proposta.cliente_nome}</p>
                          <p className="text-sm text-muted-foreground">{formatCPF(proposta.cliente_cpf)}</p>
                        </div>
                      </TableCell>
                      <TableCell>{proposta.veiculo}</TableCell>
                      <TableCell>{formatCurrency(proposta.valor_veiculo)}</TableCell>
                      <TableCell>
                        <div>
                          <p>{proposta.parcelas}x</p>
                          <p className="text-sm text-muted-foreground">{formatCurrency(proposta.valor_parcela)}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(proposta.status)}>
                          {proposta.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {proposta.operador_nome ? (
                          <div>
                            <p className="font-medium">{proposta.operador_nome}</p>
                            <p className="text-sm text-muted-foreground">{proposta.operador_telefone}</p>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Não atribuído</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {proposta.status === 'pendente' && (
                            <div className="flex items-center space-x-2">
                              <Select
                                value={selectedOperator[proposta.id] || ''}
                                onValueChange={(value) => setSelectedOperator(prev => ({ ...prev, [proposta.id]: value }))}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue placeholder="Operador" />
                                </SelectTrigger>
                                <SelectContent>
                                  {operadores.map((operador) => (
                                    <SelectItem key={operador.id} value={operador.id}>
                                      {operador.nome}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Button
                                size="sm"
                                onClick={() => atribuirOperador(proposta.id, selectedOperator[proposta.id])}
                                disabled={!selectedOperator[proposta.id]}
                              >
                                Atribuir
                              </Button>
                            </div>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate(`/proposta/${proposta.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FinancingAdmin;

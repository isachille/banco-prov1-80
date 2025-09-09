import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { 
  Eye, 
  UserCheck, 
  CheckCircle, 
  XCircle, 
  FileText, 
  CreditCard, 
  Send,
  MoreHorizontal,
  ArrowLeft,
  Users,
  Clock,
  UserPlus,
  Check,
  X
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';

interface Proposta {
  id: string;
  codigo: string;
  marca: string;
  modelo: string;
  ano: number;
  valorveiculo: number;
  valorentrada: number;
  parcelas: number;
  valorparcela: number;
  status: string;
  user_id: string;
  operador_id?: string;
  created_at: string;
  user?: {
    nome_completo: string;
    cpf: string;
    email: string;
  } | null;
  operador?: {
    nome: string;
    telefone: string;
  } | null;
}

interface Operador {
  id: string;
  nome: string;
  telefone: string;
  email: string;
}

export const FinancingAdmin: React.FC = () => {
  const navigate = useNavigate();
  const [propostas, setPropostas] = useState<Proposta[]>([]);
  const [operadores, setOperadores] = useState<Operador[]>([]);
  const [selectedOperador, setSelectedOperador] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPropostas();
    fetchOperadores();
  }, []);

  const fetchPropostas = async () => {
    try {
      const { data, error } = await supabase
        .from('propostas_financiamento')
        .select(`
          id,
          codigo,
          marca,
          modelo,
          ano,
          valorveiculo,
          valorentrada,
          parcelas,
          valorparcela,
          status,
          user_id,
          operador_id,
          created_at,
          user:users(nome_completo, cpf, email),
          operador:operadores(nome, telefone)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPropostas((data || []) as unknown as Proposta[]);
    } catch (error) {
      console.error('Erro ao buscar propostas:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar propostas",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchOperadores = async () => {
    try {
      const { data, error } = await supabase
        .from('operadores')
        .select('*')
        .eq('ativo', true)
        .order('nome');

      if (error) throw error;
      setOperadores(data || []);
    } catch (error) {
      console.error('Erro ao buscar operadores:', error);
    }
  };

  const atribuirOperador = async (propostaId: string, operadorId: string) => {
    try {
      const { error } = await supabase
        .from('propostas_financiamento')
        .update({
          operador_id: operadorId,
          status: 'em_andamento',
          updated_at: new Date().toISOString()
        })
        .eq('id', propostaId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Operador atribuído com sucesso!"
      });

      fetchPropostas();
    } catch (error) {
      console.error('Erro ao atribuir operador:', error);
      toast({
        title: "Erro",
        description: "Erro ao atribuir operador",
        variant: "destructive"
      });
    }
  };

  const processarDecisao = async (propostaId: string, decisao: 'aprovado' | 'recusado') => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await supabase.functions.invoke('process-proposal-decision', {
        body: {
          proposal_id: propostaId,
          decision: decisao
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (response.error) throw new Error(response.error.message);

      if (decisao === 'aprovado') {
        toast({
          title: "Sucesso", 
          description: "Proposta aprovada! Agora você pode criar o contrato."
        });
      } else {
        toast({
          title: "Sucesso",
          description: "Proposta recusada com sucesso!"
        });
      }

      fetchPropostas();
    } catch (error) {
      console.error('Erro ao processar decisão:', error);
      toast({
        title: "Erro",
        description: "Erro ao processar proposta",
        variant: "destructive"
      });
    }
  };

  const criarContrato = async (proposta: Proposta) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const codigoContrato = `CONT-${Date.now()}`;
      
      const { data, error } = await supabase
        .from('contratos_financiamento')
        .insert({
          proposta_id: proposta.id,
          user_id: proposta.user_id,
          codigo_contrato: codigoContrato,
          cliente_nome: proposta.user?.nome_completo || '',
          cliente_cpf: proposta.user?.cpf || '',
          banco_promotor: 'Pro Motors',
          link_assinatura: `${window.location.origin}/assinar-contrato/${codigoContrato}`,
        })
        .select()
        .single();

      if (error) throw error;

      // Enviar email do contrato
      await enviarEmailContrato(codigoContrato, proposta.user?.email || '', proposta.user?.nome_completo || '');

      toast({
        title: "Sucesso",
        description: "Contrato criado e enviado por email!"
      });

      navigate(`/assinar-contrato/${codigoContrato}`);
    } catch (error) {
      console.error('Erro ao criar contrato:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar contrato",
        variant: "destructive"
      });
    }
  };

  const enviarEmailContrato = async (codigoContrato: string, clienteEmail: string, clienteNome: string) => {
    try {
      const response = await supabase.functions.invoke('send-contract-email', {
        body: {
          codigo_contrato: codigoContrato,
          cliente_email: clienteEmail,
          cliente_nome: clienteNome
        }
      });

      if (response.error) {
        console.error('Erro ao enviar email:', response.error);
      } else {
        console.log('Email enviado com sucesso:', response.data);
      }
    } catch (error) {
      console.error('Erro ao invocar função de email:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente': return 'bg-yellow-500 text-white';
      case 'em_andamento': return 'bg-blue-500 text-white';
      case 'aprovado': return 'bg-green-500 text-white';
      case 'recusado': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatCPF = (cpf: string) => {
    return cpf?.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') || '';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-lg">Carregando propostas...</div>
      </div>
    );
  }

  const estatisticas = {
    total: propostas.length,
    pendentes: propostas.filter(p => p.status === 'pendente').length,
    emAndamento: propostas.filter(p => p.status === 'em_andamento').length,
    aprovadas: propostas.filter(p => p.status === 'aprovado').length,
  };

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
              <div className="text-2xl font-bold">{estatisticas.total}</div>
              <p className="text-xs text-muted-foreground">Todas as propostas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{estatisticas.pendentes}</div>
              <p className="text-xs text-muted-foreground">Aguardando atribuição</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
              <CheckCircle className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{estatisticas.emAndamento}</div>
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
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Código</th>
                    <th className="text-left p-2">Cliente</th>
                    <th className="text-left p-2">Veículo</th>
                    <th className="text-left p-2">Valor</th>
                    <th className="text-left p-2">Financiamento</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Operador</th>
                    <th className="text-left p-2">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {propostas.map((proposta) => (
                    <tr key={proposta.id} className="border-b">
                      <td className="p-2 font-mono text-sm">{proposta.codigo}</td>
                      <td className="p-2">
                        <div>
                          <div className="font-medium">{proposta.user?.nome_completo}</div>
                          <div className="text-sm text-gray-500">{formatCPF(proposta.user?.cpf || '')}</div>
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="font-medium">{proposta.marca} {proposta.modelo}</div>
                        <div className="text-sm text-gray-500">{proposta.ano}</div>
                      </td>
                      <td className="p-2">{formatCurrency(proposta.valorveiculo)}</td>
                      <td className="p-2">
                        <div>{proposta.parcelas}x {formatCurrency(proposta.valorparcela)}</div>
                        <div className="text-sm text-gray-500">Entrada: {formatCurrency(proposta.valorentrada)}</div>
                      </td>
                      <td className="p-2">
                        <Badge className={getStatusColor(proposta.status)}>
                          {proposta.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </td>
                      <td className="p-2">
                        {proposta.status === 'pendente' ? (
                          <div className="flex gap-2">
                            <Select
                              value={selectedOperador[proposta.id] || ''}
                              onValueChange={(value) => setSelectedOperador({...selectedOperador, [proposta.id]: value})}
                            >
                              <SelectTrigger className="w-40">
                                <SelectValue placeholder="Selecionar" />
                              </SelectTrigger>
                              <SelectContent>
                                {operadores.map((op) => (
                                  <SelectItem key={op.id} value={op.id}>
                                    {op.nome}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button
                              size="sm"
                              onClick={() => atribuirOperador(proposta.id, selectedOperador[proposta.id])}
                              disabled={!selectedOperador[proposta.id]}
                            >
                              <UserCheck className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : proposta.operador ? (
                          <div>
                            <div className="font-medium">{proposta.operador.nome}</div>
                            <div className="text-sm text-gray-500">{proposta.operador.telefone}</div>
                          </div>
                        ) : (
                          <span className="text-gray-400">Não atribuído</span>
                        )}
                      </td>
                      <td className="p-2">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate(`/detalhes-proposta/${proposta.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>

                          {proposta.status === 'em_andamento' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => processarDecisao(proposta.id, 'aprovado')}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => processarDecisao(proposta.id, 'recusado')}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}

                          {proposta.status === 'aprovado' && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button size="sm" variant="outline">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => criarContrato(proposta)}>
                                  <FileText className="mr-2 h-4 w-4" />
                                  Assinar Contrato
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <CreditCard className="mr-2 h-4 w-4" />
                                  Emitir Cobrança
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Send className="mr-2 h-4 w-4" />
                                  Pós Venda
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
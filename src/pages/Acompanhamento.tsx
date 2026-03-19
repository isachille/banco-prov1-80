import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ArrowLeft,
  Search,
  Plus,
  Eye,
  Edit,
  MoreHorizontal,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  AlertCircle,
  Filter,
} from 'lucide-react';

interface AcompanhamentoCliente {
  id: string;
  nome_completo: string;
  cpf: string;
  telefone: string;
  email: string;
  veiculo: string;
  valor_veiculo: number;
  entrada_disponivel: number;
  banco_financeira: string;
  status: string;
  observacoes_internas: string | null;
  pendencias_documentacao: string | null;
  responsavel_atendimento: string;
  etapa_progresso: string;
  created_at: string;
  updated_at: string;
}

const STATUS_LIST = [
  'Aprovado',
  'Ativo',
  'Pendente em análise',
  'Aguardando documentação',
  'Reprovado',
  'Finalizado',
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Aprovado': return 'bg-green-100 text-green-800 border-green-200';
    case 'Ativo': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Pendente em análise': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Aguardando documentação': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'Reprovado': return 'bg-red-100 text-red-800 border-red-200';
    case 'Finalizado': return 'bg-gray-100 text-gray-800 border-gray-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Aprovado': return <CheckCircle className="h-4 w-4 text-green-600" />;
    case 'Ativo': return <Users className="h-4 w-4 text-blue-600" />;
    case 'Pendente em análise': return <Clock className="h-4 w-4 text-yellow-600" />;
    case 'Aguardando documentação': return <FileText className="h-4 w-4 text-orange-600" />;
    case 'Reprovado': return <XCircle className="h-4 w-4 text-red-600" />;
    case 'Finalizado': return <AlertCircle className="h-4 w-4 text-gray-600" />;
    default: return <Clock className="h-4 w-4" />;
  }
};

const formatCPF = (cpf: string) => {
  const digits = cpf.replace(/\D/g, '');
  if (digits.length >= 11) {
    return `***.***.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
  }
  return cpf;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

const Acompanhamento = () => {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState<AcompanhamentoCliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('todos');

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      const { data, error } = await supabase
        .from('acompanhamentos_clientes')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setClientes((data || []) as unknown as AcompanhamentoCliente[]);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      toast.error('Erro ao carregar clientes');
    } finally {
      setLoading(false);
    }
  };

  const atualizarStatus = async (id: string, novoStatus: string) => {
    try {
      const { error } = await supabase
        .from('acompanhamentos_clientes')
        .update({ status: novoStatus, updated_at: new Date().toISOString() } as any)
        .eq('id', id);

      if (error) throw error;
      toast.success(`Status atualizado para "${novoStatus}"`);
      fetchClientes();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status');
    }
  };

  const clientesFiltrados = clientes.filter((c) => {
    const termo = busca.toLowerCase();
    const matchBusca =
      !termo ||
      c.nome_completo.toLowerCase().includes(termo) ||
      c.cpf.includes(busca.replace(/\D/g, '')) ||
      c.veiculo.toLowerCase().includes(termo) ||
      c.telefone.includes(busca.replace(/\D/g, ''));
    const matchStatus = filtroStatus === 'todos' || c.status === filtroStatus;
    return matchBusca && matchStatus;
  });

  const estatisticas = {
    total: clientes.length,
    aprovados: clientes.filter((c) => c.status === 'Aprovado').length,
    pendentes: clientes.filter((c) => c.status === 'Pendente em análise').length,
    aguardando: clientes.filter((c) => c.status === 'Aguardando documentação').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-lg">Carregando acompanhamentos...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#001B3A] to-[#003F5C] text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/painel-admin')}
              className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Acompanhamento de Clientes</h1>
              <p className="text-blue-100">CRM interno de propostas</p>
            </div>
          </div>
          <img
            src="/lovable-uploads/4712549c-a705-4aad-8498-4702dc3cdd8f.png"
            alt="Banco Pro"
            className="h-12 w-auto"
          />
        </div>
      </div>

      <div className="container mx-auto p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{estatisticas.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aprovados</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{estatisticas.aprovados}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{estatisticas.pendentes}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aguardando Docs</CardTitle>
              <FileText className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{estatisticas.aguardando}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search + Filter + CTA */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, CPF, veículo ou telefone..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filtroStatus} onValueChange={setFiltroStatus}>
            <SelectTrigger className="w-full md:w-56">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filtrar status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os status</SelectItem>
              {STATUS_LIST.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => navigate('/acompanhamento/novo')} className="bg-[#0047AB] hover:bg-[#003580]">
            <Plus className="h-4 w-4 mr-2" /> Cadastrar Cliente
          </Button>
        </div>

        {/* Listing */}
        <Card>
          <CardHeader>
            <CardTitle>Propostas ({clientesFiltrados.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {clientesFiltrados.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum cliente encontrado</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="p-3 font-medium text-sm">Cliente</th>
                      <th className="p-3 font-medium text-sm">CPF</th>
                      <th className="p-3 font-medium text-sm">Veículo</th>
                      <th className="p-3 font-medium text-sm">Valor</th>
                      <th className="p-3 font-medium text-sm">Status</th>
                      <th className="p-3 font-medium text-sm">Atualizado</th>
                      <th className="p-3 font-medium text-sm">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientesFiltrados.map((c) => (
                      <tr key={c.id} className="border-b hover:bg-muted/50 transition-colors">
                        <td className="p-3">
                          <div className="font-medium">{c.nome_completo}</div>
                          <div className="text-xs text-muted-foreground">{c.telefone}</div>
                        </td>
                        <td className="p-3 font-mono text-sm">{formatCPF(c.cpf)}</td>
                        <td className="p-3 text-sm">{c.veiculo}</td>
                        <td className="p-3 text-sm">{formatCurrency(c.valor_veiculo)}</td>
                        <td className="p-3">
                          <Badge variant="outline" className={getStatusColor(c.status)}>
                            {getStatusIcon(c.status)}
                            <span className="ml-1">{c.status}</span>
                          </Badge>
                        </td>
                        <td className="p-3 text-sm text-muted-foreground">
                          {new Date(c.updated_at).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="p-3">
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline" onClick={() => navigate(`/acompanhamento/${c.id}`)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => navigate(`/acompanhamento/editar/${c.id}`)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button size="sm" variant="outline">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {STATUS_LIST.map((s) => (
                                  <DropdownMenuItem
                                    key={s}
                                    onClick={() => atualizarStatus(c.id, s)}
                                    disabled={c.status === s}
                                  >
                                    {getStatusIcon(s)}
                                    <span className="ml-2">{s}</span>
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Acompanhamento;

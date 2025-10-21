
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle, Eye, Calendar, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Proposta {
  id: string;
  codigo: string;
  usuario_id: string;
  cliente_nome: string;
  veiculo: string;
  valor_veiculo: number;
  valor_parcela: number;
  parcelas: number;
  status: string;
  created_at: string;
  operador?: {
    nome: string;
    telefone: string;
  };
}

const PropostasHistorico = () => {
  const navigate = useNavigate();
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [propostas, setPropostas] = useState<Proposta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPropostas();
  }, []);

  const loadPropostas = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Usuário não autenticado');
        return;
      }

      const { data, error } = await supabase
        .from('propostas_financiamento')
        .select(`
          id,
          codigo,
          user_id,
          marca,
          modelo,
          ano,
          valorveiculo,
          valorentrada,
          parcelas,
          valorparcela,
          status,
          created_at,
          operador_id
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const { data: userData } = await supabase
        .from('users')
        .select('nome_completo')
        .eq('id', user.id)
        .single();

      const propostasFormatadas = data?.map(p => ({
        id: p.id,
        codigo: p.codigo,
        usuario_id: p.user_id,
        cliente_nome: userData?.nome_completo || '',
        veiculo: `${p.marca} ${p.modelo} ${p.ano}`,
        valor_veiculo: p.valorveiculo,
        valor_parcela: p.valorparcela,
        parcelas: p.parcelas,
        status: p.status,
        created_at: p.created_at
      })) || [];

      setPropostas(propostasFormatadas);
    } catch (error) {
      console.error('Erro ao carregar propostas:', error);
      toast.error('Erro ao carregar propostas');
    } finally {
      setLoading(false);
    }
  };

  const propostasFiltradas = filtroStatus === 'todos' 
    ? propostas 
    : propostas.filter((p: Proposta) => p.status === filtroStatus);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      case 'em_andamento': return 'bg-blue-100 text-blue-800';
      case 'aprovado': return 'bg-green-100 text-green-800';
      case 'recusado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pendente': return 'Pendente';
      case 'em_andamento': return 'Em Andamento';
      case 'aprovado': return 'Aprovado';
      case 'recusado': return 'Recusado';
      default: return status;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
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
              <h1 className="text-2xl font-bold">Minhas Propostas</h1>
              <p className="text-blue-100">Acompanhe suas propostas de financiamento</p>
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
        {/* Filtros */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold">Filtrar por status:</h2>
            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="em_andamento">Em Andamento</SelectItem>
                <SelectItem value="aprovado">Aprovado</SelectItem>
                <SelectItem value="recusado">Recusado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-sm text-muted-foreground">
            {propostasFiltradas.length} proposta(s) encontrada(s)
          </p>
        </div>

        {/* Lista de Propostas */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0057FF] mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Carregando propostas...</p>
          </div>
        ) : propostasFiltradas.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma proposta encontrada</h3>
              <p className="text-muted-foreground mb-4">
                {filtroStatus === 'todos' 
                  ? 'Você ainda não possui propostas de financiamento.'
                  : `Não há propostas com status "${getStatusText(filtroStatus)}".`
                }
              </p>
              <Button onClick={() => navigate('/simulacao')}>
                Fazer Nova Simulação
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {propostasFiltradas.map((proposta: Proposta) => (
              <Card key={proposta.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-[#0057FF] bg-opacity-10 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-[#0057FF]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{proposta.codigo}</h3>
                        <p className="text-sm text-muted-foreground">{proposta.cliente_nome}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(proposta.status)}>
                        {getStatusText(proposta.status)}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          if (proposta.status === 'aprovado') {
                            navigate(`/proposta-aprovada/${proposta.id}`);
                          } else if (proposta.status === 'recusado') {
                            navigate(`/proposta-recusada/${proposta.id}`);
                          } else {
                            navigate(`/proposta/${proposta.id}`);
                          }
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Ver Detalhes
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Veículo</p>
                      <p className="font-medium">{proposta.veiculo}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Valor do Veículo</p>
                      <p className="font-medium">{formatCurrency(proposta.valor_veiculo)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Parcelas</p>
                      <p className="font-medium">
                        {proposta.parcelas}x de {formatCurrency(proposta.valor_parcela)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Data</p>
                      <p className="font-medium flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(proposta.created_at)}
                      </p>
                    </div>
                  </div>

                  {proposta.operador && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm text-muted-foreground">
                        Operador responsável: <span className="font-medium text-foreground">{proposta.operador.nome}</span>
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PropostasHistorico;

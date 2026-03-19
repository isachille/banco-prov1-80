import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeft,
  Edit,
  User,
  Car,
  FileText,
  MessageSquare,
  CheckCircle,
  Circle,
  Printer,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';

const ETAPAS = [
  'Cadastro realizado',
  'Em análise',
  'Documentação solicitada',
  'Documentação recebida',
  'Aprovado',
  'Contrato emitido',
  'Finalizado',
];

const STATUS_OPTIONS = [
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

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

const formatCPF = (cpf: string) => {
  const d = cpf?.replace(/\D/g, '');
  if (d?.length === 11) return `${d.slice(0,3)}.${d.slice(3,6)}.${d.slice(6,9)}-${d.slice(9)}`;
  return cpf;
};

const AcompanhamentoDetalhes = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [cliente, setCliente] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchCliente();
  }, [id]);

  const fetchCliente = async () => {
    const { data, error } = await supabase
      .from('acompanhamentos_clientes')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      toast.error('Cliente não encontrado');
      navigate('/acompanhamento');
      return;
    }
    setCliente(data);
    setLoading(false);
  };

  const updateEtapa = async (novaEtapa: string) => {
    setUpdating(true);
    const { error } = await supabase
      .from('acompanhamentos_clientes')
      .update({ etapa_progresso: novaEtapa, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) {
      toast.error('Erro ao atualizar etapa');
    } else {
      toast.success(`Etapa atualizada: ${novaEtapa}`);
      setCliente((prev: any) => ({ ...prev, etapa_progresso: novaEtapa, updated_at: new Date().toISOString() }));
    }
    setUpdating(false);
  };

  const updateStatus = async (novoStatus: string) => {
    setUpdating(true);
    const { error } = await supabase
      .from('acompanhamentos_clientes')
      .update({ status: novoStatus, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) {
      toast.error('Erro ao atualizar status');
    } else {
      toast.success(`Status atualizado: ${novoStatus}`);
      setCliente((prev: any) => ({ ...prev, status: novoStatus, updated_at: new Date().toISOString() }));
    }
    setUpdating(false);
  };

  const etapaAtualIndex = cliente ? ETAPAS.indexOf(cliente.etapa_progresso) : -1;

  const avancarEtapa = () => {
    if (etapaAtualIndex < ETAPAS.length - 1) updateEtapa(ETAPAS[etapaAtualIndex + 1]);
  };

  const voltarEtapa = () => {
    if (etapaAtualIndex > 0) updateEtapa(ETAPAS[etapaAtualIndex - 1]);
  };

  if (loading || !cliente) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-[#001B3A] to-[#003F5C] text-white p-6 print:bg-white print:text-black">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/acompanhamento')}
              className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors print:hidden"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Detalhes do Cliente</h1>
              <p className="text-blue-100 print:text-gray-600">{cliente.nome_completo}</p>
            </div>
          </div>
          <div className="flex gap-2 print:hidden">
            <Button variant="outline" className="text-white border-white/30 hover:bg-white/10" onClick={() => window.print()}>
              <Printer className="h-4 w-4 mr-2" /> Imprimir
            </Button>
            <Button variant="outline" className="text-white border-white/30 hover:bg-white/10" onClick={() => navigate(`/acompanhamento/editar/${id}`)}>
              <Edit className="h-4 w-4 mr-2" /> Editar
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6 space-y-6 max-w-5xl">
        <div className="hidden print:flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold">Banco PRO - Acompanhamento de Proposta</h2>
            <p className="text-sm text-gray-500">Gerado em {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}</p>
          </div>
          <img src="/lovable-uploads/4712549c-a705-4aad-8498-4702dc3cdd8f.png" alt="Banco Pro" className="h-10" />
        </div>

        {/* Status + Alterar */}
        <Card className="border-2">
          <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Status Atual</p>
              <Badge variant="outline" className={`text-lg px-4 py-2 ${getStatusColor(cliente.status)}`}>
                {cliente.status}
              </Badge>
            </div>
            <div className="print:hidden">
              <p className="text-sm text-muted-foreground mb-1">Alterar Status</p>
              <Select value={cliente.status} onValueChange={updateStatus} disabled={updating}>
                <SelectTrigger className="w-[220px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Responsável</p>
              <p className="font-semibold">{cliente.responsavel_atendimento || '—'}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Última Atualização</p>
              <p className="font-semibold">{new Date(cliente.updated_at).toLocaleDateString('pt-BR')}</p>
            </div>
          </CardContent>
        </Card>

        {/* Progresso */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Progresso da Proposta</CardTitle>
              <div className="flex gap-2 print:hidden">
                <Button size="sm" variant="outline" onClick={voltarEtapa} disabled={updating || etapaAtualIndex <= 0}>
                  <ChevronLeft className="h-4 w-4 mr-1" /> Voltar
                </Button>
                <Button size="sm" onClick={avancarEtapa} disabled={updating || etapaAtualIndex >= ETAPAS.length - 1}>
                  Avançar <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground print:hidden">
              Etapa atual: <span className="font-semibold text-foreground">{cliente.etapa_progresso}</span>
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between overflow-x-auto pb-2">
              {ETAPAS.map((etapa, i) => {
                const concluida = i <= etapaAtualIndex;
                const atual = i === etapaAtualIndex;
                return (
                  <div key={etapa} className="flex flex-col items-center min-w-[100px] relative">
                    {i > 0 && (
                      <div className={`absolute top-4 -left-1/2 w-full h-0.5 ${i <= etapaAtualIndex ? 'bg-green-500' : 'bg-gray-200'}`} />
                    )}
                    <button
                      onClick={() => !updating && updateEtapa(etapa)}
                      disabled={updating}
                      className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all print:pointer-events-none ${
                        concluida ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                      } ${atual ? 'ring-4 ring-green-200' : ''} cursor-pointer`}
                      title={`Ir para: ${etapa}`}
                    >
                      {concluida ? <CheckCircle className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                    </button>
                    <p className={`text-xs mt-2 text-center ${concluida ? 'font-semibold text-green-700' : 'text-muted-foreground'}`}>
                      {etapa}
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Dados Pessoais + Veículo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><User className="h-5 w-5" /> Dados Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <InfoRow label="Nome Completo" value={cliente.nome_completo} />
              <InfoRow label="CPF" value={formatCPF(cliente.cpf)} />
              <InfoRow label="Telefone" value={cliente.telefone} />
              <InfoRow label="Email" value={cliente.email} />
              <InfoRow label="RG" value={cliente.rg} />
              <InfoRow label="CNH" value={cliente.cnh} />
              <InfoRow label="Profissão" value={cliente.profissao} />
              <InfoRow label="Renda Mensal" value={cliente.renda_mensal ? formatCurrency(cliente.renda_mensal) : null} />
              <InfoRow label="Score Estimado" value={cliente.score_estimado?.toString()} />
              <InfoRow label="Tipo de Cliente" value={cliente.tipo_cliente} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Car className="h-5 w-5" /> Dados do Veículo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <InfoRow label="Veículo" value={cliente.veiculo} />
              <InfoRow label="Valor do Veículo" value={formatCurrency(cliente.valor_veiculo)} />
              <InfoRow label="Entrada Disponível" value={formatCurrency(cliente.entrada_disponivel)} />
              <InfoRow label="Banco / Financeira" value={cliente.banco_financeira} />
              <InfoRow label="Placa" value={cliente.placa_veiculo} />
              <InfoRow label="Ano" value={cliente.ano_veiculo?.toString()} />
            </CardContent>
          </Card>
        </div>

        {/* Pendências e Observações */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" /> Pendências de Documentação</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{cliente.pendencias_documentacao || 'Nenhuma pendência registrada.'}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><MessageSquare className="h-5 w-5" /> Observações Internas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{cliente.observacoes_internas || 'Nenhuma observação registrada.'}</p>
            </CardContent>
          </Card>
        </div>

        <div className="hidden print:block border-t pt-4 mt-8 text-center text-xs text-gray-400">
          <p>Banco PRO Brasil — Documento gerado automaticamente para fins de acompanhamento interno.</p>
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ label, value }: { label: string; value: string | null | undefined }) => (
  <div className="flex justify-between items-center py-1 border-b border-dashed border-gray-100 last:border-0">
    <span className="text-sm text-muted-foreground">{label}</span>
    <span className="text-sm font-medium">{value || '—'}</span>
  </div>
);

export default AcompanhamentoDetalhes;

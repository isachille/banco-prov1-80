import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';

const STATUS_LIST = [
  'Aprovado',
  'Ativo',
  'Pendente em análise',
  'Aguardando documentação',
  'Reprovado',
  'Finalizado',
];

const ETAPAS = [
  'Cadastro realizado',
  'Em análise',
  'Documentação solicitada',
  'Documentação recebida',
  'Aprovado',
  'Contrato emitido',
  'Finalizado',
];

const AcompanhamentoForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    nome_completo: '',
    cpf: '',
    telefone: '',
    email: '',
    veiculo: '',
    valor_veiculo: '',
    entrada_disponivel: '',
    banco_financeira: '',
    status: 'Pendente em análise',
    observacoes_internas: '',
    pendencias_documentacao: '',
    responsavel_atendimento: '',
    rg: '',
    cnh: '',
    renda_mensal: '',
    profissao: '',
    score_estimado: '',
    tipo_cliente: '',
    placa_veiculo: '',
    ano_veiculo: '',
    etapa_progresso: 'Cadastro realizado',
  });

  useEffect(() => {
    if (isEdit) {
      fetchCliente();
    }
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

    const d = data as any;
    setForm({
      nome_completo: d.nome_completo || '',
      cpf: d.cpf || '',
      telefone: d.telefone || '',
      email: d.email || '',
      veiculo: d.veiculo || '',
      valor_veiculo: d.valor_veiculo?.toString() || '',
      entrada_disponivel: d.entrada_disponivel?.toString() || '',
      banco_financeira: d.banco_financeira || '',
      status: d.status || 'Pendente em análise',
      observacoes_internas: d.observacoes_internas || '',
      pendencias_documentacao: d.pendencias_documentacao || '',
      responsavel_atendimento: d.responsavel_atendimento || '',
      rg: d.rg || '',
      cnh: d.cnh || '',
      renda_mensal: d.renda_mensal?.toString() || '',
      profissao: d.profissao || '',
      score_estimado: d.score_estimado?.toString() || '',
      tipo_cliente: d.tipo_cliente || '',
      placa_veiculo: d.placa_veiculo || '',
      ano_veiculo: d.ano_veiculo?.toString() || '',
      etapa_progresso: d.etapa_progresso || 'Cadastro realizado',
    });
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome_completo || !form.cpf || !form.telefone || !form.email || !form.veiculo) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const payload: any = {
        nome_completo: form.nome_completo,
        cpf: form.cpf.replace(/\D/g, ''),
        telefone: form.telefone,
        email: form.email,
        veiculo: form.veiculo,
        valor_veiculo: parseFloat(form.valor_veiculo) || 0,
        entrada_disponivel: parseFloat(form.entrada_disponivel) || 0,
        banco_financeira: form.banco_financeira,
        status: form.status,
        observacoes_internas: form.observacoes_internas || null,
        pendencias_documentacao: form.pendencias_documentacao || null,
        responsavel_atendimento: form.responsavel_atendimento,
        rg: form.rg || null,
        cnh: form.cnh || null,
        renda_mensal: form.renda_mensal ? parseFloat(form.renda_mensal) : null,
        profissao: form.profissao || null,
        score_estimado: form.score_estimado ? parseInt(form.score_estimado) : null,
        tipo_cliente: form.tipo_cliente || null,
        placa_veiculo: form.placa_veiculo || null,
        ano_veiculo: form.ano_veiculo ? parseInt(form.ano_veiculo) : null,
        etapa_progresso: form.etapa_progresso,
        updated_at: new Date().toISOString(),
      };

      if (isEdit) {
        const { error } = await supabase
          .from('acompanhamentos_clientes')
          .update(payload as any)
          .eq('id', id);
        if (error) throw error;
        toast.success('Cliente atualizado com sucesso!');
      } else {
        payload.created_by = user?.id;
        const { error } = await supabase
          .from('acompanhamentos_clientes')
          .insert(payload as any);
        if (error) throw error;
        toast.success('Cliente cadastrado com sucesso!');
      }

      navigate('/acompanhamento');
    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast.error('Erro ao salvar cliente');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-[#001B3A] to-[#003F5C] text-white p-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/acompanhamento')}
            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">{isEdit ? 'Editar Cliente' : 'Cadastrar Cliente'}</h1>
            <p className="text-blue-100">Preencha os dados da proposta</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="container mx-auto p-6 space-y-6 max-w-4xl">
        {/* Dados Pessoais */}
        <Card>
          <CardHeader><CardTitle>Dados Pessoais</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nome Completo *</Label>
              <Input value={form.nome_completo} onChange={(e) => handleChange('nome_completo', e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>CPF *</Label>
              <Input value={form.cpf} onChange={(e) => handleChange('cpf', e.target.value)} placeholder="000.000.000-00" required />
            </div>
            <div className="space-y-2">
              <Label>Telefone *</Label>
              <Input value={form.telefone} onChange={(e) => handleChange('telefone', e.target.value)} placeholder="(00) 00000-0000" required />
            </div>
            <div className="space-y-2">
              <Label>Email *</Label>
              <Input type="email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>RG</Label>
              <Input value={form.rg} onChange={(e) => handleChange('rg', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>CNH</Label>
              <Input value={form.cnh} onChange={(e) => handleChange('cnh', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Profissão</Label>
              <Input value={form.profissao} onChange={(e) => handleChange('profissao', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Renda Mensal</Label>
              <Input type="number" value={form.renda_mensal} onChange={(e) => handleChange('renda_mensal', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Score Estimado</Label>
              <Input type="number" value={form.score_estimado} onChange={(e) => handleChange('score_estimado', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Tipo de Cliente</Label>
              <Select value={form.tipo_cliente} onValueChange={(v) => handleChange('tipo_cliente', v)}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="PF">Pessoa Física</SelectItem>
                  <SelectItem value="PJ">Pessoa Jurídica</SelectItem>
                  <SelectItem value="MEI">MEI</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Veículo */}
        <Card>
          <CardHeader><CardTitle>Dados do Veículo</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Veículo de Interesse *</Label>
              <Input value={form.veiculo} onChange={(e) => handleChange('veiculo', e.target.value)} placeholder="Ex: Onix 1.0 Turbo" required />
            </div>
            <div className="space-y-2">
              <Label>Valor do Veículo *</Label>
              <Input type="number" value={form.valor_veiculo} onChange={(e) => handleChange('valor_veiculo', e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Entrada Disponível *</Label>
              <Input type="number" value={form.entrada_disponivel} onChange={(e) => handleChange('entrada_disponivel', e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Banco / Financeira *</Label>
              <Input value={form.banco_financeira} onChange={(e) => handleChange('banco_financeira', e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Placa do Veículo</Label>
              <Input value={form.placa_veiculo} onChange={(e) => handleChange('placa_veiculo', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Ano do Veículo</Label>
              <Input type="number" value={form.ano_veiculo} onChange={(e) => handleChange('ano_veiculo', e.target.value)} />
            </div>
          </CardContent>
        </Card>

        {/* Status & Progresso */}
        <Card>
          <CardHeader><CardTitle>Status e Acompanhamento</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => handleChange('status', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STATUS_LIST.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Etapa do Progresso</Label>
              <Select value={form.etapa_progresso} onValueChange={(v) => handleChange('etapa_progresso', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ETAPAS.map((e) => (
                    <SelectItem key={e} value={e}>{e}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Responsável pelo Atendimento *</Label>
              <Input value={form.responsavel_atendimento} onChange={(e) => handleChange('responsavel_atendimento', e.target.value)} required />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Pendências de Documentação</Label>
              <Textarea value={form.pendencias_documentacao} onChange={(e) => handleChange('pendencias_documentacao', e.target.value)} rows={3} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Observações Internas</Label>
              <Textarea value={form.observacoes_internas} onChange={(e) => handleChange('observacoes_internas', e.target.value)} rows={3} />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4 justify-end">
          <Button type="button" variant="outline" onClick={() => navigate('/acompanhamento')}>Cancelar</Button>
          <Button type="submit" disabled={saving} className="bg-[#0047AB] hover:bg-[#003580]">
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Salvando...' : isEdit ? 'Atualizar' : 'Cadastrar'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AcompanhamentoForm;

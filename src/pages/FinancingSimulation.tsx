
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calculator, Car, User, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useUserStatus } from '@/hooks/useUserStatus';
import { ProposalPreview } from '@/components/ProposalPreview';

interface UserData {
  id: string;
  role: string;
  nome_completo?: string;
  cpf_cnpj?: string;
  nascimento?: string;
  mae?: string;
  profissao?: string;
}

interface VehicleData {
  marca: string;
  modelo: string;
  ano: number;
  valor: number;
}

interface SimulationData {
  clienteNome: string;
  clienteCpf: string;
  clienteNascimento: string;
  clienteMae: string;
  clienteProfissao: string;
  veiculo: VehicleData;
  valorEntrada: number;
  parcelas: number;
}

const FinancingSimulation = () => {
  const navigate = useNavigate();
  const { userData } = useUserStatus(null);
  const [simulationType, setSimulationType] = useState<'proprio' | 'terceiro'>('proprio');
  const [showPreview, setShowPreview] = useState(false);
  const [proposalData, setProposalData] = useState(null);
  const [formData, setFormData] = useState<SimulationData>({
    clienteNome: '',
    clienteCpf: '',
    clienteNascimento: '',
    clienteMae: '',
    clienteProfissao: '',
    veiculo: {
      marca: '',
      modelo: '',
      ano: new Date().getFullYear(),
      valor: 0
    },
    valorEntrada: 0,
    parcelas: 60
  });
  const [loading, setLoading] = useState(false);
  const [canSimulateForOthers, setCanSimulateForOthers] = useState(false);

  useEffect(() => {
    const checkPermissions = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userInfo } = await supabase
        .from('users')
        .select('role, nome_completo, cpf_cnpj, nascimento, mae, profissao')
        .eq('id', user.id)
        .single();

      if (userInfo) {
        const isManager = ['dono', 'gerente', 'admin'].includes(userInfo.role);
        setCanSimulateForOthers(isManager);

        if (!isManager || simulationType === 'proprio') {
          setFormData(prev => ({
            ...prev,
            clienteNome: userInfo.nome_completo || '',
            clienteCpf: userInfo.cpf_cnpj || '',
            clienteNascimento: userInfo.nascimento || '',
            clienteMae: userInfo.mae || '',
            clienteProfissao: userInfo.profissao || ''
          }));
        }
      }
    };

    checkPermissions();
  }, [simulationType]);

  const handleSimulation = async () => {
    if (!formData.clienteNome || !formData.clienteCpf || !formData.veiculo.marca || !formData.veiculo.modelo) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const valorFinanciado = formData.veiculo.valor - formData.valorEntrada;
      const taxaJuros = 0.015;
      const valorParcela = (valorFinanciado * (1 + taxaJuros * formData.parcelas)) / formData.parcelas;
      const valorTotal = valorParcela * formData.parcelas;

      const codigoProposta = `PM-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      // Criar dados da proposta para o preview
      const proposal = {
        id: Math.random().toString(36).substring(2, 15),
        codigo: codigoProposta,
        marca: formData.veiculo.marca,
        modelo: formData.veiculo.modelo,
        ano: formData.veiculo.ano,
        valorVeiculo: formData.veiculo.valor,
        valorEntrada: formData.valorEntrada,
        parcelas: formData.parcelas,
        valorParcela: Math.round(valorParcela * 100) / 100,
        valorTotal: Math.round(valorTotal * 100) / 100,
        taxaJuros: taxaJuros * 100,
        operador: {
          nome: 'João Silva',
          telefone: '(11) 99999-9999'
        }
      };

      const kycData = {
        nome_completo: formData.clienteNome,
        cpf: formData.clienteCpf,
        data_nascimento: formData.clienteNascimento,
        nome_mae: formData.clienteMae,
        profissao: formData.clienteProfissao
      };

      setProposalData({ proposal, kycData });
      setShowPreview(true);

      toast.success('Proposta gerada com sucesso!');
    } catch (error) {
      console.error('Erro ao criar proposta:', error);
      toast.error('Erro ao criar proposta de financiamento');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const valorFinanciado = formData.veiculo.valor - formData.valorEntrada;
  const valorParcela = valorFinanciado > 0 ? (valorFinanciado * 1.90) / formData.parcelas : 0;

  if (showPreview && proposalData) {
    return (
      <ProposalPreview
        proposal={proposalData.proposal}
        kycData={proposalData.kycData}
        onBack={() => setShowPreview(false)}
      />
    );
  }

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
              <h1 className="text-2xl font-bold">Simulação de Financiamento</h1>
              <p className="text-blue-100">Simule seu financiamento veicular</p>
            </div>
          </div>
          <img 
            src="/lovable-uploads/4712549c-a705-4aad-8498-4702dc3cdd8f.png" 
            alt="Banco Pro" 
            className="h-12 w-auto"
          />
        </div>
      </div>

      <div className="container mx-auto p-6 max-w-4xl">
        {canSimulateForOthers && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Tipo de Simulação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={simulationType} onValueChange={(value: 'proprio' | 'terceiro') => setSimulationType(value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="proprio" id="proprio" />
                  <Label htmlFor="proprio" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Simulação para mim
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="terceiro" id="terceiro" />
                  <Label htmlFor="terceiro" className="flex items-center">
                    <Building2 className="mr-2 h-4 w-4" />
                    Simulação para terceiro
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Dados do Cliente */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Dados do Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome Completo *</Label>
                <Input
                  id="nome"
                  value={formData.clienteNome}
                  onChange={(e) => setFormData(prev => ({ ...prev, clienteNome: e.target.value }))}
                  placeholder="Digite o nome completo"
                  disabled={!canSimulateForOthers && simulationType === 'proprio'}
                />
              </div>

              <div>
                <Label htmlFor="cpf">CPF *</Label>
                <Input
                  id="cpf"
                  value={formData.clienteCpf}
                  onChange={(e) => setFormData(prev => ({ ...prev, clienteCpf: e.target.value }))}
                  placeholder="000.000.000-00"
                  disabled={!canSimulateForOthers && simulationType === 'proprio'}
                />
              </div>

              <div>
                <Label htmlFor="nascimento">Data de Nascimento</Label>
                <Input
                  id="nascimento"
                  type="date"
                  value={formData.clienteNascimento}
                  onChange={(e) => setFormData(prev => ({ ...prev, clienteNascimento: e.target.value }))}
                  disabled={!canSimulateForOthers && simulationType === 'proprio'}
                />
              </div>

              <div>
                <Label htmlFor="mae">Nome da Mãe</Label>
                <Input
                  id="mae"
                  value={formData.clienteMae}
                  onChange={(e) => setFormData(prev => ({ ...prev, clienteMae: e.target.value }))}
                  placeholder="Digite o nome da mãe"
                  disabled={!canSimulateForOthers && simulationType === 'proprio'}
                />
              </div>

              <div>
                <Label htmlFor="profissao">Profissão</Label>
                <Input
                  id="profissao"
                  value={formData.clienteProfissao}
                  onChange={(e) => setFormData(prev => ({ ...prev, clienteProfissao: e.target.value }))}
                  placeholder="Digite a profissão"
                  disabled={!canSimulateForOthers && simulationType === 'proprio'}
                />
              </div>
            </CardContent>
          </Card>

          {/* Dados do Veículo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Car className="mr-2 h-5 w-5" />
                Dados do Veículo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="marca">Marca *</Label>
                <Input
                  id="marca"
                  value={formData.veiculo.marca}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    veiculo: { ...prev.veiculo, marca: e.target.value }
                  }))}
                  placeholder="Ex: Toyota, Honda, Ford"
                />
              </div>

              <div>
                <Label htmlFor="modelo">Modelo *</Label>
                <Input
                  id="modelo"
                  value={formData.veiculo.modelo}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    veiculo: { ...prev.veiculo, modelo: e.target.value }
                  }))}
                  placeholder="Ex: Corolla, Civic, Focus"
                />
              </div>

              <div>
                <Label htmlFor="ano">Ano</Label>
                <Input
                  id="ano"
                  type="number"
                  value={formData.veiculo.ano}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    veiculo: { ...prev.veiculo, ano: Number(e.target.value) }
                  }))}
                  min="1990"
                  max={new Date().getFullYear() + 1}
                />
              </div>

              <div>
                <Label htmlFor="valor">Valor do Veículo *</Label>
                <Input
                  id="valor"
                  type="number"
                  value={formData.veiculo.valor}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    veiculo: { ...prev.veiculo, valor: Number(e.target.value) }
                  }))}
                  placeholder="0"
                />
              </div>

              <div>
                <Label htmlFor="entrada">Valor de Entrada</Label>
                <Input
                  id="entrada"
                  type="number"
                  value={formData.valorEntrada}
                  onChange={(e) => setFormData(prev => ({ ...prev, valorEntrada: Number(e.target.value) }))}
                  placeholder="0"
                />
              </div>

              <div>
                <Label htmlFor="parcelas">Número de Parcelas</Label>
                <Select value={String(formData.parcelas)} onValueChange={(value) => setFormData(prev => ({ ...prev, parcelas: Number(value) }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24">24x</SelectItem>
                    <SelectItem value="36">36x</SelectItem>
                    <SelectItem value="48">48x</SelectItem>
                    <SelectItem value="60">60x</SelectItem>
                    <SelectItem value="72">72x</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {formData.veiculo.valor > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="mr-2 h-5 w-5" />
                Resumo da Simulação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">Valor do Veículo</p>
                  <p className="text-lg font-bold text-blue-600">{formatCurrency(formData.veiculo.valor)}</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600">Entrada</p>
                  <p className="text-lg font-bold text-green-600">{formatCurrency(formData.valorEntrada)}</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-gray-600">Valor Financiado</p>
                  <p className="text-lg font-bold text-yellow-600">{formatCurrency(valorFinanciado)}</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-600">Parcela Estimada</p>
                  <p className="text-lg font-bold text-purple-600">{formatCurrency(valorParcela)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mt-6 text-center">
          <Button
            onClick={handleSimulation}
            disabled={loading}
            size="lg"
            className="px-8 py-3"
          >
            {loading ? 'Processando...' : 'Gerar Proposta de Financiamento'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FinancingSimulation;

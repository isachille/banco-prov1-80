
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calculator, Car, User, Building2, Users } from 'lucide-react';
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
import { vehicleCategories } from '@/data/vehicleCategories';

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
  valorFipe?: number;
  categoria: string;
  cor: string;
}

interface Operador {
  id: string;
  nome: string;
  telefone: string;
  especialidade: string;
}

const operadores: Operador[] = [
  {
    id: '1',
    nome: 'Samuel Costa',
    telefone: '(61) 98765-4321',
    especialidade: 'Financiamento de Veículos Novos'
  },
  {
    id: '2',
    nome: 'Maria Eduarda Silva',
    telefone: '(61) 99123-4567',
    especialidade: 'Financiamento de Veículos Usados'
  }
];

interface SimulationData {
  clienteNome: string;
  clienteCpf: string;
  clienteNascimento: string;
  clienteMae: string;
  clienteProfissao: string;
  veiculo: VehicleData;
  valorEntrada: number;
  parcelas: number;
  operadorId: string;
  taxaJuros: number;
}

const FinancingSimulation = () => {
  const navigate = useNavigate();
  const { userData } = useUserStatus(null);
  const [simulationType, setSimulationType] = useState<'proprio' | 'terceiro'>('proprio');
  const [showPreview, setShowPreview] = useState(false);
  const [proposalData, setProposalData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [availableModels, setAvailableModels] = useState<any[]>([]);
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
      valor: 0,
      categoria: '',
      cor: 'Preto'
    },
    valorEntrada: 0,
    parcelas: 60,
    operadorId: '',
    taxaJuros: 1.5
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

  useEffect(() => {
    if (selectedCategory && selectedBrand) {
      const category = vehicleCategories.find(cat => cat.name === selectedCategory);
      if (category) {
        const brand = category.brands.find(b => b.name === selectedBrand);
        if (brand) {
          setAvailableModels(brand.models);
        }
      }
    }
  }, [selectedCategory, selectedBrand]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSelectedBrand('');
    setAvailableModels([]);
    setFormData(prev => ({
      ...prev,
      veiculo: { ...prev.veiculo, categoria: category, marca: '', modelo: '', valor: 0 }
    }));
  };

  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand);
    setFormData(prev => ({
      ...prev,
      veiculo: { ...prev.veiculo, marca: brand, modelo: '', valor: 0 }
    }));
  };

  const handleModelChange = (modelo: string) => {
    const selectedModel = availableModels.find(m => m.name === modelo);
    if (selectedModel) {
      setFormData(prev => ({
        ...prev,
        veiculo: {
          ...prev.veiculo,
          modelo: modelo,
          valor: selectedModel.price,
          ano: selectedModel.year
        }
      }));
    }
  };

  const handleSimulation = async () => {
    if (!formData.clienteNome || !formData.clienteCpf || !formData.veiculo.marca || !formData.veiculo.modelo || !formData.operadorId) {
      toast.error('Preencha todos os campos obrigatórios, incluindo o operador');
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const valorFinanciado = formData.veiculo.valor - formData.valorEntrada;
      const taxaJuros = formData.taxaJuros / 100;
      const valorParcela = (valorFinanciado * (1 + taxaJuros * formData.parcelas)) / formData.parcelas;
      const valorTotal = valorParcela * formData.parcelas;

      const codigoProposta = `PM-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const operadorSelecionado = operadores.find(op => op.id === formData.operadorId);

      // Salvar proposta no localStorage para simular base de dados
      const propostas = JSON.parse(localStorage.getItem('propostas_usuario') || '[]');
      const novaProposta = {
        id: Math.random().toString(36).substring(2, 15),
        codigo: codigoProposta,
        usuario_id: user.id,
        cliente_nome: formData.clienteNome,
        cliente_cpf: formData.clienteCpf,
        cliente_nascimento: formData.clienteNascimento,
        cliente_mae: formData.clienteMae,
        cliente_profissao: formData.clienteProfissao,
        veiculo: `${formData.veiculo.marca} ${formData.veiculo.modelo}`,
        marca: formData.veiculo.marca,
        modelo: formData.veiculo.modelo,
        ano: formData.veiculo.ano,
        categoria: formData.veiculo.categoria,
        valor_veiculo: formData.veiculo.valor,
        valor_entrada: formData.valorEntrada,
        parcelas: formData.parcelas,
        valor_parcela: Math.round(valorParcela * 100) / 100,
        valor_total: Math.round(valorTotal * 100) / 100,
        taxa_juros: formData.taxaJuros,
        operador: operadorSelecionado,
        status: 'pendente',
        created_at: new Date().toISOString()
      };

      propostas.push(novaProposta);
      localStorage.setItem('propostas_usuario', JSON.stringify(propostas));

      const proposal = {
        id: novaProposta.id,
        codigo: codigoProposta,
        marca: formData.veiculo.marca,
        modelo: formData.veiculo.modelo,
        ano: formData.veiculo.ano,
        categoria: formData.veiculo.categoria,
        cor: formData.veiculo.cor,
        valorVeiculo: formData.veiculo.valor,
        valorEntrada: formData.valorEntrada,
        parcelas: formData.parcelas,
        valorParcela: Math.round(valorParcela * 100) / 100,
        valorTotal: Math.round(valorTotal * 100) / 100,
        taxaJuros: formData.taxaJuros,
        operador: operadorSelecionado
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

      toast.success('Proposta gerada e salva com sucesso!');
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
  const taxaDecimal = formData.taxaJuros / 100;
  const valorParcela = valorFinanciado > 0 ? (valorFinanciado * (1 + taxaDecimal * formData.parcelas)) / formData.parcelas : 0;
  const valorTotal = valorParcela * formData.parcelas;

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
              <p className="text-blue-100">Simule seu financiamento veicular com operador especializado</p>
            </div>
          </div>
          <img 
            src="/lovable-uploads/4712549c-a705-4aad-8498-4702dc3cdd8f.png" 
            alt="Banco Pro" 
            className="h-12 w-auto"
          />
        </div>
      </div>

      <div className="container mx-auto p-6 max-w-6xl">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              Para quem é esta proposta?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={simulationType} onValueChange={(value: 'proprio' | 'terceiro') => setSimulationType(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="proprio" id="proprio" />
                <Label htmlFor="proprio" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  Para mim
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="terceiro" id="terceiro" />
                <Label htmlFor="terceiro" className="flex items-center">
                  <Building2 className="mr-2 h-4 w-4" />
                  Para outra pessoa
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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

          {/* Seleção de Veículo */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Car className="mr-2 h-5 w-5" />
                Seleção de Veículo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="categoria">Categoria *</Label>
                  <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicleCategories.map((category) => (
                        <SelectItem key={category.name} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="marca">Marca *</Label>
                  <Select value={selectedBrand} onValueChange={handleBrandChange} disabled={!selectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a marca" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedCategory && vehicleCategories
                        .find(cat => cat.name === selectedCategory)?.brands
                        .map((brand) => (
                          <SelectItem key={brand.name} value={brand.name}>
                            {brand.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="modelo">Modelo *</Label>
                  <Select value={formData.veiculo.modelo} onValueChange={handleModelChange} disabled={!selectedBrand}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o modelo" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableModels.map((model) => (
                        <SelectItem key={model.name} value={model.name}>
                          {model.name} - {model.year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="cor">Cor do Veículo *</Label>
                  <Select value={formData.veiculo.cor} onValueChange={(value) => setFormData(prev => ({ 
                    ...prev, 
                    veiculo: { ...prev.veiculo, cor: value }
                  }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a cor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Preto">Preto</SelectItem>
                      <SelectItem value="Branco">Branco</SelectItem>
                      <SelectItem value="Prata">Prata</SelectItem>
                      <SelectItem value="Vermelho">Vermelho</SelectItem>
                      <SelectItem value="Azul">Azul</SelectItem>
                      <SelectItem value="Cinza">Cinza</SelectItem>
                      <SelectItem value="Amarelo">Amarelo</SelectItem>
                      <SelectItem value="Verde">Verde</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="valor">Valor do Veículo</Label>
                  <Input
                    id="valor"
                    type="number"
                    value={formData.veiculo.valor}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      veiculo: { ...prev.veiculo, valor: Number(e.target.value) }
                    }))}
                    placeholder="Digite o valor do veículo"
                  />
                </div>

                <div>
                  <Label htmlFor="valorFipe">Valor FIPE</Label>
                  <Input
                    id="valorFipe"
                    type="number"
                    value={formData.veiculo.valorFipe || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      veiculo: { ...prev.veiculo, valorFipe: Number(e.target.value) }
                    }))}
                    placeholder="Valor da tabela FIPE"
                  />
                </div>

                <div>
                  <Label htmlFor="anoVeiculo">Ano do Veículo</Label>
                  <Select 
                    value={String(formData.veiculo.ano)} 
                    onValueChange={(value) => setFormData(prev => ({ 
                      ...prev, 
                      veiculo: { ...prev.veiculo, ano: Number(value) }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o ano" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 20 }, (_, i) => {
                        const year = new Date().getFullYear() - i;
                        return (
                          <SelectItem key={year} value={String(year)}>
                            {year} {i === 0 && "(0 KM)"}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                <div>
                  <Label htmlFor="taxaJuros">Taxa de Juros (% ao mês)</Label>
                  <Input
                    id="taxaJuros"
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={formData.taxaJuros}
                    onChange={(e) => setFormData(prev => ({ ...prev, taxaJuros: Number(e.target.value) }))}
                    placeholder="1.5"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Ajuste a taxa para negociação (padrão: 1.5%)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Seleção de Operador */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Operador Responsável
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {operadores.map((operador) => (
                <div
                  key={operador.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    formData.operadorId === operador.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, operadorId: operador.id }))}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{operador.nome}</h3>
                      <p className="text-sm text-gray-600">{operador.telefone}</p>
                      <p className="text-xs text-gray-500">{operador.especialidade}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {formData.veiculo.valor > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="mr-2 h-5 w-5" />
                Resultado da Análise
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
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <p className="text-sm text-gray-600">Taxa de Juros</p>
                  <p className="text-lg font-bold text-orange-600">{formData.taxaJuros}% a.m.</p>
                </div>
                <div className="text-center p-4 bg-pink-50 rounded-lg">
                  <p className="text-sm text-gray-600">Total a Pagar</p>
                  <p className="text-lg font-bold text-pink-600">{formatCurrency(valorTotal)}</p>
                </div>
                <div className="text-center p-4 bg-indigo-50 rounded-lg">
                  <p className="text-sm text-gray-600">Número de Parcelas</p>
                  <p className="text-lg font-bold text-indigo-600">{formData.parcelas}x</p>
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
            {loading ? 'Processando...' : 'Gerar Resultado da Análise'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FinancingSimulation;


import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, MessageCircle, Download, Share, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { vehicleCategories, operators, type Vehicle } from '@/data/vehicleCategories';

interface KYCData {
  nome_completo: string;
  cpf: string;
  data_nascimento: string;
  nome_mae: string;
  profissao: string;
}

const ConsorcioPage = () => {
  const navigate = useNavigate();
  const [kycData, setKycData] = useState<KYCData>({
    nome_completo: '',
    cpf: '',
    data_nascimento: '',
    nome_mae: '',
    profissao: ''
  });
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedOperator, setSelectedOperator] = useState('');
  const [valorCredito, setValorCredito] = useState('');
  const [parcelas, setParcelas] = useState('');
  const [valorLance, setValorLance] = useState('');
  const [proposal, setProposal] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const currentYear = new Date().getFullYear();
  const availableYears = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const selectedCategoryData = vehicleCategories.find(cat => cat.name === selectedCategory);
  const filteredBrands = selectedCategoryData?.brands || [];
  const selectedBrandData = filteredBrands.find(brand => brand.name === selectedBrand);
  const filteredVehicles = selectedBrandData?.models || [];

  const selectedVehicleData = filteredVehicles.find(v => v.name === selectedVehicle);
  const selectedOperatorData = operators.find(op => op.id === selectedOperator);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: userData } = await supabase
          .from('users')
          .select('nome_completo, cpf, cpf_cnpj, nascimento, mae, profissao')
          .eq('id', user.id)
          .single();

        if (userData) {
          setKycData({
            nome_completo: userData.nome_completo || '',
            cpf: userData.cpf || userData.cpf_cnpj || '',
            data_nascimento: userData.nascimento || '',
            nome_mae: userData.mae || '',
            profissao: userData.profissao || ''
          });
        }
      }
    };

    fetchUserData();
  }, []);

  const handleSimulate = async () => {
    if (!selectedCategory || !selectedBrand || !selectedVehicle || !selectedYear || !valorCredito || !parcelas || !selectedOperator) {
      toast.error('Preencha todos os campos');
      return;
    }

    if (!selectedVehicleData) return;

    setLoading(true);
    try {
      const credito = parseFloat(valorCredito.replace(',', '.'));
      const numParcelas = parseInt(parcelas);
      const lance = valorLance ? parseFloat(valorLance.replace(',', '.')) : 0;
      
      // Taxa administrativa do consórcio (geralmente entre 15% e 25%)
      const taxaAdministrativa = 0.20; // 20%
      const valorTaxaAdm = credito * taxaAdministrativa;
      const valorParcela = (credito + valorTaxaAdm) / numParcelas;

      const codigoProposta = `CON-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      setProposal({
        codigo: codigoProposta,
        tipo: 'consorcio',
        veiculo: `${selectedBrand} ${selectedVehicleData.name} ${selectedYear}`,
        marca: selectedBrand,
        modelo: selectedVehicleData.name,
        ano: parseInt(selectedYear),
        valorCredito: credito,
        parcelas: numParcelas,
        valorParcela: valorParcela,
        valorLance: lance,
        taxaAdministrativa: taxaAdministrativa * 100,
        valorTaxaAdm: valorTaxaAdm,
        operador: selectedOperatorData
      });

      toast.success('Proposta de consórcio gerada com sucesso!');
    } catch (error) {
      console.error('Erro ao simular consórcio:', error);
      toast.error('Erro ao gerar proposta');
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsApp = () => {
    if (!proposal || !selectedOperatorData) return;

    const message = `Olá ${selectedOperatorData.nome}! Gostaria de prosseguir com minha proposta de consórcio.

Código da proposta: ${proposal.codigo}

Nome: ${kycData.nome_completo}
CPF: ${kycData.cpf}
Nascimento: ${kycData.data_nascimento ? new Date(kycData.data_nascimento).toLocaleDateString('pt-BR') : 'Não informado'}
Nome da mãe: ${kycData.nome_mae}
Profissão: ${kycData.profissao}

Veículo: ${proposal.veiculo}
Valor do crédito: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(proposal.valorCredito)}
Parcelas: ${proposal.parcelas}x de ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(proposal.valorParcela)}
${proposal.valorLance > 0 ? `Lance ofertado: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(proposal.valorLance)}` : ''}

Aguardo retorno para dar continuidade ao processo de consórcio. Obrigado!`;

    const phoneNumber = selectedOperatorData.telefone.replace(/\D/g, '');
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/55${phoneNumber}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Consórcio Veicular</h1>
      </div>

      {!proposal ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Simulação de Consórcio</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Dados do Cliente */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Dados do Cliente</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nome">Nome Completo</Label>
                  <Input
                    id="nome"
                    value={kycData.nome_completo}
                    onChange={(e) => setKycData({...kycData, nome_completo: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    value={kycData.cpf}
                    onChange={(e) => setKycData({...kycData, cpf: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="nascimento">Data de Nascimento</Label>
                  <Input
                    id="nascimento"
                    type="date"
                    value={kycData.data_nascimento}
                    onChange={(e) => setKycData({...kycData, data_nascimento: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="mae">Nome da Mãe</Label>
                  <Input
                    id="mae"
                    value={kycData.nome_mae}
                    onChange={(e) => setKycData({...kycData, nome_mae: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="profissao">Profissão</Label>
                  <Input
                    id="profissao"
                    value={kycData.profissao}
                    onChange={(e) => setKycData({...kycData, profissao: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="operador">Operador Responsável</Label>
                  <Select value={selectedOperator} onValueChange={setSelectedOperator}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um operador" />
                    </SelectTrigger>
                    <SelectContent>
                      {operators.map((operator) => (
                        <SelectItem key={operator.id} value={operator.id}>
                          {operator.nome} - {operator.telefone}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Seleção do Veículo */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Escolha seu Veículo</h3>
              
              <div>
                <Label htmlFor="categoria">Categoria do Veículo</Label>
                <Select value={selectedCategory} onValueChange={(value) => {
                  setSelectedCategory(value);
                  setSelectedBrand('');
                  setSelectedVehicle('');
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicleCategories.map((category) => (
                      <SelectItem key={category.name} value={category.name}>
                        <div>
                          <div className="font-medium">{category.name}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedCategory && (
                <div>
                  <Label htmlFor="marca">Marca do Veículo</Label>
                  <Select value={selectedBrand} onValueChange={(value) => {
                    setSelectedBrand(value);
                    setSelectedVehicle('');
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma marca" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredBrands.map((brand) => (
                        <SelectItem key={brand.name} value={brand.name}>
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {selectedBrand && (
                <div>
                  <Label htmlFor="veiculo">Modelo do Veículo</Label>
                  <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um modelo" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredVehicles.map((vehicle) => (
                        <SelectItem key={vehicle.name} value={vehicle.name}>
                          <div className="flex justify-between items-center w-full">
                            <span>{vehicle.name}</span>
                            <span className="text-sm text-gray-500 ml-2">
                              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(vehicle.price)}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {selectedVehicle && (
                <div>
                  <Label htmlFor="ano">Ano do Veículo</Label>
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o ano" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableYears.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year} {year === currentYear && '(0 KM)'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Condições do Consórcio */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Condições do Consórcio</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="credito">Valor do Crédito (R$)</Label>
                  <Input
                    id="credito"
                    type="number"
                    placeholder="0,00"
                    value={valorCredito}
                    onChange={(e) => setValorCredito(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="parcelas">Número de Parcelas</Label>
                  <Select value={parcelas} onValueChange={setParcelas}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="36">36 meses</SelectItem>
                      <SelectItem value="48">48 meses</SelectItem>
                      <SelectItem value="60">60 meses</SelectItem>
                      <SelectItem value="72">72 meses</SelectItem>
                      <SelectItem value="84">84 meses</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="lance">Lance Ofertado (Opcional)</Label>
                  <Input
                    id="lance"
                    type="number"
                    placeholder="0,00"
                    value={valorLance}
                    onChange={(e) => setValorLance(e.target.value)}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Lance para acelerar a contemplação
                  </p>
                </div>
              </div>
            </div>

            <Button 
              className="w-full"
              onClick={handleSimulate}
              disabled={loading}
            >
              {loading ? 'Simulando...' : 'Simular Consórcio'}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Proposta de Consórcio</span>
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                EM ANÁLISE
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-4 text-lg">Código da Proposta: {proposal.codigo}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-800">Veículo Selecionado</h4>
                  <div className="bg-white p-4 rounded border">
                    <p className="font-semibold text-lg">{proposal.veiculo}</p>
                    <p className="text-xl font-bold text-blue-600">
                      Crédito: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(proposal.valorCredito)}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-800">Condições do Consórcio</h4>
                  <div className="bg-white p-4 rounded border space-y-2">
                    <p><strong>Parcelas:</strong> {proposal.parcelas}x de {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(proposal.valorParcela)}</p>
                    {proposal.valorLance > 0 && (
                      <p><strong>Lance:</strong> {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(proposal.valorLance)}</p>
                    )}
                    <p><strong>Taxa Administrativa:</strong> {proposal.taxaAdministrativa}%</p>
                    <p className="text-sm text-gray-600">Contemplação por sorteio mensal</p>
                  </div>
                </div>
              </div>

              {proposal.operador && (
                <div className="mt-4 bg-white p-4 rounded border">
                  <h4 className="font-medium text-gray-800 mb-2">Operador Responsável</h4>
                  <p><strong>{proposal.operador.nome}</strong></p>
                  <p className="text-gray-600">{proposal.operador.telefone}</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                className="bg-green-600 hover:bg-green-700 flex items-center justify-center space-x-2"
                onClick={handleWhatsApp}
              >
                <MessageCircle className="h-4 w-4" />
                <span>Falar com Operador</span>
              </Button>

              <Button 
                variant="outline"
                onClick={() => setProposal(null)}
                className="flex items-center justify-center space-x-2"
              >
                <FileText className="h-4 w-4" />
                <span>Nova Simulação</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ConsorcioPage;

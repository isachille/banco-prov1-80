
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Car, MessageCircle, Download, Share, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { vehicleCategories, getAllVehicles, calculateVehiclePrice, type Vehicle } from '@/data/vehicleCategories';
import { generateFinancingPDF, shareWhatsApp } from '@/components/PDFGenerator';

interface KYCData {
  nome_completo: string;
  cpf: string;
  data_nascimento: string;
  nome_mae: string;
  profissao: string;
}

const FinancingPage = () => {
  const navigate = useNavigate();
  const [kycData, setKycData] = useState<KYCData>({
    nome_completo: '',
    cpf: '',
    data_nascimento: '',
    nome_mae: '',
    profissao: ''
  });
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [valorEntrada, setValorEntrada] = useState('');
  const [parcelas, setParcelas] = useState('');
  const [proposal, setProposal] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);

  const currentYear = new Date().getFullYear();
  const availableYears = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const filteredVehicles = selectedCategory 
    ? vehicleCategories.find(cat => cat.id === selectedCategory)?.veiculos || []
    : [];

  const selectedVehicleData = filteredVehicles.find(v => v.id === selectedVehicle);
  const vehiclePrice = selectedVehicleData && selectedYear 
    ? calculateVehiclePrice(selectedVehicleData.precoBase, parseInt(selectedYear))
    : 0;

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
    if (!selectedCategory || !selectedVehicle || !selectedYear || !valorEntrada || !parcelas) {
      toast.error('Preencha todos os campos');
      return;
    }

    if (!selectedVehicleData) return;

    setLoading(true);
    try {
      const entrada = parseFloat(valorEntrada.replace(',', '.'));
      const numParcelas = parseInt(parcelas);
      const valorVeiculo = vehiclePrice;
      const valorFinanciado = valorVeiculo - entrada;
      
      if (entrada > valorVeiculo) {
        toast.error('Valor da entrada não pode ser maior que o valor do veículo');
        return;
      }

      // Taxa de juros simulada baseada no prazo
      const taxaJuros = numParcelas <= 24 ? 0.015 : numParcelas <= 48 ? 0.018 : 0.02;
      const valorParcela = (valorFinanciado * (1 + taxaJuros * numParcelas)) / numParcelas;

      const codigoProposta = `PM-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      setProposal({
        codigo: codigoProposta,
        veiculo: `${selectedVehicleData.marca} ${selectedVehicleData.modelo} ${selectedYear}`,
        marca: selectedVehicleData.marca,
        modelo: selectedVehicleData.modelo,
        ano: parseInt(selectedYear),
        valorVeiculo: valorVeiculo,
        entrada: entrada,
        parcelas: numParcelas,
        valorParcela: valorParcela,
        valorTotal: entrada + (valorParcela * numParcelas),
        taxaJuros: taxaJuros * 100
      });

      toast.success('Proposta gerada com sucesso!');
    } catch (error) {
      console.error('Erro ao simular financiamento:', error);
      toast.error('Erro ao gerar proposta');
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePDF = async () => {
    if (!proposal) return;

    setGeneratingPDF(true);
    try {
      const pdfData = {
        codigoProposta: proposal.codigo,
        cliente: {
          nome: kycData.nome_completo,
          cpf: kycData.cpf,
          nascimento: kycData.data_nascimento ? new Date(kycData.data_nascimento).toLocaleDateString('pt-BR') : 'Não informado',
          mae: kycData.nome_mae,
          profissao: kycData.profissao
        },
        veiculo: {
          marca: proposal.marca,
          modelo: proposal.modelo,
          ano: proposal.ano,
          valor: proposal.valorVeiculo
        },
        financiamento: {
          entrada: proposal.entrada,
          parcelas: proposal.parcelas,
          valorParcela: proposal.valorParcela,
          valorTotal: proposal.valorTotal
        },
        status: 'PRE_APROVADO' as const
      };

      const pdfBlob = await generateFinancingPDF(pdfData);
      
      // Criar link para download
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Proposta_${proposal.codigo}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('PDF gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast.error('Erro ao gerar PDF');
    } finally {
      setGeneratingPDF(false);
    }
  };

  const handleWhatsApp = () => {
    const message = `Olá Pro Motors! Gostaria de prosseguir com minha proposta de financiamento.

Código da proposta: ${proposal.codigo}

Nome: ${kycData.nome_completo}
CPF: ${kycData.cpf}
Nascimento: ${kycData.data_nascimento ? new Date(kycData.data_nascimento).toLocaleDateString('pt-BR') : 'Não informado'}
Nome da mãe: ${kycData.nome_mae}
Profissão: ${kycData.profissao}

Veículo: ${proposal.veiculo}
Valor do veículo: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(proposal.valorVeiculo)}
Entrada: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(proposal.entrada)}
Financiamento: ${proposal.parcelas}x de ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(proposal.valorParcela)}

Status: PRÉ-APROVADO

Aguardo retorno. Obrigado!`;

    shareWhatsApp(message);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Financiamento Veicular</h1>
      </div>

      {!proposal ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Car className="h-5 w-5" />
              <span>Simulação de Financiamento</span>
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
              </div>
            </div>

            {/* Seleção do Veículo */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Escolha seu Veículo</h3>
              
              <div>
                <Label htmlFor="categoria">Categoria do Veículo</Label>
                <Select value={selectedCategory} onValueChange={(value) => {
                  setSelectedCategory(value);
                  setSelectedVehicle('');
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicleCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div>
                          <div className="font-medium">{category.nome}</div>
                          <div className="text-sm text-gray-500">{category.descricao}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedCategory && (
                <div>
                  <Label htmlFor="veiculo">Modelo do Veículo</Label>
                  <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um modelo" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredVehicles.map((vehicle) => (
                        <SelectItem key={vehicle.id} value={vehicle.id}>
                          <div className="flex justify-between items-center w-full">
                            <span>{vehicle.marca} {vehicle.modelo}</span>
                            <span className="text-sm text-gray-500 ml-2">
                              {vehicle.popular && '⭐'} A partir de {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(vehicle.precoBase)}
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

              {selectedVehicleData && selectedYear && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900">
                    {selectedVehicleData.marca} {selectedVehicleData.modelo} {selectedYear}
                  </h4>
                  <p className="text-2xl font-bold text-blue-600">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(vehiclePrice)}
                  </p>
                  {parseInt(selectedYear) < currentYear && (
                    <p className="text-sm text-gray-600">
                      Valor ajustado pela idade do veículo
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Condições de Financiamento */}
            {vehiclePrice > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Condições de Financiamento</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="entrada">Valor de Entrada (R$)</Label>
                    <Input
                      id="entrada"
                      type="number"
                      placeholder="0,00"
                      value={valorEntrada}
                      onChange={(e) => setValorEntrada(e.target.value)}
                      max={vehiclePrice}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Mínimo: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(vehiclePrice * 0.2)} (20%)
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="parcelas">Parcelamento</Label>
                    <Select value={parcelas} onValueChange={setParcelas}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12">12x (Taxa: 1,5% a.m.)</SelectItem>
                        <SelectItem value="24">24x (Taxa: 1,5% a.m.)</SelectItem>
                        <SelectItem value="36">36x (Taxa: 1,8% a.m.)</SelectItem>
                        <SelectItem value="48">48x (Taxa: 1,8% a.m.)</SelectItem>
                        <SelectItem value="60">60x (Taxa: 2,0% a.m.)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            <Button 
              className="w-full"
              onClick={handleSimulate}
              disabled={loading || !vehiclePrice}
            >
              {loading ? 'Simulando...' : 'Simular Financiamento'}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Proposta Gerada</span>
              <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                PRÉ-APROVADO
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-4 text-lg">Código da Proposta: {proposal.codigo}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-800">Veículo Selecionado</h4>
                  <div className="bg-white p-4 rounded border">
                    <p className="font-semibold text-lg">{proposal.veiculo}</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(proposal.valorVeiculo)}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-800">Condições do Financiamento</h4>
                  <div className="bg-white p-4 rounded border space-y-2">
                    <p><strong>Entrada:</strong> {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(proposal.entrada)}</p>
                    <p><strong>Parcelas:</strong> {proposal.parcelas}x de {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(proposal.valorParcela)}</p>
                    <p><strong>Total:</strong> {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(proposal.valorTotal)}</p>
                    <p className="text-sm text-gray-600"><strong>Taxa:</strong> {proposal.taxaJuros.toFixed(1)}% a.m.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                onClick={handleGeneratePDF}
                disabled={generatingPDF}
                className="flex items-center justify-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>{generatingPDF ? 'Gerando...' : 'Baixar PDF'}</span>
              </Button>

              <Button 
                className="bg-green-600 hover:bg-green-700 flex items-center justify-center space-x-2"
                onClick={handleWhatsApp}
              >
                <MessageCircle className="h-4 w-4" />
                <span>WhatsApp</span>
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

export default FinancingPage;

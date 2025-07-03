
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Car, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Vehicle {
  id: string;
  marca: string;
  modelo: string;
  ano: number;
  preco: number;
}

interface KYCData {
  nome_completo: string;
  cpf: string;
  data_nascimento: string;
  nome_mae: string;
  profissao: string;
}

const FinancingPage = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [kycData, setKycData] = useState<KYCData>({
    nome_completo: '',
    cpf: '',
    data_nascimento: '',
    nome_mae: '',
    profissao: ''
  });
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [valorEntrada, setValorEntrada] = useState('');
  const [parcelas, setParcelas] = useState('');
  const [proposal, setProposal] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      // Criar veículos fictícios já que não temos a tabela no banco
      const mockVehicles: Vehicle[] = [
        {
          id: '1',
          marca: 'Toyota',
          modelo: 'Corolla',
          ano: 2023,
          preco: 120000
        },
        {
          id: '2',
          marca: 'Honda',
          modelo: 'Civic',
          ano: 2023,
          preco: 130000
        },
        {
          id: '3',
          marca: 'Volkswagen',
          modelo: 'Jetta',
          ano: 2023,
          preco: 115000
        }
      ];
      
      setVehicles(mockVehicles);

      // Buscar dados do usuário da tabela users
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

    fetchData();
  }, []);

  const handleSimulate = async () => {
    if (!selectedVehicle || !valorEntrada || !parcelas) {
      toast.error('Preencha todos os campos');
      return;
    }

    setLoading(true);
    try {
      const vehicle = vehicles.find(v => v.id === selectedVehicle);
      if (!vehicle) return;

      const entrada = parseFloat(valorEntrada.replace(',', '.'));
      const numParcelas = parseInt(parcelas);
      const valorFinanciado = vehicle.preco - entrada;
      const valorParcela = valorFinanciado / numParcelas;

      // Gerar código da proposta
      const codigoProposta = `PM-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      setProposal({
        codigo: codigoProposta,
        veiculo: `${vehicle.marca} ${vehicle.modelo} ${vehicle.ano}`,
        entrada: entrada,
        parcelas: numParcelas,
        valorParcela: valorParcela
      });

      toast.success('Proposta gerada com sucesso!');
    } catch (error) {
      console.error('Erro ao simular financiamento:', error);
      toast.error('Erro ao gerar proposta');
    } finally {
      setLoading(false);
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
Entrada: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(proposal.entrada)}
Parcelas: ${proposal.parcelas}x de ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(proposal.valorParcela)}

Aguardo retorno. Obrigado!`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/5561984833965?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Financiamento</h1>
      </div>

      {!proposal ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Car className="h-5 w-5" />
              <span>Simulação de Financiamento</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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

            <div>
              <Label htmlFor="veiculo">Veículo</Label>
              <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um veículo" />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.marca} {vehicle.modelo} {vehicle.ano} - {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(vehicle.preco)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="entrada">Valor de Entrada (R$)</Label>
                <Input
                  id="entrada"
                  type="number"
                  placeholder="0,00"
                  value={valorEntrada}
                  onChange={(e) => setValorEntrada(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="parcelas">Parcelamento</Label>
                <Select value={parcelas} onValueChange={setParcelas}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12">12x</SelectItem>
                    <SelectItem value="24">24x</SelectItem>
                    <SelectItem value="36">36x</SelectItem>
                    <SelectItem value="48">48x</SelectItem>
                    <SelectItem value="60">60x</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              className="w-full"
              onClick={handleSimulate}
              disabled={loading}
            >
              {loading ? 'Simulando...' : 'Simular Financiamento'}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Proposta Gerada</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Código da Proposta: {proposal.codigo}</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Veículo:</strong> {proposal.veiculo}</p>
                <p><strong>Entrada:</strong> {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(proposal.entrada)}</p>
                <p><strong>Parcelas:</strong> {proposal.parcelas}x de {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(proposal.valorParcela)}</p>
              </div>
            </div>

            <Button 
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={handleWhatsApp}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Falar com consultor no WhatsApp
            </Button>

            <Button 
              variant="outline"
              className="w-full"
              onClick={() => setProposal(null)}
            >
              Nova Simulação
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FinancingPage;

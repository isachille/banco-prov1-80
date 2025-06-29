
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Car, Home, Calculator, MessageCircle, ArrowLeft } from 'lucide-react';

const Financiamento = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<'carro' | 'imovel' | null>(null);
  const [formData, setFormData] = useState({
    valor: '',
    entrada: '',
    renda: ''
  });
  const [simulation, setSimulation] = useState<any>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const calculateFinancing = () => {
    const valor = parseFloat(formData.valor);
    const entrada = parseFloat(formData.entrada);
    const renda = parseFloat(formData.renda);
    
    if (!valor || !entrada || !renda) return;

    const valorFinanciado = valor - entrada;
    
    let taxa = 0;
    if (selectedType === 'carro') {
      if (renda <= 2000) taxa = 2.89;
      else if (renda <= 5000) taxa = 2.45;
      else taxa = 1.95;
    } else {
      taxa = 1.65;
    }

    const maxParcelas = selectedType === 'carro' ? 60 : 360;
    const parcelas = [];
    
    for (let i = 12; i <= maxParcelas; i += 12) {
      const juros = (taxa / 100) / 12;
      const parcela = valorFinanciado * (juros * Math.pow(1 + juros, i)) / (Math.pow(1 + juros, i) - 1);
      parcelas.push({
        meses: i,
        valor: parcela,
        total: parcela * i
      });
    }

    setSimulation({
      valorFinanciado,
      taxa,
      parcelas: parcelas.slice(0, 6) // Mostrar apenas as primeiras opções
    });
  };

  const sendToWhatsApp = () => {
    const message = `Olá! Gostaria de solicitar um financiamento ${selectedType}:
    
Valor do ${selectedType}: R$ ${parseFloat(formData.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
Entrada: R$ ${parseFloat(formData.entrada).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
Renda mensal: R$ ${parseFloat(formData.renda).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
Taxa de juros: ${simulation.taxa}% ao mês

Aguardo retorno!`;

    const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (!selectedType) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate('/home')}
              className="mr-4"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-2xl font-bold text-[#0057FF]">Financiamento Pro</h1>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card 
              className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
              onClick={() => setSelectedType('carro')}
            >
              <CardHeader className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Car className="w-8 h-8 text-[#0057FF]" />
                </div>
                <CardTitle className="text-xl text-[#0057FF]">Financiamento de Veículos</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">
                  Realize o sonho do seu carro novo ou usado
                </p>
                <ul className="text-sm text-gray-500 space-y-2">
                  <li>• Taxa a partir de 1,95% ao mês</li>
                  <li>• Até 60x para pagar</li>
                  <li>• Aprovação rápida</li>
                  <li>• Sem entrada obrigatória</li>
                </ul>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
              onClick={() => setSelectedType('imovel')}
            >
              <CardHeader className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Home className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-xl text-green-600">Financiamento Imobiliário</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">
                  Conquiste sua casa própria com as melhores condições
                </p>
                <ul className="text-sm text-gray-500 space-y-2">
                  <li>• Taxa fixa de 1,65% ao mês</li>
                  <li>• Até 360x para pagar</li>
                  <li>• Use FGTS como entrada</li>
                  <li>• Financie até 90% do valor</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => setSelectedType(null)}
            className="mr-4"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-bold text-[#0057FF]">
            Financiamento {selectedType === 'carro' ? 'de Veículos' : 'Imobiliário'}
          </h1>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calculator className="w-5 h-5 mr-2" />
              Simulação de Financiamento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              name="valor"
              placeholder={`Valor do ${selectedType} (R$)`}
              type="number"
              value={formData.valor}
              onChange={handleInputChange}
            />
            <Input
              name="entrada"
              placeholder="Valor da entrada (R$)"
              type="number"
              value={formData.entrada}
              onChange={handleInputChange}
            />
            <Input
              name="renda"
              placeholder="Sua renda mensal (R$)"
              type="number"
              value={formData.renda}
              onChange={handleInputChange}
            />
            <Button
              onClick={calculateFinancing}
              className="w-full bg-[#0057FF] hover:bg-[#0047CC]"
            >
              Calcular Financiamento
            </Button>
          </CardContent>
        </Card>

        {simulation && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Resultado da Simulação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Valor financiado</p>
                  <p className="text-xl font-bold text-[#0057FF]">
                    R$ {simulation.valorFinanciado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">Taxa de juros: {simulation.taxa}% ao mês</p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Opções de Parcelamento:</h4>
                  {simulation.parcelas.map((parcela: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{parcela.meses}x de R$ {parcela.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                        <p className="text-sm text-gray-500">Total: R$ {parcela.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={sendToWhatsApp}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Solicitar via WhatsApp
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Financiamento;

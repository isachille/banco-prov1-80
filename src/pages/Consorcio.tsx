
import React, { useState } from 'react';
import { ArrowLeft, Users, Calculator, FileText, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import MobileLayout from '@/components/MobileLayout';

const Consorcio = () => {
  const navigate = useNavigate();
  const [simulationData, setSimulationData] = useState({
    type: '',
    value: '',
    installments: ''
  });

  const consortiumTypes = [
    { value: 'automovel', label: 'Automóvel', icon: '🚗' },
    { value: 'imovel', label: 'Imóvel', icon: '🏠' },
    { value: 'moto', label: 'Motocicleta', icon: '🏍️' },
    { value: 'servicos', label: 'Serviços', icon: '🔧' }
  ];

  const calculateInstallment = () => {
    const value = parseFloat(simulationData.value.replace(/\D/g, '')) / 100;
    const installments = parseInt(simulationData.installments);
    if (value && installments) {
      return (value / installments).toLocaleString('pt-BR', { 
        style: 'currency', 
        currency: 'BRL' 
      });
    }
    return 'R$ 0,00';
  };

  return (
    <MobileLayout>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Consórcio</h1>
        </div>

        {/* Simulador */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calculator className="mr-2 h-5 w-5" />
              Simular Consórcio
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tipo de Consórcio</label>
              <Select value={simulationData.type} onValueChange={(value) => 
                setSimulationData({...simulationData, type: value})
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {consortiumTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Valor do Bem (R$)</label>
              <Input
                placeholder="R$ 0,00"
                value={simulationData.value}
                onChange={(e) => setSimulationData({...simulationData, value: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Número de Parcelas</label>
              <Select value={simulationData.installments} onValueChange={(value) => 
                setSimulationData({...simulationData, installments: value})
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="60">60 meses</SelectItem>
                  <SelectItem value="80">80 meses</SelectItem>
                  <SelectItem value="100">100 meses</SelectItem>
                  <SelectItem value="120">120 meses</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {simulationData.value && simulationData.installments && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-600">Parcela estimada</p>
                <p className="text-2xl font-bold text-blue-800">{calculateInstallment()}</p>
              </div>
            )}

            <Button className="w-full">
              Solicitar Proposta
            </Button>
          </CardContent>
        </Card>

        {/* Tipos de Consórcio */}
        <div className="grid grid-cols-2 gap-3">
          {consortiumTypes.map((type) => (
            <Card key={type.value} className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-4 text-center">
                <div className="text-3xl mb-2">{type.icon}</div>
                <p className="font-semibold">{type.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Meus Consórcios */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Meus Consórcios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-center py-8">
              Você ainda não possui consórcios ativos
            </p>
          </CardContent>
        </Card>
      </div>
    </MobileLayout>
  );
};

export default Consorcio;


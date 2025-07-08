
import React, { useState } from 'react';
import { ArrowLeft, Banknote, Calculator, Shield, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import MobileLayout from '@/components/MobileLayout';

const Emprestimo = () => {
  const navigate = useNavigate();
  const [loanData, setLoanData] = useState({
    type: '',
    value: '',
    installments: ''
  });

  const loanTypes = [
    { 
      value: 'pessoal', 
      label: 'Empréstimo Pessoal', 
      rate: '2.5% a.m.',
      description: 'Sem necessidade de garantia'
    },
    { 
      value: 'fgts', 
      label: 'Antecipação FGTS', 
      rate: '1.8% a.m.',
      description: 'Garantia do saldo do FGTS'
    },
    { 
      value: 'veiculo', 
      label: 'Com Garantia de Veículo', 
      rate: '1.2% a.m.',
      description: 'Veículo como garantia'
    },
    { 
      value: 'imovel', 
      label: 'Com Garantia de Imóvel', 
      rate: '0.9% a.m.',
      description: 'Imóvel como garantia'
    }
  ];

  const calculateLoan = () => {
    const value = parseFloat(loanData.value.replace(/\D/g, '')) / 100;
    const installments = parseInt(loanData.installments);
    const selectedType = loanTypes.find(t => t.value === loanData.type);
    
    if (value && installments && selectedType) {
      const rate = parseFloat(selectedType.rate.replace(/\D/g, '')) / 100;
      const monthlyPayment = (value * rate * Math.pow(1 + rate, installments)) / 
                            (Math.pow(1 + rate, installments) - 1);
      
      return monthlyPayment.toLocaleString('pt-BR', { 
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
          <h1 className="text-2xl font-bold">Empréstimos</h1>
        </div>

        {/* Simulador */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calculator className="mr-2 h-5 w-5" />
              Simular Empréstimo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tipo de Empréstimo</label>
              <Select value={loanData.type} onValueChange={(value) => 
                setLoanData({...loanData, type: value})
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {loanTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label} - {type.rate}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Valor Desejado (R$)</label>
              <Input
                placeholder="R$ 0,00"
                value={loanData.value}
                onChange={(e) => setLoanData({...loanData, value: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Número de Parcelas</label>
              <Select value={loanData.installments} onValueChange={(value) => 
                setLoanData({...loanData, installments: value})
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12">12 meses</SelectItem>
                  <SelectItem value="24">24 meses</SelectItem>
                  <SelectItem value="36">36 meses</SelectItem>
                  <SelectItem value="48">48 meses</SelectItem>
                  <SelectItem value="60">60 meses</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {loanData.value && loanData.installments && loanData.type && (
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-600">Parcela estimada</p>
                <p className="text-2xl font-bold text-green-800">{calculateLoan()}</p>
              </div>
            )}

            <Button className="w-full">
              Solicitar Empréstimo
            </Button>
          </CardContent>
        </Card>

        {/* Tipos de Empréstimo */}
        <div className="space-y-3">
          {loanTypes.map((type) => (
            <Card key={type.value} className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="font-semibold">{type.label}</p>
                      <p className="text-sm text-gray-600">{type.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-600">{type.rate}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Meus Empréstimos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Meus Empréstimos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-center py-8">
              Você não possui empréstimos ativos
            </p>
          </CardContent>
        </Card>
      </div>
    </MobileLayout>
  );
};

export default Emprestimo;


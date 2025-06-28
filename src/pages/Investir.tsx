
import React from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { TrendingUp, DollarSign, Bitcoin } from 'lucide-react';

const Investir = () => {
  const investmentOptions = [
    {
      id: 1,
      name: 'CDB',
      description: 'Certificado de Depósito Bancário',
      expectedReturn: '12% ao ano',
      risk: 'Baixo',
      icon: DollarSign,
      color: 'bg-green-100 text-green-600'
    },
    {
      id: 2,
      name: 'Tesouro Direto',
      description: 'Títulos públicos do governo',
      expectedReturn: '10% ao ano',
      risk: 'Muito Baixo',
      icon: TrendingUp,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 3,
      name: 'Cripto',
      description: 'Criptomoedas diversas',
      expectedReturn: 'Variável',
      risk: 'Alto',
      icon: Bitcoin,
      color: 'bg-orange-100 text-orange-600'
    }
  ];

  const handleInvestNow = () => {
    toast.info('Funcionalidade em breve! Estamos trabalhando para oferecer as melhores opções de investimento.');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-[#1F1F1F] mb-6">Opções de Investimento</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {investmentOptions.map((option) => (
            <div
              key={option.id}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={`w-12 h-12 rounded-lg ${option.color} flex items-center justify-center mb-4`}>
                <option.icon className="w-6 h-6" />
              </div>
              
              <h3 className="text-lg font-bold text-[#1F1F1F] mb-2">{option.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{option.description}</p>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Rentabilidade esperada:</span>
                  <span className="text-sm font-medium text-green-600">{option.expectedReturn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Risco:</span>
                  <span className={`text-sm font-medium ${
                    option.risk === 'Baixo' || option.risk === 'Muito Baixo' 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {option.risk}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button
            onClick={handleInvestNow}
            className="bg-[#0057FF] hover:bg-[#0047CC] text-white font-medium py-3 px-8"
          >
            Investir agora
          </Button>
          <p className="text-sm text-gray-500 mt-2">
            Funcionalidade em desenvolvimento
          </p>
        </div>
      </div>
    </div>
  );
};

export default Investir;

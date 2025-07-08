
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Car, Home, TrendingUp, User, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Emprestimo = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState('');

  const loanFeatures = [
    {
      icon: Shield,
      title: 'Saque-aniversário FGTS',
      description: 'Se você tem fundo de garantia, confira as condições.',
      badge: 'Não compromete a sua renda',
      action: 'Saiba mais',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    }
  ];

  const loanTypes = [
    {
      icon: Car,
      title: 'Quero um veículo',
      description: 'Financiamento de veículos',
      route: '/financiamento'
    },
    {
      icon: Home,
      title: 'Quero um imóvel',
      description: 'Financiamento imobiliário',
      route: '/financiamento-imovel'
    }
  ];

  const managementOptions = [
    {
      icon: User,
      title: 'Portabilidade de Consignado',
      description: 'Traga seu empréstimo para cá',
      bgColor: 'bg-pink-50 dark:bg-pink-900/20'
    },
    {
      icon: TrendingUp,
      title: 'Meus Limites de Crédito',
      description: 'Consulte seus limites disponíveis',
      bgColor: 'bg-pink-50 dark:bg-pink-900/20'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/home')}
              className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Empréstimos</h1>
              <p className="text-pink-100">Confira o que temos para você</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 -mt-4 space-y-6">
        {/* FGTS Feature */}
        {loanFeatures.map((feature, index) => (
          <Card key={index} className="shadow-lg border-l-4 border-blue-500">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 ${feature.bgColor} rounded-full flex items-center justify-center flex-shrink-0`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <div className="flex-1">
                  <Badge variant="secondary" className="mb-2 bg-blue-100 text-blue-800">
                    {feature.badge}
                  </Badge>
                  <h3 className="font-bold text-lg text-foreground mb-1">{feature.title}</h3>
                  <p className="text-muted-foreground mb-3">{feature.description}</p>
                  <Button variant="link" className="p-0 h-auto text-blue-600">
                    {feature.action}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Loan Types */}
        <div>
          <h2 className="text-lg font-bold text-foreground mb-4">Conquiste seus bens</h2>
          <div className="grid grid-cols-2 gap-4">
            {loanTypes.map((type, index) => (
              <Card 
                key={index} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(type.route)}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <type.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{type.title}</h3>
                  <p className="text-sm text-muted-foreground">{type.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Management Options */}
        <div>
          <h2 className="text-lg font-bold text-foreground mb-4">Gerencie seus empréstimos</h2>
          <div className="grid grid-cols-2 gap-4">
            {managementOptions.map((option, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className={`w-12 h-12 ${option.bgColor} rounded-full flex items-center justify-center mb-3`}>
                    <option.icon className="w-6 h-6 text-pink-600" />
                  </div>
                  <h3 className="font-semibold text-sm text-foreground mb-1">{option.title}</h3>
                  <p className="text-xs text-muted-foreground">{option.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Open Finance */}
        <Card 
          className="bg-gradient-to-r from-pink-500 to-pink-600 text-white cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate('/open-finance')}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Aumente suas chances de ter melhores ofertas de crédito</h3>
                  <p className="text-pink-100 mt-1">Conecte contas via Open Finance</p>
                </div>
              </div>
              <ChevronRight className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Emprestimo;

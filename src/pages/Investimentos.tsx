
import React from 'react';
import { ArrowLeft, TrendingUp, DollarSign, BarChart3, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const Investimentos = () => {
  const navigate = useNavigate();

  const investments = [
    { name: 'Tesouro Selic', yield: '10.75%', risk: 'Baixo', color: 'text-green-600' },
    { name: 'CDB', yield: '12.50%', risk: 'Baixo', color: 'text-green-600' },
    { name: 'LCI/LCA', yield: '9.80%', risk: 'Baixo', color: 'text-green-600' },
    { name: 'Fundos Imobiliários', yield: '8.45%', risk: 'Médio', color: 'text-yellow-600' },
    { name: 'Ações', yield: '15.20%', risk: 'Alto', color: 'text-red-600' }
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Baixo':
        return 'bg-green-100 text-green-800';
      case 'Médio':
        return 'bg-yellow-100 text-yellow-800';
      case 'Alto':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6 pb-20">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Investimentos</h1>
      </div>

      <Card className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Patrimônio Total</p>
              <p className="text-2xl font-bold">R$ 0,00</p>
              <p className="text-green-100 text-sm">Rentabilidade: +0,00%</p>
            </div>
            <TrendingUp className="h-12 w-12 text-green-100" />
          </div>
        </CardContent>
      </Card>

      {/* Perfil do Investidor */}
      <Card className="border-2 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <User className="w-8 h-8 text-blue-600" />
              <div>
                <p className="font-medium">Perfil do Investidor</p>
                <p className="text-sm text-gray-600">
                  {localStorage.getItem('investor_profile') 
                    ? `Perfil: ${localStorage.getItem('investor_profile')?.charAt(0).toUpperCase()}${localStorage.getItem('investor_profile')?.slice(1)}`
                    : 'Defina seu perfil de investidor'
                  }
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/perfil-investidor')}
            >
              {localStorage.getItem('investor_profile') ? 'Refazer' : 'Definir'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div>
        <h3 className="text-lg font-semibold mb-4">Produtos Disponíveis</h3>
        <div className="space-y-4">
          {investments.map((investment, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-medium">{investment.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs ${getRiskColor(investment.risk)}`}>
                        {investment.risk}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <BarChart3 className="h-4 w-4 text-gray-400" />
                        <span className={`font-medium ${investment.color}`}>
                          {investment.yield}
                        </span>
                        <span className="text-sm text-gray-500">a.a.</span>
                      </div>
                    </div>
                  </div>
                  <Button 
                    size="sm"
                    onClick={() => {
                      const profile = localStorage.getItem('investor_profile');
                      if (!profile) {
                        navigate('/perfil-investidor');
                      } else {
                        toast.success('Investimento realizado!');
                      }
                    }}
                  >
                    Investir
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5" />
            <span>Meus Investimentos</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-8">
            Você ainda não possui investimentos
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Investimentos;

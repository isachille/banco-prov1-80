
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, PiggyBank, TrendingUp, Clock, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const Cofrinho = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [amount, setAmount] = useState('');
  const [period, setPeriod] = useState('');
  const [isInvesting, setIsInvesting] = useState(false);

  const investmentOptions = [
    { value: '3', label: '3 meses', rate: 0.85 },
    { value: '6', label: '6 meses', rate: 1.2 },
    { value: '12', label: '12 meses', rate: 1.8 }
  ];

  const projects = [
    { name: 'Grafeno', icon: '⚗️', description: 'Tecnologia do futuro' },
    { name: 'Energia Solar', icon: '☀️', description: 'Sustentabilidade' },
    { name: 'Criptoativos', icon: '₿', description: 'Moedas digitais' },
    { name: 'Ações Estrangeiras', icon: '📈', description: 'Mercado global' }
  ];

  const selectedOption = investmentOptions.find(opt => opt.value === period);
  const estimatedReturn = amount && selectedOption ? 
    (parseFloat(amount) * (selectedOption.rate / 100) * parseInt(period)).toFixed(2) : '0.00';

  const handleInvest = async () => {
    if (!amount || !period) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos para continuar",
        variant: "destructive",
      });
      return;
    }

    if (parseFloat(amount) < 50) {
      toast({
        title: "Erro",
        description: "O valor mínimo para investir é R$ 50,00",
        variant: "destructive",
      });
      return;
    }

    setIsInvesting(true);
    
    // Simular investimento
    setTimeout(() => {
      toast({
        title: "Investimento realizado!",
        description: "Seu dinheiro foi aplicado no Cofrinho - Fundo Pro",
      });
      setIsInvesting(false);
      navigate('/home');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-6">
        <div className="flex items-center space-x-4 mb-4">
          <button
            onClick={() => navigate('/home')}
            className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2">
            <PiggyBank className="w-6 h-6" />
            <h1 className="text-xl font-bold">Cofrinho - Fundo Pro</h1>
          </div>
        </div>
        <p className="text-sm opacity-90">Guarde e invista em projetos sustentáveis</p>
      </div>

      <div className="p-6 -mt-4">
        {/* Sobre o Fundo */}
        <Card className="mb-6 border-purple-200 dark:border-purple-800">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-foreground">
              <Leaf className="w-5 h-5 text-green-600" />
              <span>Investimento Sustentável</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Seu dinheiro é investido em projetos inovadores e sustentáveis, 
              gerando retorno financeiro e impacto positivo no mundo.
            </p>
            
            <div className="grid grid-cols-2 gap-3">
              {projects.map((project, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-lg">{project.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{project.name}</p>
                    <p className="text-xs text-muted-foreground">{project.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Formulário de Investimento */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-foreground">Fazer Investimento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Valor a investir (mín. R$ 50)
              </label>
              <Input
                type="number"
                placeholder="0,00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-lg"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Período de investimento
              </label>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Escolha o período" />
                </SelectTrigger>
                <SelectContent>
                  {investmentOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label} - {option.rate}% ao mês
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {amount && period && (
              <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Valor investido:</span>
                      <span className="font-medium text-foreground">R$ {parseFloat(amount).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Período:</span>
                      <span className="font-medium text-foreground">{period} meses</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Rendimento estimado:</span>
                      <span className="font-medium text-green-600">+R$ {estimatedReturn}</span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="font-medium text-foreground">Total estimado:</span>
                        <span className="font-bold text-lg text-purple-600">
                          R$ {(parseFloat(amount) + parseFloat(estimatedReturn)).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        {/* Informações importantes */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-muted-foreground">
                  Taxa de administração: apenas 0,2% ao mês
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-muted-foreground">
                  Atualizações do saldo a cada 21 dias
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <PiggyBank className="w-4 h-4 text-purple-600" />
                <span className="text-muted-foreground">
                  Resgate automático no final do período
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button
          onClick={handleInvest}
          disabled={!amount || !period || isInvesting}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-6 text-lg"
        >
          {isInvesting ? 'Processando...' : 'Investir no Cofrinho'}
        </Button>
      </div>
    </div>
  );
};

export default Cofrinho;

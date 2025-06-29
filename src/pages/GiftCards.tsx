
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const GiftCards = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const card = location.state?.card;
  
  const [selectedValue, setSelectedValue] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!card) {
    navigate('/home');
    return null;
  }

  const handlePurchase = async () => {
    if (!selectedValue) {
      toast({
        title: "Erro",
        description: "Selecione um valor para continuar",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    // Simular processamento de pagamento
    setTimeout(() => {
      toast({
        title: "Gift Card adquirido!",
        description: `${card.name} de R$ ${selectedValue} foi adicionado à sua conta`,
      });
      setIsProcessing(false);
      navigate('/home');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-[#0057FF] text-white p-6">
        <div className="flex items-center space-x-4 mb-4">
          <button
            onClick={() => navigate('/home')}
            className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">Gift Cards</h1>
        </div>
      </div>

      <div className="p-6 -mt-4">
        <Card className="mb-6">
          <div className="relative">
            <img 
              src={card.image} 
              alt={card.name}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-t-lg" />
            <div className="absolute bottom-0 left-0 p-6 text-white">
              <h2 className="text-2xl font-bold">{card.name}</h2>
              <p className="text-sm opacity-90">{card.description}</p>
            </div>
          </div>
          
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Escolha o valor:</h3>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {card.values.map((value) => (
                <button
                  key={value}
                  onClick={() => setSelectedValue(value)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedValue === value
                      ? 'border-[#0057FF] bg-[#0057FF]/10 text-[#0057FF]'
                      : 'border-gray-200 dark:border-gray-700 hover:border-[#0057FF]/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-lg">R$ {value}</span>
                    {selectedValue === value && (
                      <Check className="w-5 h-5 text-[#0057FF]" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            {selectedValue && (
              <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 mb-6">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-foreground">Total a pagar:</span>
                    <span className="text-xl font-bold text-[#0057FF]">R$ {selectedValue}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    O valor será debitado do seu saldo disponível
                  </p>
                </CardContent>
              </Card>
            )}

            <Button
              onClick={handlePurchase}
              disabled={!selectedValue || isProcessing}
              className="w-full bg-[#0057FF] hover:bg-[#0057FF]/90 text-white py-6 text-lg"
            >
              {isProcessing ? 'Processando...' : 'Comprar Gift Card'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Como funciona?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>• O gift card será enviado por e-mail em até 5 minutos</p>
              <p>• Você pode presentear enviando o código para outra pessoa</p>
              <p>• Os códigos têm validade de 12 meses</p>
              <p>• Em caso de problemas, entre em contato com nosso suporte</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GiftCards;

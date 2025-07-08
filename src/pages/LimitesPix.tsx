import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const LimitesPix = () => {
  const navigate = useNavigate();
  const [requestedLimit, setRequestedLimit] = useState('');
  const [justification, setJustification] = useState('');

  const currentLimits = {
    daily: 5000,
    monthly: 20000,
    perTransaction: 5000
  };

  const handleLimitRequest = () => {
    if (!requestedLimit || !justification) {
      toast.error('Preencha todos os campos');
      return;
    }

    const newLimit = parseFloat(requestedLimit);
    if (newLimit <= currentLimits.daily) {
      toast.error('O novo limite deve ser maior que o atual');
      return;
    }

    // Salvar solicitação para análise dos analistas
    const requests = JSON.parse(localStorage.getItem('limit_requests') || '[]');
    const newRequest = {
      id: Date.now().toString(),
      type: 'pix_limit',
      currentLimit: currentLimits.daily,
      requestedLimit: newLimit,
      justification,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    requests.push(newRequest);
    localStorage.setItem('limit_requests', JSON.stringify(requests));

    toast.success('Solicitação enviada para análise!');
    setRequestedLimit('');
    setJustification('');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-[#001B3A] to-[#003F5C] text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/pix')}
              className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Limites PIX</h1>
              <p className="text-blue-100">Gerencie seus limites de transação</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6 max-w-md space-y-6">
        {/* Limites Atuais */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="mr-2 h-5 w-5" />
              Limites Atuais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Por transação</p>
                <p className="text-sm text-gray-600">Limite máximo por PIX</p>
              </div>
              <p className="font-bold text-lg">R$ {currentLimits.perTransaction.toLocaleString('pt-BR')}</p>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Diário</p>
                <p className="text-sm text-gray-600">Limite de 24 horas</p>
              </div>
              <p className="font-bold text-lg">R$ {currentLimits.daily.toLocaleString('pt-BR')}</p>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Mensal</p>
                <p className="text-sm text-gray-600">Limite de 30 dias</p>
              </div>
              <p className="font-bold text-lg">R$ {currentLimits.monthly.toLocaleString('pt-BR')}</p>
            </div>
          </CardContent>
        </Card>

        {/* Solicitar Aumento */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Solicitar Aumento de Limite
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="limit">Novo Limite Diário (R$)</Label>
              <Input
                id="limit"
                type="number"
                placeholder="Ex: 10000"
                value={requestedLimit}
                onChange={(e) => setRequestedLimit(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="justification">Justificativa</Label>
              <Input
                id="justification"
                placeholder="Explique o motivo da solicitação"
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
              />
            </div>
            
            <Button 
              onClick={handleLimitRequest}
              className="w-full bg-gradient-to-r from-[#001B3A] to-[#003F5C]"
            >
              Solicitar Aumento
            </Button>
          </CardContent>
        </Card>

        {/* Informações */}
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm text-yellow-800 font-medium">Importante</p>
                <p className="text-xs text-yellow-700 mt-1">
                  Solicitações de aumento de limite passam por análise de nossos analistas. 
                  O prazo de resposta é de até 48 horas.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LimitesPix;
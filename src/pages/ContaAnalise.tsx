
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, CheckCircle, Mail, Star, CreditCard, Shield, Recycle, Briefcase } from 'lucide-react';

const ContaAnalise = () => {
  const navigate = useNavigate();

  const handlePremiumClick = () => {
    const whatsappNumber = '5561982021656';
    const message = 'Olá! Tenho interesse no plano PREMIUM do ProBank. Gostaria de mais informações para ativação.';
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <Card className="text-center">
          <CardHeader>
            <div className="text-6xl mb-4">⏳</div>
            <CardTitle className="text-2xl font-bold text-[#0057FF]">Conta em Análise</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-gray-600">
              Recebemos sua solicitação de abertura de conta. Nossa equipe está analisando seus documentos.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm text-green-700">Documentos recebidos</span>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
                <span className="text-sm text-yellow-700">Análise em andamento</span>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <Mail className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-blue-700">Retorno em até 2 dias úteis</span>
              </div>
            </div>

            {/* Seção Premium */}
            <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="text-center mb-3">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <h3 className="text-lg font-bold text-yellow-700 dark:text-yellow-300">PREMIUM</h3>
                  <Star className="h-5 w-5 text-yellow-500" />
                </div>
                <p className="text-sm text-gray-600">Aproveite para conhecer nosso plano premium!</p>
              </div>
              
              <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300 mb-4">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                  <span>Cartão Black</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                  <span>Limite de até R$10.000</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                  <span>Seguro de vida, celular e compras online</span>
                </div>
                <div className="flex items-center gap-2">
                  <Recycle className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                  <span>Cashback sustentável em todas as transações</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                  <span>Vantagens exclusivas e atendimento prioritário</span>
                </div>
              </div>
              
              <div className="text-center mb-3">
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  Valor da anuidade: <span className="text-green-600 dark:text-green-400">R$ 24,99</span>
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">(cobrados uma vez ao ano)</p>
              </div>
              
              <Button
                onClick={handlePremiumClick}
                className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white font-semibold"
              >
                Quero ser PREMIUM
              </Button>
            </div>
            
            <div className="pt-4 border-t">
              <p className="text-sm text-gray-500 mb-4">
                Você receberá um e-mail assim que sua conta for aprovada.
              </p>
              
              <Button
                onClick={() => navigate('/login')}
                variant="outline"
                className="w-full"
              >
                Voltar ao Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContaAnalise;


import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, CheckCircle, Mail } from 'lucide-react';

const ContaAnalise = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
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
  );
};

export default ContaAnalise;

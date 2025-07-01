
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Mail, Phone } from 'lucide-react';

const AguardandoAprovacao = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-blue-900 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="w-full max-w-md">
        <Card className="text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <img 
                src="/lovable-uploads/4712549c-a705-4aad-8498-4702dc3cdd8f.png" 
                alt="Banco Pro" 
                className="h-16 w-auto"
              />
            </div>
            <CardTitle className="text-2xl font-bold text-[#0057FF] flex items-center justify-center gap-2">
              <Clock className="h-6 w-6" />
              Conta em Análise
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-gray-700 leading-relaxed">
                Sua conta está em análise. Assim que for aprovada, você receberá um aviso e poderá movimentar saldos normalmente.
              </p>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-800">Próximos passos:</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Aguarde a análise dos nossos especialistas</li>
                <li>• Você receberá uma notificação por email</li>
                <li>• O processo pode levar até 24 horas</li>
              </ul>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-2">Precisa de ajuda?</p>
              <div className="flex justify-center space-x-4 text-sm">
                <div className="flex items-center gap-1 text-[#0057FF]">
                  <Mail className="h-4 w-4" />
                  <span>suporte@bancopro.com.br</span>
                </div>
                <div className="flex items-center gap-1 text-[#0057FF]">
                  <Phone className="h-4 w-4" />
                  <span>(61) 98208-4279</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AguardandoAprovacao;

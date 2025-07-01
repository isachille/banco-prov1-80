
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Mail, Phone, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
              Aguardando Aprovação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-gray-700 leading-relaxed">
                Sua conta está aguardando aprovação manual por nossa equipe. Você será notificado assim que ela for validada.
              </p>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-800">O que acontece agora:</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Nossa equipe está analisando seus dados</li>
                <li>• Você receberá uma notificação por email</li>
                <li>• O processo pode levar até 24 horas úteis</li>
                <li>• Após aprovação, terá acesso completo à plataforma</li>
              </ul>
            </div>

            <div className="pt-4 border-t border-gray-200 space-y-4">
              <p className="text-sm text-gray-800 font-medium">Precisa de ajuda?</p>
              
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.location.href = 'mailto:suporte@bancopro.com.br'}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  suporte@bancopro.com.br
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.open('https://wa.me/5561982084279', '_blank')}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  WhatsApp: (61) 98208-4279
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AguardandoAprovacao;


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, Mail, Phone, MessageCircle } from 'lucide-react';

const ContaRecusada = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 dark:from-gray-900 dark:to-red-900 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="w-full max-w-md">
        <Card className="text-center border-red-200">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <img 
                src="/lovable-uploads/4712549c-a705-4aad-8498-4702dc3cdd8f.png" 
                alt="Banco Pro" 
                className="h-16 w-auto"
              />
            </div>
            <CardTitle className="text-2xl font-bold text-red-600 flex items-center justify-center gap-2">
              <XCircle className="h-6 w-6" />
              Conta Recusada
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-gray-700 leading-relaxed">
                Sua conta foi recusada. Em caso de dúvidas, entre em contato pelo WhatsApp (61) 98208-4279 ou suporte@bancopro.com.br.
              </p>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-800">Possíveis motivos:</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Documentação incompleta ou inválida</li>
                <li>• Dados inconsistentes nas informações fornecidas</li>
                <li>• Não atendimento aos critérios de aprovação</li>
                <li>• Problemas na verificação de identidade</li>
              </ul>
            </div>

            <div className="pt-4 border-t border-gray-200 space-y-4">
              <p className="text-sm text-gray-800 font-medium">Entre em contato conosco:</p>
              
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

export default ContaRecusada;

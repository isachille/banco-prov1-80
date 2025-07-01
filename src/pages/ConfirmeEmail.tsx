
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, ArrowLeft } from 'lucide-react';

const ConfirmeEmail = () => {
  const navigate = useNavigate();

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
              <Mail className="h-6 w-6" />
              Confirme seu E-mail
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-gray-700 leading-relaxed">
                Enviamos um link de confirmação para seu e-mail. Clique no link para ativar sua conta.
              </p>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-800">O que fazer agora:</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Verifique sua caixa de entrada</li>
                <li>• Procure também na pasta de spam</li>
                <li>• Clique no link de confirmação</li>
                <li>• Retorne para fazer login</li>
              </ul>
            </div>

            <div className="pt-4 border-t border-gray-200 space-y-4">
              <p className="text-sm text-gray-800 font-medium">Não recebeu o e-mail?</p>
              
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.location.reload()}
                >
                  Tentar Novamente
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/login')}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar ao Login
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConfirmeEmail;

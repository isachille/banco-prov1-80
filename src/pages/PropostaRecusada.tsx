import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { XCircle, MessageCircle, ArrowLeft, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PropostaRecusada = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Olá, gostaria de entender melhor os motivos da recusa da minha proposta de financiamento (Código: ${id}). Podem me ajudar?`
    );
    window.open(`https://wa.me/5511999999999?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-6">
      <Card className="w-full max-w-md mx-auto shadow-lg border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-red-700 mb-2">
            Proposta Não Aprovada
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            Código: <span className="font-medium text-red-600">#{id}</span>
          </p>
        </CardHeader>
        
        <CardContent className="text-center space-y-6">
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <h3 className="font-semibold text-red-800 mb-2">
              Resultado da Análise
            </h3>
            <p className="text-red-700 text-sm leading-relaxed">
              Infelizmente, após análise criteriosa, identificamos que seu perfil 
              atual não se tornou apto para a aprovação do financiamento solicitado 
              neste momento.
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2">
              Precisa de Esclarecimentos?
            </h3>
            <p className="text-blue-700 text-sm mb-3">
              Nossa equipe está disponível para esclarecer dúvidas e orientar sobre 
              possíveis alternativas ou melhorias em seu perfil.
            </p>
            <Button 
              onClick={handleWhatsApp}
              className="w-full bg-green-600 hover:bg-green-700 text-white text-sm"
              size="sm"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Falar no WhatsApp
            </Button>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <div className="flex items-center justify-center mb-2">
              <Phone className="w-5 h-5 text-yellow-600 mr-2" />
              <span className="font-semibold text-yellow-800">Contato Direto</span>
            </div>
            <p className="text-yellow-700 text-sm">
              <strong>Email:</strong> financiamento@promotors.com.br<br />
              <strong>Telefone:</strong> (11) 9999-9999
            </p>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>Agradecemos seu interesse em nossos serviços.</p>
            <p className="font-medium mt-1">Pro Motors Financiamento</p>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <Button 
              onClick={() => navigate('/simulacao')}
              className="w-full bg-primary hover:bg-primary/90"
            >
              Nova Simulação
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => navigate('/home')}
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Início
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PropostaRecusada;
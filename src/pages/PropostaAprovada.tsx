import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle, Phone, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PropostaAprovada = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-6">
      <Card className="w-full max-w-md mx-auto shadow-lg border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-green-700 mb-2">
            Parabéns! Proposta Aprovada
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            Código: <span className="font-medium text-green-600">#{id}</span>
          </p>
        </CardHeader>
        
        <CardContent className="text-center space-y-6">
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <h3 className="font-semibold text-green-800 mb-2">
              Próximos Passos
            </h3>
            <p className="text-green-700 text-sm leading-relaxed">
              Sua proposta de financiamento foi aprovada! Em breve, um de nossos analistas 
              especializados entrará em contato com você para dar continuidade ao processo 
              e finalizar todos os detalhes do seu financiamento.
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-center mb-2">
              <Phone className="w-5 h-5 text-blue-600 mr-2" />
              <span className="font-semibold text-blue-800">Contato</span>
            </div>
            <p className="text-blue-700 text-sm">
              Fique atento ao seu telefone e e-mail. O contato será realizado em até 24 horas úteis.
            </p>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>Obrigado por escolher nossos serviços!</p>
            <p className="font-medium mt-1">Pro Motors Financiamento</p>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <Button 
              onClick={() => navigate('/home')}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              Voltar ao Início
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => navigate('/propostas-historico')}
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Ver Minhas Propostas
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PropostaAprovada;
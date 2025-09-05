import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Download, Home } from 'lucide-react';

export const ContratoAssinado: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { codigoContrato, nomeCliente } = location.state || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>
          <CardTitle className="text-3xl text-green-700">Contrato Assinado com Sucesso!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-4">Detalhes da Assinatura</h3>
            <div className="space-y-2">
              <p><strong>Cliente:</strong> {nomeCliente || 'Não informado'}</p>
              <p><strong>Código do Contrato:</strong> <span className="font-mono">{codigoContrato || 'Não informado'}</span></p>
              <p><strong>Data da Assinatura:</strong> {new Date().toLocaleDateString('pt-BR')}</p>
              <p><strong>Status:</strong> <span className="text-green-600 font-semibold">Assinado</span></p>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Próximos Passos</h4>
            <p className="text-sm text-blue-700">
              • O contrato foi enviado para seu e-mail<br/>
              • Nossa equipe entrará em contato para os próximos procedimentos<br/>
              • Você receberá o cronograma de pagamentos em breve
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <Button 
              variant="outline" 
              onClick={() => window.print()}
            >
              <Download className="mr-2 h-4 w-4" />
              Imprimir Comprovante
            </Button>
            <Button 
              onClick={() => navigate('/')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Home className="mr-2 h-4 w-4" />
              Voltar ao Início
            </Button>
          </div>

          <div className="text-xs text-gray-500 border-t pt-4">
            <p>Este documento foi assinado digitalmente e possui validade jurídica.</p>
            <p>Código de verificação: {codigoContrato}-{Date.now()}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
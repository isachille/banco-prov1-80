import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { XCircle, MessageCircle, ArrowLeft, Phone, Mail, Car, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProposalData {
  id: string;
  codigo: string;
  cliente_nome: string;
  cliente_cpf: string;
  veiculo: string;
  valor_veiculo: number;
  valor_entrada: number;
  parcelas: number;
  valor_parcela: number;
}

const PropostaRecusada = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [proposalData, setProposalData] = useState<ProposalData | null>(null);

  useEffect(() => {
    if (id) {
      const data = localStorage.getItem(`proposta_${id}`);
      if (data) {
        setProposalData(JSON.parse(data));
      }
    }
  }, [id]);

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
            Código: <span className="font-medium text-red-600">#{proposalData?.codigo || id}</span>
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {proposalData && (
            <>
              {/* Dados do Cliente */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center gap-2 mb-3">
                  <User className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-blue-800">Dados do Cliente</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Nome:</span>
                    <div className="text-gray-900">{proposalData.cliente_nome}</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">CPF:</span>
                    <div className="text-gray-900">{proposalData.cliente_cpf}</div>
                  </div>
                </div>
              </div>

              {/* Dados do Veículo */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center gap-2 mb-3">
                  <Car className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-blue-800">Veículo Solicitado</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Veículo:</span>
                    <div className="text-gray-900">{proposalData.veiculo}</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Valor:</span>
                    <div className="text-gray-900">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(proposalData.valor_veiculo)}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Entrada:</span>
                    <div className="text-gray-900">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(proposalData.valor_entrada)}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Parcelas:</span>
                    <div className="text-gray-900">
                      {proposalData.parcelas}x de {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(proposalData.valor_parcela)}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="bg-red-50 rounded-lg p-4 border border-red-200 text-center">
            <div className="flex justify-center mb-3">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="font-semibold text-red-800 mb-2">
              Resultado da Análise
            </h3>
            <p className="text-red-700 text-sm leading-relaxed">
              Após análise detalhada, sua proposta de financiamento não pôde ser aprovada 
              neste momento. Isso pode ocorrer por diversos fatores relacionados às 
              políticas de crédito vigentes.
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
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle, Phone, ArrowLeft, Car, User, Mail, MessageCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ProposalData {
  id: string;
  codigo: string;
  marca: string;
  modelo: string;
  ano: number;
  valorveiculo: number;
  valorentrada: number;
  parcelas: number;
  valorparcela: number;
  user: {
    nome_completo: string;
    cpf: string;
    email: string;
  };
}

const PropostaAprovada = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [proposalData, setProposalData] = useState<ProposalData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProposalData = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from('propostas_financiamento')
          .select(`
            id,
            codigo,
            marca,
            modelo,
            ano,
            valorveiculo,
            valorentrada,
            parcelas,
            valorparcela,
            user:users(nome_completo, cpf, email)
          `)
          .eq('id', id)
          .eq('status', 'aprovado')
          .single();

        if (error) throw error;
        
        if (data) {
          setProposalData(data as unknown as ProposalData);
        }
      } catch (error) {
        console.error('Erro ao buscar proposta:', error);
        toast.error('Erro ao carregar dados da proposta');
      } finally {
        setLoading(false);
      }
    };

    fetchProposalData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados da proposta...</p>
        </div>
      </div>
    );
  }

  if (!proposalData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-6">
        <Card className="w-full max-w-md mx-auto shadow-lg">
          <CardContent className="text-center p-8">
            <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-700 mb-2">Proposta não encontrada</h2>
            <p className="text-gray-600 mb-6">Não foi possível encontrar os dados desta proposta.</p>
            <Button onClick={() => navigate('/home')} className="w-full">
              Voltar ao Início
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100 flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl mx-auto shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center pb-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold mb-2">
            🎉 Parabéns! Proposta Aprovada pelo Sistema
          </CardTitle>
          <p className="text-green-100 text-lg">
            Protocolo: <span className="font-bold text-white">#{proposalData.codigo}</span>
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6 p-8">
          {/* Dados do Cliente */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-blue-900 text-lg">Dados do Cliente</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <span className="font-semibold text-gray-500 text-xs uppercase">Nome Completo</span>
                <div className="text-gray-900 font-semibold text-lg mt-1">{proposalData.user?.nome_completo}</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <span className="font-semibold text-gray-500 text-xs uppercase">CPF</span>
                <div className="text-gray-900 font-semibold text-lg mt-1 font-mono">
                  {proposalData.user?.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')}
                </div>
              </div>
            </div>
          </div>

          {/* Dados do Veículo */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border-2 border-purple-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                <Car className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-purple-900 text-lg">Veículo Financiado</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm md:col-span-2">
                <span className="font-semibold text-gray-500 text-xs uppercase">Veículo</span>
                <div className="text-gray-900 font-bold text-xl mt-1">
                  {proposalData.marca} {proposalData.modelo} - {proposalData.ano}
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <span className="font-semibold text-gray-500 text-xs uppercase">Valor do Veículo</span>
                <div className="text-purple-700 font-bold text-lg mt-1">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(proposalData.valorveiculo)}
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <span className="font-semibold text-gray-500 text-xs uppercase">Entrada</span>
                <div className="text-purple-700 font-bold text-lg mt-1">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(proposalData.valorentrada)}
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm md:col-span-2">
                <span className="font-semibold text-gray-500 text-xs uppercase">Financiamento</span>
                <div className="text-purple-700 font-bold text-xl mt-1">
                  {proposalData.parcelas}x de {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(proposalData.valorparcela)}
                </div>
              </div>
            </div>
          </div>

          {/* Próximos Passos */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-300 shadow-sm">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
            </div>
            <h3 className="font-bold text-green-900 text-xl text-center mb-3">
              Proposta Aprovada pelo Sistema!
            </h3>
            <p className="text-green-800 text-center leading-relaxed mb-4">
              Sua solicitação de financiamento foi aprovada automaticamente pelo nosso sistema. 
              Em breve, você receberá as próximas instruções para dar continuidade ao processo.
            </p>
          </div>

          {/* Formas de Contato */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border-2 border-blue-200 text-center shadow-sm">
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
              </div>
              <h4 className="font-bold text-blue-900 mb-2">E-mail</h4>
              <p className="text-blue-700 text-sm">
                Verifique sua caixa de entrada em {proposalData.user?.email}
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border-2 border-green-200 text-center shadow-sm">
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
              </div>
              <h4 className="font-bold text-green-900 mb-2">WhatsApp</h4>
              <p className="text-green-700 text-sm">
                Aguarde contato em até 24h úteis
              </p>
            </div>
          </div>

          {/* Informação Adicional */}
          <div className="bg-amber-50 rounded-xl p-5 border-2 border-amber-200 text-center">
            <p className="text-amber-900 font-medium">
              ⏱️ Tempo estimado de resposta: <span className="font-bold">Até 24 horas úteis</span>
            </p>
          </div>

          {/* Rodapé */}
          <div className="text-center pt-4 border-t-2 border-gray-200">
            <p className="text-gray-600 font-medium">Obrigado por escolher nossos serviços!</p>
            <p className="text-gray-900 font-bold text-lg mt-1">Pro Motors Financiamento</p>
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-col gap-3 pt-4">
            <Button 
              onClick={() => navigate('/home')}
              size="lg"
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold shadow-lg"
            >
              Voltar ao Início
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/propostas-historico')}
              className="w-full border-2 border-gray-300 hover:bg-gray-50 font-semibold"
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
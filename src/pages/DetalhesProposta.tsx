
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { ProposalPreview } from '@/components/ProposalPreview';

interface PropostaDetalhada {
  id: string;
  codigo: string;
  marca: string;
  modelo: string;
  ano: number;
  valorVeiculo: number;
  valorEntrada: number;
  parcelas: number;
  valorParcela: number;
  valorTotal: number;
  taxaJuros: number;
  operador?: {
    nome: string;
    telefone: string;
  };
}

interface KYCData {
  nome_completo: string;
  cpf: string;
  data_nascimento: string;
  nome_mae: string;
  profissao: string;
}

const DetalhesProposta = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: proposta, isLoading, error } = useQuery({
    queryKey: ['proposta_detalhes', id],
    queryFn: async () => {
      if (!id) throw new Error('ID da proposta não fornecido');

      const { data, error } = await supabase
        .from('propostas_financiamento')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      // Transformar dados para o formato esperado pelo ProposalPreview
      const proposalData: PropostaDetalhada = {
        id: data.id,
        codigo: data.codigo_proposta,
        marca: data.marca,
        modelo: data.modelo,
        ano: data.ano_veiculo,
        valorVeiculo: data.valor_veiculo,
        valorEntrada: data.valor_entrada,
        parcelas: data.parcelas,
        valorParcela: data.valor_parcela,
        valorTotal: data.valor_total,
        taxaJuros: data.taxa_juros,
        operador: data.operador_nome ? {
          nome: data.operador_nome,
          telefone: data.operador_telefone
        } : undefined
      };

      return {
        proposta: proposalData,
        kycData: {
          nome_completo: data.cliente_nome,
          cpf: data.cliente_cpf,
          data_nascimento: data.cliente_nascimento,
          nome_mae: data.cliente_mae,
          profissao: data.cliente_profissao
        } as KYCData
      };
    },
    enabled: !!id
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#0057FF]"></div>
      </div>
    );
  }

  if (error || !proposta) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Proposta não encontrada</h1>
          <Button onClick={() => navigate('/propostas')}>
            Voltar ao Histórico
          </Button>
        </div>
      </div>
    );
  }

  return (
    <ProposalPreview
      proposal={proposta.proposta}
      kycData={proposta.kycData}
      onBack={() => navigate('/propostas')}
    />
  );
};

export default DetalhesProposta;

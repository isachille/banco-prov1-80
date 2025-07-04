
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

      // Usar RPC para buscar os dados da proposta, já que a tabela ainda não está nos tipos
      const { data, error } = await supabase.rpc('get_proposta_detalhes', {
        proposta_id: id
      });

      if (error) {
        console.error('Erro RPC:', error);
        // Fallback: tentar buscar diretamente (pode não funcionar por enquanto)
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('propostas_financiamento' as any)
          .select('*')
          .eq('id', id)
          .single();

        if (fallbackError) throw fallbackError;
        data[0] = fallbackData;
      }

      if (!data || data.length === 0) {
        throw new Error('Proposta não encontrada');
      }

      const propostaData = data[0];

      // Transformar dados para o formato esperado pelo ProposalPreview
      const proposalData: PropostaDetalhada = {
        id: propostaData.id,
        codigo: propostaData.codigo_proposta,
        marca: propostaData.marca,
        modelo: propostaData.modelo,
        ano: propostaData.ano_veiculo,
        valorVeiculo: propostaData.valor_veiculo,
        valorEntrada: propostaData.valor_entrada,
        parcelas: propostaData.parcelas,
        valorParcela: propostaData.valor_parcela,
        valorTotal: propostaData.valor_total,
        taxaJuros: propostaData.taxa_juros,
        operador: propostaData.operador_nome ? {
          nome: propostaData.operador_nome,
          telefone: propostaData.operador_telefone
        } : undefined
      };

      return {
        proposta: proposalData,
        kycData: {
          nome_completo: propostaData.cliente_nome,
          cpf: propostaData.cliente_cpf,
          data_nascimento: propostaData.cliente_nascimento,
          nome_mae: propostaData.cliente_mae,
          profissao: propostaData.cliente_profissao
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

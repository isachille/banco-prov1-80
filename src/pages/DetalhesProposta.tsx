
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

      try {
        // Buscar dados usando query SQL direta
        const { data, error } = await supabase
          .rpc('get_proposta_detalhes', { proposta_id: id })
          .single();

        if (error) {
          console.error('Erro RPC, tentando query direta:', error);
          
          // Fallback para query direta
          const { data: directData, error: directError } = await supabase
            .from('propostas_financiamento' as any)
            .select('*')
            .eq('id', id)
            .single();

          if (directError) throw directError;
          
          if (!directData) throw new Error('Proposta não encontrada');

          const proposalData: PropostaDetalhada = {
            id: directData.id,
            codigo: directData.codigo_proposta || '',
            marca: directData.marca || '',
            modelo: directData.modelo || '',
            ano: directData.ano_veiculo || 0,
            valorVeiculo: directData.valor_veiculo || 0,
            valorEntrada: directData.valor_entrada || 0,
            parcelas: directData.parcelas || 0,
            valorParcela: directData.valor_parcela || 0,
            valorTotal: directData.valor_total || 0,
            taxaJuros: directData.taxa_juros || 0,
            operador: directData.operador_nome ? {
              nome: directData.operador_nome,
              telefone: directData.operador_telefone || ''
            } : undefined
          };

          return {
            proposta: proposalData,
            kycData: {
              nome_completo: directData.cliente_nome || '',
              cpf: directData.cliente_cpf || '',
              data_nascimento: directData.cliente_nascimento || '',
              nome_mae: directData.cliente_mae || '',
              profissao: directData.cliente_profissao || ''
            } as KYCData
          };
        }

        return data;
      } catch (error) {
        console.error('Erro ao buscar proposta:', error);
        throw error;
      }
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

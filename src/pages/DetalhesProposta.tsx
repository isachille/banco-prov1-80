
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
        // Usar consulta direta simulando dados da proposta
        // Como não temos a tabela real, vamos simular os dados baseado no ID
        const mockPropostaData = {
          id: id,
          codigo_proposta: `PROP-${id.slice(0, 8).toUpperCase()}`,
          marca: 'Toyota',
          modelo: 'Corolla',
          ano_veiculo: 2023,
          valor_veiculo: 85000,
          valor_entrada: 15000,
          parcelas: 48,
          valor_parcela: 1850,
          valor_total: 103800,
          taxa_juros: 1.2,
          operador_nome: 'João Silva',
          operador_telefone: '(11) 99999-9999',
          cliente_nome: 'Maria Santos',
          cliente_cpf: '123.456.789-00',
          cliente_nascimento: '1985-06-15',
          cliente_mae: 'Ana Santos',
          cliente_profissao: 'Enfermeira'
        };

        const proposalData: PropostaDetalhada = {
          id: mockPropostaData.id,
          codigo: mockPropostaData.codigo_proposta,
          marca: mockPropostaData.marca,
          modelo: mockPropostaData.modelo,
          ano: mockPropostaData.ano_veiculo,
          valorVeiculo: mockPropostaData.valor_veiculo,
          valorEntrada: mockPropostaData.valor_entrada,
          parcelas: mockPropostaData.parcelas,
          valorParcela: mockPropostaData.valor_parcela,
          valorTotal: mockPropostaData.valor_total,
          taxaJuros: mockPropostaData.taxa_juros,
          operador: {
            nome: mockPropostaData.operador_nome,
            telefone: mockPropostaData.operador_telefone
          }
        };

        const kycData: KYCData = {
          nome_completo: mockPropostaData.cliente_nome,
          cpf: mockPropostaData.cliente_cpf,
          data_nascimento: mockPropostaData.cliente_nascimento,
          nome_mae: mockPropostaData.cliente_mae,
          profissao: mockPropostaData.cliente_profissao
        };

        return {
          proposta: proposalData,
          kycData: kycData
        };
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

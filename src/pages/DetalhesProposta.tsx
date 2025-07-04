
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { ProposalPreview } from '@/components/ProposalPreview';
import { toast } from 'sonner';

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
  const [proposta, setProposta] = useState<{ proposta: PropostaDetalhada; kycData: KYCData } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProposta();
  }, [id]);

  const loadProposta = async () => {
    if (!id) {
      toast.error('ID da proposta não fornecido');
      navigate('/propostas');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Usuário não autenticado');
        navigate('/login');
        return;
      }

      // Carregar proposta do localStorage
      const propostasStorage = localStorage.getItem('propostas_usuario');
      if (propostasStorage) {
        const propostas = JSON.parse(propostasStorage);
        const propostaEncontrada = propostas.find((p: any) => p.id === id && p.usuario_id === user.id);
        
        if (propostaEncontrada) {
          const proposalData: PropostaDetalhada = {
            id: propostaEncontrada.id,
            codigo: propostaEncontrada.codigo,
            marca: propostaEncontrada.marca,
            modelo: propostaEncontrada.modelo,
            ano: propostaEncontrada.ano,
            valorVeiculo: propostaEncontrada.valor_veiculo,
            valorEntrada: propostaEncontrada.valor_entrada,
            parcelas: propostaEncontrada.parcelas,
            valorParcela: propostaEncontrada.valor_parcela,
            valorTotal: propostaEncontrada.valor_total,
            taxaJuros: propostaEncontrada.taxa_juros,
            operador: propostaEncontrada.operador
          };

          const kycData: KYCData = {
            nome_completo: propostaEncontrada.cliente_nome,
            cpf: propostaEncontrada.cliente_cpf,
            data_nascimento: propostaEncontrada.cliente_nascimento,
            nome_mae: propostaEncontrada.cliente_mae,
            profissao: propostaEncontrada.cliente_profissao
          };

          setProposta({ proposta: proposalData, kycData });
        } else {
          toast.error('Proposta não encontrada');
          navigate('/propostas');
        }
      } else {
        toast.error('Nenhuma proposta encontrada');
        navigate('/propostas');
      }
    } catch (error) {
      console.error('Erro ao buscar proposta:', error);
      toast.error('Erro ao carregar proposta');
      navigate('/propostas');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#0057FF]"></div>
      </div>
    );
  }

  if (!proposta) {
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

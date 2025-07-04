
import React from 'react';
import { Download, MessageCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generateFinancingPDF, shareWhatsApp } from '@/components/PDFGenerator';
import { toast } from 'sonner';

interface ProposalActionsProps {
  proposal: any;
  kycData: any;
  onBack: () => void;
}

export const ProposalActions: React.FC<ProposalActionsProps> = ({ proposal, kycData, onBack }) => {
  const [generatingPDF, setGeneratingPDF] = React.useState(false);

  const handleGeneratePDF = async () => {
    setGeneratingPDF(true);
    try {
      const pdfData = {
        codigoProposta: proposal.codigo,
        cliente: {
          nome: kycData.nome_completo,
          cpf: kycData.cpf,
          nascimento: kycData.data_nascimento ? new Date(kycData.data_nascimento).toLocaleDateString('pt-BR') : 'Não informado',
          mae: kycData.nome_mae,
          profissao: kycData.profissao
        },
        veiculo: {
          marca: proposal.marca,
          modelo: proposal.modelo,
          ano: proposal.ano,
          valor: proposal.valorVeiculo
        },
        financiamento: {
          entrada: proposal.entrada,
          parcelas: proposal.parcelas,
          valorParcela: proposal.valorParcela,
          valorTotal: proposal.valorTotal
        },
        operador: proposal.operador,
        status: 'PRE_APROVADO' as const
      };

      const pdfBlob = await generateFinancingPDF(pdfData);
      
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Proposta_${proposal.codigo}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('PDF gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast.error('Erro ao gerar PDF');
    } finally {
      setGeneratingPDF(false);
    }
  };

  const handleWhatsApp = () => {
    if (!proposal.operador) return;

    const message = `Olá ${proposal.operador.nome}! Gostaria de prosseguir com minha proposta de financiamento.

Código da proposta: ${proposal.codigo}

Nome: ${kycData.nome_completo}
CPF: ${kycData.cpf}
Nascimento: ${kycData.data_nascimento ? new Date(kycData.data_nascimento).toLocaleDateString('pt-BR') : 'Não informado'}
Nome da mãe: ${kycData.nome_mae}
Profissão: ${kycData.profissao}

Veículo: ${proposal.veiculo}
Valor do veículo: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(proposal.valorVeiculo)}
Entrada: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(proposal.entrada)}
Financiamento: ${proposal.parcelas}x de ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(proposal.valorParcela)}

Status: PRÉ-APROVADO

Aguardo retorno. Obrigado!`;

    const phoneNumber = proposal.operador.telefone.replace(/\D/g, '');
    shareWhatsApp(message, `55${phoneNumber}`);
  };

  return (
    <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        
        <div className="flex gap-3">
          <Button 
            onClick={handleGeneratePDF}
            disabled={generatingPDF}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            {generatingPDF ? 'Gerando...' : 'Baixar PDF'}
          </Button>

          <Button 
            className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
            onClick={handleWhatsApp}
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </Button>
        </div>
      </div>
    </div>
  );
};

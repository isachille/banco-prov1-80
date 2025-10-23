import React, { useState, useEffect } from 'react';
import { Download, MessageCircle, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generateFinancingPDF, shareWhatsApp } from '@/components/PDFGenerator';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ProposalActionsProps {
  proposal: any;
  kycData: any;
  onBack: () => void;
}

export const ProposalActions: React.FC<ProposalActionsProps> = ({ proposal, kycData, onBack }) => {
  const navigate = useNavigate();
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userData } = await supabase
        .from('users')
        .select('is_admin, role')
        .eq('id', user.id)
        .single();

      if (userData) {
        const adminStatus = userData.is_admin === true || 
                           ['admin', 'dono', 'gerente'].includes(userData.role);
        setIsAdmin(adminStatus);
      }
    } catch (error) {
      console.error('Erro ao verificar status admin:', error);
    }
  };

  // Garante que a proposta exista no banco e retorna o UUID
  const ensureDbProposal = async (): Promise<string> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { data: existing, error: findError } = await supabase
      .from('propostas_financiamento')
      .select('id')
      .eq('user_id', user.id)
      .eq('codigo', proposal.codigo)
      .maybeSingle();

    if (findError) throw findError;
    if (existing?.id) return existing.id as string;

      const { data: inserted, error: insertError } = await supabase
      .from('propostas_financiamento')
      .insert([
        {
          user_id: user.id,
          codigo: proposal.codigo,
          marca: proposal.marca,
          modelo: proposal.modelo,
          ano: proposal.ano,
          valorveiculo: proposal.valorVeiculo,
          valorentrada: proposal.valorEntrada,
          parcelas: proposal.parcelas,
          valorparcela: proposal.valorParcela,
          taxa_juros: proposal.taxaJuros || 1.5,
          status: 'pendente',
          cliente_nome: kycData.nome_completo,
          cliente_cpf: kycData.cpf,
          cliente_nascimento: kycData.data_nascimento,
          cliente_mae: kycData.nome_mae,
          cliente_profissao: kycData.profissao,
          cor_veiculo: proposal.cor || 'Preto',
        },
      ])
      .select('id')
      .single();

    if (insertError) throw insertError;
    return inserted.id as string;
  };

  const handleProposalDecision = async (decision: 'aprovado' | 'recusado') => {
    setProcessing(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Usuário não autenticado');
        return;
      }

      const proposalId = await ensureDbProposal();

      const response = await supabase.functions.invoke('process-proposal-decision', {
        body: {
          proposal_id: proposalId,
          decision,
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      toast.success(`Proposta ${decision === 'aprovado' ? 'aprovada' : 'recusada'} com sucesso!`);
      
      // Redirecionar para a tela de feedback
      if (decision === 'aprovado') {
        navigate(`/proposta-aprovada/${proposalId}`);
      } else {
        navigate(`/proposta-recusada/${proposalId}`);
      }
    } catch (error) {
      console.error('Erro ao processar decisão:', error);
      toast.error('Erro ao processar proposta. Tente novamente.');
    } finally {
      setProcessing(false);
    }
  };

  const handleGeneratePDF = async () => {
    setGeneratingPDF(true);
    try {
      // Primeiro tenta encontrar o container da proposta
      let targetElement = document.querySelector('.proposal-preview-container');
      
      if (!targetElement) {
        // Se não encontrar, procura por containers alternativos
        targetElement = document.querySelector('[class*="proposal"]') || 
                      document.querySelector('.space-y-6') ||
                      document.querySelector('main') ||
                      document.body;
      }
      
      if (!targetElement) {
        throw new Error('Não foi possível encontrar o conteúdo da proposta');
      }

      // Aguarda um pouco para garantir que todo o conteúdo seja renderizado
      await new Promise(resolve => setTimeout(resolve, 500));

      // Configura o canvas com dimensões otimizadas para capturar todo o conteúdo
      const canvas = await html2canvas(targetElement as HTMLElement, {
        scale: 2, // Aumenta a escala para melhor qualidade
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        foreignObjectRendering: true,
        scrollX: 0,
        scrollY: 0,
        width: 794, // Largura fixa para A4
        height: targetElement.scrollHeight,
        windowWidth: 794,
        windowHeight: 1123,
        ignoreElements: (element) => {
          // Ignora elementos que podem causar problemas na captura
          return element.classList.contains('sticky') || 
                 element.classList.contains('fixed') ||
                 element.tagName === 'SCRIPT';
        }
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0); // Usa JPEG com máxima qualidade
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = 210; // Largura A4 em mm
      const pdfHeight = 297; // Altura A4 em mm
      const imgAspectRatio = canvas.height / canvas.width;
      
      // Calcula as dimensões da imagem no PDF mantendo a proporção
      let imgWidth = pdfWidth - 10; // Margem menor de 5mm de cada lado
      let imgHeight = imgWidth * imgAspectRatio;
      
      // Se a imagem for muito alta, ajusta para caber na página
      if (imgHeight > pdfHeight - 10) {
        imgHeight = pdfHeight - 10;
        imgWidth = imgHeight / imgAspectRatio;
      }
      
      // Centraliza a imagem na página
      const xPosition = (pdfWidth - imgWidth) / 2;
      const yPosition = 5; // Margem superior menor
      
      // Calcula quantas páginas serão necessárias
      const totalPages = Math.ceil(imgHeight / (pdfHeight - 10));
      
      for (let i = 0; i < totalPages; i++) {
        if (i > 0) {
          pdf.addPage();
        }
        
        const sourceY = i * (pdfHeight - 10) * (canvas.height / imgHeight);
        const sourceHeight = Math.min((pdfHeight - 10) * (canvas.height / imgHeight), canvas.height - sourceY);
        
        // Cria um canvas temporário para a seção atual
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = canvas.width;
        tempCanvas.height = sourceHeight;
        
        if (tempCtx) {
          tempCtx.fillStyle = '#ffffff';
          tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
          tempCtx.drawImage(canvas, 0, -sourceY);
          
          const tempImgData = tempCanvas.toDataURL('image/jpeg', 1.0);
          pdf.addImage(tempImgData, 'JPEG', xPosition, yPosition, imgWidth, Math.min(pdfHeight - 10, imgHeight - i * (pdfHeight - 10)));
        }
      }

      const pdfBlob = pdf.output('blob');
      
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
      toast.error('Erro ao gerar PDF. Tente novamente.');
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
          {isAdmin && (
            <>
              <Button 
                onClick={() => handleProposalDecision('aprovado')}
                disabled={processing}
                className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                {processing ? 'Processando...' : 'Aprovar'}
              </Button>

              <Button 
                onClick={() => handleProposalDecision('recusado')}
                disabled={processing}
                className="bg-red-600 hover:bg-red-700 flex items-center gap-2"
              >
                <XCircle className="h-4 w-4" />
                {processing ? 'Processando...' : 'Recusar'}
              </Button>
            </>
          )}

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
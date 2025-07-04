
import React from 'react';
import { Download, MessageCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generateFinancingPDF, shareWhatsApp } from '@/components/PDFGenerator';
import { toast } from 'sonner';

interface ProposalPreviewProps {
  proposal: any;
  kycData: any;
  onBack: () => void;
}

export const ProposalPreview: React.FC<ProposalPreviewProps> = ({ proposal, kycData, onBack }) => {
  const [generatingPDF, setGeneratingPDF] = React.useState(false);

  const statusColor = '#f59e0b'; // PRE_APROVADO - amarelo
  const statusText = 'PRÉ-APROVADO';

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
    <div className="max-w-4xl mx-auto bg-white">
      {/* Botões de Ação no Topo */}
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

      {/* Preview do Documento */}
      <div className="p-8">
        <div style={{ maxWidth: '850px', margin: '0 auto', fontFamily: 'Arial, sans-serif', lineHeight: '1.4', background: 'white', padding: '40px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
          
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '30px', borderBottom: '3px solid #1e40af', paddingBottom: '20px' }}>
            <div style={{ background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)', color: 'white', padding: '25px', borderRadius: '10px', marginBottom: '20px' }}>
              <h1 style={{ margin: '0', fontSize: '38px', fontWeight: 'bold' }}>PRO MOTORS</h1>
              <p style={{ margin: '8px 0 0 0', fontSize: '18px', opacity: '0.95' }}>Financiamento Veicular</p>
            </div>
            
            {/* Open Finance */}
            <div style={{ backgroundColor: '#f0f9ff', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #0369a1' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#0369a1', fontSize: '14px', fontWeight: 'bold' }}>🔒 ANÁLISE VIA OPEN FINANCE</h4>
              <p style={{ margin: '0', fontSize: '12px', color: '#075985', lineHeight: '1.4' }}>
                Nosso sistema utiliza tecnologia Open Finance para avaliar seu perfil de crédito em tempo real junto aos principais bancos do país.
              </p>
            </div>
            
            {/* Bancos */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', marginBottom: '15px', flexWrap: 'wrap' }}>
              <div style={{ width: '70px', height: '45px', background: '#FF6600', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', fontWeight: 'bold', fontSize: '13px' }}>ITAÚ</div>
              <div style={{ width: '70px', height: '45px', background: '#FFED00', color: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', fontWeight: 'bold', fontSize: '9px' }}>BANCO<br/>DO BRASIL</div>
              <div style={{ width: '70px', height: '45px', background: '#E31E24', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', fontWeight: 'bold', fontSize: '10px' }}>SANTANDER</div>
              <div style={{ width: '70px', height: '45px', background: '#00A859', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', fontWeight: 'bold', fontSize: '12px' }}>SICREDI</div>
              <div style={{ width: '70px', height: '45px', background: '#1976D2', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', fontWeight: 'bold', fontSize: '12px' }}>SAFRA</div>
              <div style={{ width: '70px', height: '45px', background: '#662D91', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', fontWeight: 'bold', fontSize: '12px' }}>NUBANK</div>
            </div>
          </div>

          {/* Status */}
          <div style={{ textAlign: 'center', marginBottom: '25px' }}>
            <div style={{ backgroundColor: statusColor, color: 'white', padding: '18px 35px', borderRadius: '25px', display: 'inline-block', fontSize: '20px', fontWeight: 'bold' }}>{statusText}</div>
            <p style={{ marginTop: '12px', color: '#666', fontSize: '15px' }}>Código da Proposta: <strong style={{ color: '#1e40af' }}>{proposal.codigo}</strong></p>
          </div>

          {/* Dados do Cliente */}
          <div style={{ marginBottom: '25px' }}>
            <h3 style={{ color: '#1e40af', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px', marginBottom: '15px' }}>Dados do Cliente</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div><strong>Nome:</strong> {kycData.nome_completo}</div>
              <div><strong>CPF:</strong> {kycData.cpf}</div>
              <div><strong>Nascimento:</strong> {kycData.data_nascimento ? new Date(kycData.data_nascimento).toLocaleDateString('pt-BR') : 'Não informado'}</div>
              <div><strong>Nome da Mãe:</strong> {kycData.nome_mae}</div>
              <div style={{ gridColumn: 'span 2' }}><strong>Profissão:</strong> {kycData.profissao}</div>
            </div>
          </div>

          {/* Veículo */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: '#1e40af', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px', marginBottom: '15px' }}>Veículo Selecionado</h3>
            <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: '0 0 10px 0', fontSize: '20px', color: '#1e40af', fontWeight: 'bold' }}>{proposal.marca} {proposal.modelo}</h4>
                  <p style={{ margin: '0', color: '#64748b', fontSize: '14px' }}>Ano: <strong>{proposal.ano}</strong></p>
                  {proposal.ano === new Date().getFullYear() && <p style={{ margin: '5px 0 0 0', color: '#059669', fontSize: '12px', fontWeight: 'bold' }}>🆕 Veículo 0 KM</p>}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#1e40af' }}>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(proposal.valorVeiculo)}</div>
                  <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#64748b' }}>Valor de mercado</p>
                </div>
              </div>
            </div>
          </div>

          {/* Financiamento */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: '#1e40af', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px', marginBottom: '15px' }}>Simulação de Financiamento</h3>
            <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div style={{ textAlign: 'center', background: 'white', padding: '18px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px', fontWeight: 'bold' }}>ENTRADA</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e40af' }}>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(proposal.entrada)}</div>
                </div>
                <div style={{ textAlign: 'center', background: 'white', padding: '18px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px', fontWeight: 'bold' }}>PARCELAS</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e40af' }}>{proposal.parcelas}x</div>
                  <div style={{ fontSize: '16px', color: '#64748b', marginTop: '4px' }}>de {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(proposal.valorParcela)}</div>
                </div>
              </div>
              <div style={{ textAlign: 'center', background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)', color: 'white', padding: '20px', borderRadius: '8px' }}>
                <div style={{ fontSize: '16px', marginBottom: '8px' }}>VALOR TOTAL DO FINANCIAMENTO</div>
                <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(proposal.valorTotal)}</div>
              </div>
            </div>
          </div>

          {/* Operador */}
          {proposal.operador && (
            <div style={{ marginBottom: '25px' }}>
              <h3 style={{ color: '#1e40af', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px', marginBottom: '15px' }}>Operador Responsável</h3>
              <div style={{ backgroundColor: '#f1f5f9', padding: '15px', borderRadius: '8px' }}>
                <p style={{ margin: '0', fontSize: '16px' }}><strong>{proposal.operador.nome}</strong></p>
                <p style={{ margin: '5px 0 0 0', color: '#666' }}>{proposal.operador.telefone}</p>
              </div>
            </div>
          )}

          {/* Footer */}
          <div style={{ marginTop: '40px', textAlign: 'center', borderTop: '2px solid #e5e7eb', paddingTop: '20px' }}>
            <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>Proposta pré-aprovada. Entre em contato para finalizar o processo.</p>
            <div style={{ marginTop: '15px', backgroundColor: '#1e40af', color: 'white', padding: '10px', borderRadius: '5px', display: 'inline-block' }}>
              <strong>{proposal.operador?.telefone || '(61) 98483-3965'}</strong>
            </div>
            
            <p style={{ margin: '15px 0 0 0', fontSize: '12px', color: '#999' }}>
              Documento gerado em {new Date().toLocaleDateString('pt-BR')} - Pro Motors Financiamentos
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

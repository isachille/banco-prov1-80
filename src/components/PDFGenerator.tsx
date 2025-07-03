
import React from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface PDFData {
  codigoProposta: string;
  cliente: {
    nome: string;
    cpf: string;
    nascimento: string;
    mae: string;
    profissao: string;
  };
  veiculo: {
    marca: string;
    modelo: string;
    ano: number;
    valor: number;
  };
  financiamento: {
    entrada: number;
    parcelas: number;
    valorParcela: number;
    valorTotal: number;
  };
  operador?: {
    nome: string;
    telefone: string;
  };
  status: 'PRE_APROVADO' | 'APROVADO' | 'NEGADO';
}

const createPDFContent = (data: PDFData): string => {
  const statusColor = data.status === 'APROVADO' ? '#22c55e' : 
                     data.status === 'PRE_APROVADO' ? '#f59e0b' : '#ef4444';

  const statusText = data.status === 'APROVADO' ? 'APROVADO' : 
                    data.status === 'PRE_APROVADO' ? 'PRÉ-APROVADO' : 'NEGADO';

  return `
    <div style="max-width: 714px; margin: 0 auto; font-family: Arial, sans-serif;">
      <!-- Header com Logo -->
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px solid #1e40af; padding-bottom: 20px;">
        <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 20px; border-radius: 10px; margin-bottom: 15px; position: relative;">
          <div style="display: flex; align-items: center; justify-content: center; gap: 15px;">
            <img src="/lovable-uploads/4712549c-a705-4aad-8498-4702dc3cdd8f.png" alt="Pro Motors Logo" style="width: 80px; height: 80px; border-radius: 8px; background: white; padding: 8px;" />
            <div>
              <h1 style="margin: 0; font-size: 32px; font-weight: bold;">PRO MOTORS</h1>
              <p style="margin: 5px 0 0 0; font-size: 16px; opacity: 0.9;">Financiamento Veicular</p>
            </div>
          </div>
        </div>
        
        <!-- Logos dos Bancos Parceiros -->
        <div style="display: flex; justify-content: center; align-items: center; gap: 20px; margin-bottom: 15px; flex-wrap: wrap;">
          <div style="text-align: center;">
            <div style="width: 60px; height: 40px; background: #FF6600; color: white; display: flex; align-items: center; justify-content: center; border-radius: 5px; font-weight: bold; font-size: 12px;">ITAÚ</div>
          </div>
          <div style="text-align: center;">
            <div style="width: 60px; height: 40px; background: #FFED00; color: #333; display: flex; align-items: center; justify-content: center; border-radius: 5px; font-weight: bold; font-size: 10px;">BANCO DO BRASIL</div>
          </div>
          <div style="text-align: center;">
            <div style="width: 60px; height: 40px; background: #E31E24; color: white; display: flex; align-items: center; justify-content: center; border-radius: 5px; font-weight: bold; font-size: 10px;">SANTANDER</div>
          </div>
          <div style="text-align: center;">
            <div style="width: 60px; height: 40px; background: #00A859; color: white; display: flex; align-items: center; justify-content: center; border-radius: 5px; font-weight: bold; font-size: 12px;">SICREDI</div>
          </div>
        </div>
      </div>

      <!-- Status da Proposta -->
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="background-color: ${statusColor}; color: white; padding: 15px 30px; border-radius: 25px; display: inline-block; font-size: 18px; font-weight: bold;">
          ${statusText}
        </div>
        <p style="margin-top: 10px; color: #666; font-size: 14px;">Código da Proposta: <strong>${data.codigoProposta}</strong></p>
      </div>

      <!-- Etapas do Processo -->
      <div style="margin-bottom: 30px; background-color: #f8fafc; padding: 20px; border-radius: 10px;">
        <h3 style="margin-top: 0; color: #1e40af; font-size: 16px;">Etapas do Financiamento</h3>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
          <div style="text-align: center; flex: 1;">
            <div style="width: 30px; height: 30px; border-radius: 50%; background-color: #22c55e; color: white; display: flex; align-items: center; justify-content: center; margin: 0 auto 5px; font-weight: bold;">1</div>
            <span style="font-size: 12px; color: #22c55e;">Solicitação</span>
          </div>
          <div style="flex: 1; height: 2px; background-color: #22c55e; margin: 0 10px;"></div>
          <div style="text-align: center; flex: 1;">
            <div style="width: 30px; height: 30px; border-radius: 50%; background-color: ${data.status !== 'NEGADO' ? '#22c55e' : '#e5e7eb'}; color: ${data.status !== 'NEGADO' ? 'white' : '#9ca3af'}; display: flex; align-items: center; justify-content: center; margin: 0 auto 5px; font-weight: bold;">2</div>
            <span style="font-size: 12px; color: ${data.status !== 'NEGADO' ? '#22c55e' : '#9ca3af'};">Análise</span>
          </div>
          <div style="flex: 1; height: 2px; background-color: ${data.status === 'APROVADO' ? '#22c55e' : '#e5e7eb'}; margin: 0 10px;"></div>
          <div style="text-align: center; flex: 1;">
            <div style="width: 30px; height: 30px; border-radius: 50%; background-color: ${data.status === 'APROVADO' ? '#22c55e' : '#e5e7eb'}; color: ${data.status === 'APROVADO' ? 'white' : '#9ca3af'}; display: flex; align-items: center; justify-content: center; margin: 0 auto 5px; font-weight: bold;">3</div>
            <span style="font-size: 12px; color: ${data.status === 'APROVADO' ? '#22c55e' : '#9ca3af'};">Aprovação</span>
          </div>
        </div>
      </div>

      <!-- Dados do Cliente -->
      <div style="margin-bottom: 25px;">
        <h3 style="color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; margin-bottom: 15px;">Dados do Cliente</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
          <div><strong>Nome:</strong> ${data.cliente.nome}</div>
          <div><strong>CPF:</strong> ${data.cliente.cpf}</div>
          <div><strong>Nascimento:</strong> ${data.cliente.nascimento}</div>
          <div><strong>Nome da Mãe:</strong> ${data.cliente.mae}</div>
          <div style="grid-column: span 2;"><strong>Profissão:</strong> ${data.cliente.profissao}</div>
        </div>
      </div>

      <!-- Dados do Veículo -->
      <div style="margin-bottom: 25px;">
        <h3 style="color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; margin-bottom: 15px;">Veículo Selecionado</h3>
        <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; align-items: center;">
            <div>
              <h4 style="margin: 0 0 10px 0; font-size: 18px; color: #1e40af;">${data.veiculo.marca} ${data.veiculo.modelo}</h4>
              <p style="margin: 0; color: #666;">Ano: ${data.veiculo.ano}</p>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 24px; font-weight: bold; color: #1e40af;">
                ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.veiculo.valor)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Simulação de Financiamento -->
      <div style="margin-bottom: 25px;">
        <h3 style="color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; margin-bottom: 15px;">Simulação de Financiamento</h3>
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
            <div style="text-align: center; background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <div style="font-size: 12px; color: #666; margin-bottom: 5px;">ENTRADA</div>
              <div style="font-size: 20px; font-weight: bold; color: #1e40af;">
                ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.financiamento.entrada)}
              </div>
            </div>
            <div style="text-align: center; background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <div style="font-size: 12px; color: #666; margin-bottom: 5px;">PARCELAS</div>
              <div style="font-size: 20px; font-weight: bold; color: #1e40af;">
                ${data.financiamento.parcelas}x de ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.financiamento.valorParcela)}
              </div>
            </div>
          </div>
          <div style="text-align: center; background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 15px; border-radius: 8px;">
            <div style="font-size: 14px; margin-bottom: 5px;">VALOR TOTAL DO FINANCIAMENTO</div>
            <div style="font-size: 24px; font-weight: bold;">
              ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.financiamento.valorTotal)}
            </div>
          </div>
        </div>
      </div>

      ${data.operador ? `
      <!-- Operador Responsável -->
      <div style="margin-bottom: 25px;">
        <h3 style="color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; margin-bottom: 15px;">Operador Responsável</h3>
        <div style="background-color: #f1f5f9; padding: 15px; border-radius: 8px;">
          <p style="margin: 0; font-size: 16px;"><strong>${data.operador.nome}</strong></p>
          <p style="margin: 5px 0 0 0; color: #666;">${data.operador.telefone}</p>
        </div>
      </div>
      ` : ''}

      <!-- Rodapé -->
      <div style="margin-top: 40px; text-align: center; border-top: 2px solid #e5e7eb; padding-top: 20px;">
        <p style="margin: 0; font-size: 14px; color: #666;">
          ${data.status === 'PRE_APROVADO' ? 'Proposta pré-aprovada. Entre em contato para finalizar o processo.' : 
            data.status === 'APROVADO' ? 'Parabéns! Sua proposta foi aprovada. Entre em contato para finalizar.' :
            'Proposta não aprovada no momento. Entre em contato para mais informações.'}
        </p>
        <div style="margin-top: 15px; background-color: #1e40af; color: white; padding: 10px; border-radius: 5px; display: inline-block;">
          <strong>${data.operador ? data.operador.telefone : '(61) 98483-3965'}</strong>
        </div>
        
        <!-- Informações da Empresa -->
        <div style="margin-top: 20px; background-color: #f8fafc; padding: 15px; border-radius: 8px; text-align: left;">
          <h4 style="margin: 0 0 10px 0; color: #1e40af; text-align: center;">PRO MOTORS LTDA</h4>
          <div style="font-size: 12px; color: #666; line-height: 1.4;">
            <p style="margin: 5px 0;"><strong>CNPJ:</strong> 12.345.678/0001-90</p>
            <p style="margin: 5px 0;"><strong>Endereço:</strong> SIA Trecho 1, Lote 123 - Guará, Brasília - DF, CEP: 71200-000</p>
            <p style="margin: 5px 0;"><strong>Telefone:</strong> (61) 3333-4444</p>
            <p style="margin: 5px 0;"><strong>E-mail:</strong> contato@promotors.com.br</p>
          </div>
        </div>

        <!-- LGPD -->
        <div style="margin-top: 15px; background-color: #fef3c7; padding: 10px; border-radius: 5px; border-left: 4px solid #f59e0b;">
          <p style="margin: 0; font-size: 11px; color: #92400e; text-align: left;">
            <strong>LGPD - Lei Geral de Proteção de Dados:</strong> Seus dados pessoais são tratados em conformidade com a LGPD (Lei 13.709/2018). 
            Utilizamos suas informações exclusivamente para processar sua solicitação de financiamento. Para exercer seus direitos ou obter mais informações 
            sobre o tratamento de seus dados, entre em contato conosco através dos canais oficiais.
          </p>
        </div>
        
        <p style="margin: 15px 0 0 0; font-size: 12px; color: #999;">
          Documento gerado em ${new Date().toLocaleDateString('pt-BR')} - Pro Motors Financiamentos
        </p>
      </div>
    </div>
  `;
};

export const generateFinancingPDF = async (data: PDFData): Promise<Blob> => {
  // Criar elemento temporário para renderizar o PDF
  const tempDiv = document.createElement('div');
  tempDiv.style.position = 'absolute';
  tempDiv.style.left = '-9999px';
  tempDiv.style.width = '794px'; // A4 width in pixels
  tempDiv.style.backgroundColor = 'white';
  tempDiv.style.padding = '40px';
  tempDiv.style.fontFamily = 'Arial, sans-serif';

  tempDiv.innerHTML = createPDFContent(data);

  document.body.appendChild(tempDiv);

  try {
    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    return pdf.output('blob');
  } finally {
    document.body.removeChild(tempDiv);
  }
};

export const shareWhatsApp = (message: string, phone?: string) => {
  const phoneNumber = phone || '5561984833965';
  const encodedMessage = encodeURIComponent(message);
  window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
};

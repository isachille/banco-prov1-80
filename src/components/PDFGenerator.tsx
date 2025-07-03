
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
    <div style="max-width: 850px; margin: 0 auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.4; background: white; padding: 40px;">
      <!-- Header com Logo -->
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px solid #1e40af; padding-bottom: 20px; page-break-inside: avoid;">
        <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 25px; border-radius: 10px; margin-bottom: 20px; position: relative;">
          <div style="display: flex; align-items: center; justify-content: center; gap: 20px;">
            <img 
              src="/lovable-uploads/4712549c-a705-4aad-8498-4702dc3cdd8f.png" 
              alt="Pro Motors Logo" 
              style="width: 120px; height: 120px; border-radius: 12px; background: white; padding: 12px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);" 
            />
            <div>
              <h1 style="margin: 0; font-size: 38px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); color: white;">PRO MOTORS</h1>
              <p style="margin: 8px 0 0 0; font-size: 18px; opacity: 0.95; font-weight: 500; color: white;">Financiamento Veicular</p>
            </div>
          </div>
        </div>
        
        <!-- Open Finance Explanation -->
        <div style="background-color: #f0f9ff; padding: 15px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #0369a1; page-break-inside: avoid;">
          <h4 style="margin: 0 0 8px 0; color: #0369a1; font-size: 14px; font-weight: bold;">🔒 ANÁLISE VIA OPEN FINANCE</h4>
          <p style="margin: 0; font-size: 12px; color: #075985; line-height: 1.4;">
            Nosso sistema utiliza tecnologia Open Finance para avaliar seu perfil de crédito em tempo real junto aos principais bancos do país, 
            garantindo a melhor proposta de financiamento disponível no mercado.
          </p>
        </div>
        
        <!-- Logos dos Bancos Parceiros -->
        <div style="display: flex; justify-content: center; align-items: center; gap: 15px; margin-bottom: 15px; flex-wrap: wrap;">
          <div style="text-align: center;">
            <div style="width: 70px; height: 45px; background: #FF6600; color: white; display: flex; align-items: center; justify-content: center; border-radius: 6px; font-weight: bold; font-size: 13px; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">ITAÚ</div>
          </div>
          <div style="text-align: center;">
            <div style="width: 70px; height: 45px; background: #FFED00; color: #333; display: flex; align-items: center; justify-content: center; border-radius: 6px; font-weight: bold; font-size: 9px; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">BANCO<br/>DO BRASIL</div>
          </div>
          <div style="text-align: center;">
            <div style="width: 70px; height: 45px; background: #E31E24; color: white; display: flex; align-items: center; justify-content: center; border-radius: 6px; font-weight: bold; font-size: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">SANTANDER</div>
          </div>
          <div style="text-align: center;">
            <div style="width: 70px; height: 45px; background: #00A859; color: white; display: flex; align-items: center; justify-content: center; border-radius: 6px; font-weight: bold; font-size: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">SICREDI</div>
          </div>
          <div style="text-align: center;">
            <div style="width: 70px; height: 45px; background: #1976D2; color: white; display: flex; align-items: center; justify-content: center; border-radius: 6px; font-weight: bold; font-size: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">SAFRA</div>
          </div>
          <div style="text-align: center;">
            <div style="width: 70px; height: 45px; background: #662D91; color: white; display: flex; align-items: center; justify-content: center; border-radius: 6px; font-weight: bold; font-size: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">NUBANK</div>
          </div>
        </div>
      </div>

      <!-- Status da Proposta -->
      <div style="text-align: center; margin-bottom: 25px; page-break-inside: avoid;">
        <div style="background-color: ${statusColor}; color: white; padding: 18px 35px; border-radius: 25px; display: inline-block; font-size: 20px; font-weight: bold; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">
          ${statusText}
        </div>
        <p style="margin-top: 12px; color: #666; font-size: 15px; font-weight: 500;">Código da Proposta: <strong style="color: #1e40af;">${data.codigoProposta}</strong></p>
      </div>

      <!-- Etapas do Processo -->
      <div style="margin-bottom: 25px; background-color: #f8fafc; padding: 20px; border-radius: 10px; border: 1px solid #e2e8f0; page-break-inside: avoid;">
        <h3 style="margin-top: 0; color: #1e40af; font-size: 16px;">Etapas do Financiamento</h3>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
          <div style="text-align: center; flex: 1;">
            <div style="width: 35px; height: 35px; border-radius: 50%; background-color: #22c55e; color: white; display: flex; align-items: center; justify-content: center; margin: 0 auto 8px; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">1</div>
            <span style="font-size: 13px; color: #22c55e; font-weight: 500;">Solicitação</span>
          </div>
          <div style="flex: 1; height: 3px; background-color: #22c55e; margin: 0 15px;"></div>
          <div style="text-align: center; flex: 1;">
            <div style="width: 35px; height: 35px; border-radius: 50%; background-color: ${data.status !== 'NEGADO' ? '#22c55e' : '#e5e7eb'}; color: ${data.status !== 'NEGADO' ? 'white' : '#9ca3af'}; display: flex; align-items: center; justify-content: center; margin: 0 auto 8px; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">2</div>
            <span style="font-size: 13px; color: ${data.status !== 'NEGADO' ? '#22c55e' : '#9ca3af'}; font-weight: 500;">Análise</span>
          </div>
          <div style="flex: 1; height: 3px; background-color: ${data.status === 'APROVADO' ? '#22c55e' : '#e5e7eb'}; margin: 0 15px;"></div>
          <div style="text-align: center; flex: 1;">
            <div style="width: 35px; height: 35px; border-radius: 50%; background-color: ${data.status === 'APROVADO' ? '#22c55e' : '#e5e7eb'}; color: ${data.status === 'APROVADO' ? 'white' : '#9ca3af'}; display: flex; align-items: center; justify-content: center; margin: 0 auto 8px; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">3</div>
            <span style="font-size: 13px; color: ${data.status === 'APROVADO' ? '#22c55e' : '#9ca3af'}; font-weight: 500;">Aprovação</span>
          </div>
        </div>
      </div>

      <!-- Dados do Cliente -->
      <div style="margin-bottom: 20px; page-break-inside: avoid;">
        <h3 style="color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; margin-bottom: 15px;">Dados do Cliente</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; background-color: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0;">
          <div style="font-size: 14px; color: #333;"><strong>Nome:</strong> ${data.cliente.nome}</div>
          <div style="font-size: 14px; color: #333;"><strong>CPF:</strong> ${data.cliente.cpf}</div>
          <div style="font-size: 14px; color: #333;"><strong>Nascimento:</strong> ${data.cliente.nascimento}</div>
          <div style="font-size: 14px; color: #333;"><strong>Nome da Mãe:</strong> ${data.cliente.mae}</div>
          <div style="grid-column: span 2; font-size: 14px; color: #333;"><strong>Profissão:</strong> ${data.cliente.profissao}</div>
        </div>
      </div>

      <!-- Dados do Veículo -->
      <div style="margin-bottom: 20px; page-break-inside: avoid;">
        <h3 style="color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; margin-bottom: 15px;">Veículo Selecionado</h3>
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; align-items: center;">
            <div>
              <h4 style="margin: 0 0 10px 0; font-size: 20px; color: #1e40af; font-weight: bold;">${data.veiculo.marca} ${data.veiculo.modelo}</h4>
              <p style="margin: 0; color: #64748b; font-size: 14px;">Ano: <strong>${data.veiculo.ano}</strong></p>
              ${data.veiculo.ano === new Date().getFullYear() ? '<p style="margin: 5px 0 0 0; color: #059669; font-size: 12px; font-weight: bold;">🆕 Veículo 0 KM</p>' : ''}
            </div>
            <div style="text-align: right;">
              <div style="font-size: 28px; font-weight: bold; color: #1e40af;">
                ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.veiculo.valor)}
              </div>
              <p style="margin: 5px 0 0 0; font-size: 12px; color: #64748b;">Valor de mercado</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Simulação de Financiamento -->
      <div style="margin-bottom: 20px; page-break-inside: avoid;">
        <h3 style="color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; margin-bottom: 15px;">Simulação de Financiamento</h3>
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
            <div style="text-align: center; background: white; padding: 18px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border: 1px solid #e2e8f0;">
              <div style="font-size: 14px; color: #64748b; margin-bottom: 8px; font-weight: bold;">ENTRADA</div>
              <div style="font-size: 24px; font-weight: bold; color: #1e40af;">
                ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.financiamento.entrada)}
              </div>
            </div>
            <div style="text-align: center; background: white; padding: 18px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border: 1px solid #e2e8f0;">
              <div style="font-size: 14px; color: #64748b; margin-bottom: 8px; font-weight: bold;">PARCELAS</div>
              <div style="font-size: 24px; font-weight: bold; color: #1e40af;">
                ${data.financiamento.parcelas}x
              </div>
              <div style="font-size: 16px; color: #64748b; margin-top: 4px;">
                de ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.financiamento.valorParcela)}
              </div>
            </div>
          </div>
          <div style="text-align: center; background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(30, 64, 175, 0.3);">
            <div style="font-size: 16px; margin-bottom: 8px; opacity: 0.9;">VALOR TOTAL DO FINANCIAMENTO</div>
            <div style="font-size: 32px; font-weight: bold;">
              ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.financiamento.valorTotal)}
            </div>
          </div>
        </div>
      </div>

      ${data.operador ? `
      <!-- Operador Responsável -->
      <div style="margin-bottom: 20px; page-break-inside: avoid;">
        <h3 style="color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; margin-bottom: 15px;">Operador Responsável</h3>
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0;">
          <p style="margin: 0; font-size: 16px; font-weight: bold; color: #1e40af;">${data.operador.nome}</p>
          <p style="margin: 5px 0 0 0; color: #64748b; font-size: 14px;">${data.operador.telefone}</p>
        </div>
      </div>
      ` : ''}

      <!-- Rodapé -->
      <div style="margin-top: 30px; text-align: center; border-top: 2px solid #e5e7eb; padding-top: 20px; page-break-inside: avoid;">
        <p style="margin: 0; font-size: 15px; color: #64748b; font-weight: 500;">
          ${data.status === 'PRE_APROVADO' ? 'Proposta pré-aprovada. Entre em contato para finalizar o processo.' : 
            data.status === 'APROVADO' ? 'Parabéns! Sua proposta foi aprovada. Entre em contato para finalizar.' :
            'Proposta não aprovada no momento. Entre em contato para mais informações.'}
        </p>
        <div style="margin-top: 15px; background-color: #1e40af; color: white; padding: 12px 20px; border-radius: 8px; display: inline-block; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
          <strong style="font-size: 16px;">${data.operador ? data.operador.telefone : '(61) 98483-3965'}</strong>
        </div>
        
        <!-- Informações da Empresa -->
        <div style="margin-top: 20px; background-color: #f8fafc; padding: 15px; border-radius: 8px; text-align: left; border: 1px solid #e2e8f0;">
          <h4 style="margin: 0 0 10px 0; color: #1e40af; text-align: center; font-size: 16px;">PRO MOTORS LTDA</h4>
          <div style="font-size: 12px; color: #64748b; line-height: 1.5;">
            <p style="margin: 5px 0;"><strong>CNPJ:</strong> 12.345.678/0001-90</p>
            <p style="margin: 5px 0;"><strong>Endereço:</strong> SIA Trecho 1, Lote 123 - Guará, Brasília - DF, CEP: 71200-000</p>
            <p style="margin: 5px 0;"><strong>Telefone:</strong> (61) 3333-4444</p>
            <p style="margin: 5px 0;"><strong>E-mail:</strong> contato@promotors.com.br</p>
          </div>
        </div>

        <!-- LGPD -->
        <div style="margin-top: 15px; background-color: #fef3c7; padding: 12px; border-radius: 6px; border-left: 4px solid #f59e0b;">
          <p style="margin: 0; font-size: 11px; color: #92400e; text-align: left; line-height: 1.4;">
            <strong>LGPD - Lei Geral de Proteção de Dados:</strong> Seus dados pessoais são tratados em conformidade com a LGPD (Lei 13.709/2018). 
            Utilizamos suas informações exclusivamente para processar sua solicitação de financiamento. Para exercer seus direitos ou obter mais informações 
            sobre o tratamento de seus dados, entre em contato conosco através dos canais oficiais.
          </p>
        </div>
        
        <p style="margin: 15px 0 0 0; font-size: 12px; color: #9ca3af;">
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
  tempDiv.style.width = '850px';
  tempDiv.style.backgroundColor = 'white';
  tempDiv.style.padding = '40px';
  tempDiv.style.fontFamily = 'Arial, sans-serif';

  tempDiv.innerHTML = createPDFContent(data);

  document.body.appendChild(tempDiv);

  try {
    // Aguardar um pouco para as imagens carregarem
    await new Promise(resolve => setTimeout(resolve, 1000));

    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
      allowTaint: false,
      foreignObjectRendering: true,
      height: tempDiv.scrollHeight,
      width: tempDiv.scrollWidth
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

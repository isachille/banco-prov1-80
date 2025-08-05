
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

  const getStatusMessage = () => {
    switch (data.status) {
      case 'PRE_APROVADO':
        return 'Proposta pré-aprovada. Entre em contato para finalizar o processo.';
      case 'APROVADO':
        return 'Parabéns! Sua proposta foi aprovada. Entre em contato para finalizar.';
      case 'NEGADO':
        return 'Proposta não aprovada no momento. Entre em contato para mais informações.';
      default:
        return '';
    }
  };

  return `
    <div style="max-width: 850px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.4; background: white; padding: 0;">
      
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center;">
        <div style="display: flex; align-items: center; justify-content: center; gap: 20px; margin-bottom: 20px;">
          <img 
            src="/src/assets/pro-motors-logo.png" 
            alt="Pro Motors Logo" 
            style="width: 80px; height: 80px; border-radius: 8px; background: rgba(255,255,255,0.1); padding: 8px;"
          />
          <div>
            <h1 style="margin: 0; font-size: 42px; font-weight: bold;">PRO MOTORS</h1>
            <p style="margin: 8px 0 0 0; font-size: 18px; opacity: 0.95;">Financiamento Veicular</p>
          </div>
        </div>
        <h2 style="margin: 0; font-size: 20px; font-weight: bold;">PROTOCOLO DA PROPOSTA ${data.codigoProposta}</h2>
      </div>

      <!-- Bancos Section -->
      <div style="background-color: #f3f4f6; padding: 25px;">
        <div style="display: flex; justify-content: center; align-items: center; gap: 8px; margin-bottom: 20px; flex-wrap: wrap;">
          <div style="background: #000; color: white; padding: 8px 12px; border-radius: 4px; font-weight: bold; font-size: 11px;">BANCO PAN</div>
          <div style="background: #ea580c; color: white; padding: 8px 12px; border-radius: 4px; font-weight: bold; font-size: 11px;">C6 BANK</div>
          <div style="background: #1e40af; color: white; padding: 8px 12px; border-radius: 4px; font-weight: bold; font-size: 11px;">BANCO SAFRA</div>
          <div style="background: #7c3aed; color: white; padding: 8px 12px; border-radius: 4px; font-weight: bold; font-size: 11px;">BV</div>
          <div style="background: #eab308; color: #000; padding: 8px 12px; border-radius: 4px; font-weight: bold; font-size: 11px;">BANCO DO BRASIL</div>
          <div style="background: #ea580c; color: white; padding: 8px 12px; border-radius: 4px; font-weight: bold; font-size: 11px;">ITAÚ</div>
          <div style="background: #16a34a; color: white; padding: 8px 12px; border-radius: 4px; font-weight: bold; font-size: 11px;">SICREDI</div>
          <div style="background: #3b82f6; color: white; padding: 8px 12px; border-radius: 4px; font-weight: bold; font-size: 11px;">CAIXA</div>
          <div style="background: #dc2626; color: white; padding: 8px 12px; border-radius: 4px; font-weight: bold; font-size: 11px;">BRADESCO</div>
          <div style="background: #991b1b; color: white; padding: 8px 12px; border-radius: 4px; font-weight: bold; font-size: 11px;">SANTANDER</div>
        </div>
        
        <!-- Status -->
        <div style="text-align: center; margin-bottom: 20px;">
          <h3 style="margin: 0 0 15px 0; font-size: 16px; font-weight: bold; color: #374151;">SITUAÇÃO DO PERFIL AVALIADO</h3>
          <div style="display: flex; justify-content: center; gap: 15px;">
            <div style="background: #fef2f2; border: 1px solid #fecaca; color: #b91c1c; padding: 8px 20px; font-weight: bold; font-size: 12px;">RECUSADO</div>
            <div style="background: #4ade80; border: 1px solid #22c55e; color: white; padding: 8px 20px; font-weight: bold; font-size: 12px;">${statusText}</div>
            <div style="background: #f3f4f6; border: 1px solid #d1d5db; color: #374151; padding: 8px 20px; font-weight: bold; font-size: 12px;">APROVADO</div>
          </div>
        </div>
      </div>

      <div style="padding: 30px;">
        <!-- Dados Empresariais -->
        <div style="background-color: #eff6ff; padding: 25px; border-radius: 8px; margin-bottom: 25px; border: 1px solid #bfdbfe;">
          <h3 style="color: #1e40af; text-align: center; margin: 0 0 20px 0; font-weight: bold;">DADOS EMPRESARIAIS</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; text-align: center; font-size: 13px; margin-bottom: 15px;">
            <div><div style="font-weight: bold; color: #374151; margin-bottom: 5px;">CNPJ:</div><div style="background: white; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;">54.039.082/0001-07</div></div>
            <div><div style="font-weight: bold; color: #374151; margin-bottom: 5px;">EMPRESA</div><div>PRO MOTORS - LTDA</div></div>
            <div><div style="font-weight: bold; color: #374151; margin-bottom: 5px;">CENTRAL SAC</div><div>61 98154-8624</div></div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; text-align: center; font-size: 13px; margin-bottom: 15px;">
            <div><div style="font-weight: bold; color: #374151; margin-bottom: 5px;">CIDADE</div><div>CEILÂNDIA - BRASÍLIA<br/>SAMAMBAIA - BRASÍLIA</div></div>
            <div><div style="font-weight: bold; color: #374151; margin-bottom: 5px;">ENDEREÇO / SED</div><div>QNO 10/12 CONJ. A LOTE 02, ST "O", BRASÍLIA - DF<br/>QS 406 - SAMAMBAIA, BRASÍLIA - DF</div></div>
          </div>
          <div style="text-align: center; font-size: 13px;">
            <div style="font-weight: bold; color: #374151; margin-bottom: 5px;">CEP</div>
            <div>72.255-540 / 72.318-200</div>
          </div>
        </div>

        <!-- Dados do Cliente -->
        <div style="background-color: #eff6ff; padding: 25px; border-radius: 8px; margin-bottom: 25px; border: 1px solid #bfdbfe;">
          <h3 style="color: #1e40af; text-align: center; margin: 0 0 20px 0; font-weight: bold;">DADOS CONSULTADOS</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; text-align: center; margin-bottom: 15px;">
            <div><div style="font-weight: bold; color: #374151; margin-bottom: 8px;">CPF / CNPJ</div><div style="background: white; padding: 12px; border: 1px solid #d1d5db; border-radius: 4px; font-family: monospace;">${data.cliente.cpf}</div></div>
            <div><div style="font-weight: bold; color: #374151; margin-bottom: 8px;">NOME COMPLETO</div><div style="background: white; padding: 12px; border: 1px solid #d1d5db; border-radius: 4px;">${data.cliente.nome}</div></div>
            <div><div style="font-weight: bold; color: #374151; margin-bottom: 8px;">DATA DE NASCIMENTO</div><div style="background: white; padding: 12px; border: 1px solid #d1d5db; border-radius: 4px;">${data.cliente.nascimento}</div></div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; text-align: center;">
            <div><div style="font-weight: bold; color: #374151; margin-bottom: 8px;">NOME DA MÃE</div><div style="background: white; padding: 12px; border: 1px solid #d1d5db; border-radius: 4px;">${data.cliente.mae}</div></div>
            <div><div style="font-weight: bold; color: #374151; margin-bottom: 8px;">PROFISSÃO</div><div style="background: white; padding: 12px; border: 1px solid #d1d5db; border-radius: 4px;">${data.cliente.profissao}</div></div>
          </div>
        </div>

        <!-- Dados do Veículo -->
        <div style="background-color: #eff6ff; padding: 25px; border-radius: 8px; margin-bottom: 25px; border: 1px solid #bfdbfe;">
          <h3 style="color: #1e40af; text-align: center; margin: 0 0 20px 0; font-weight: bold;">DADOS DO BEM. DESEJADO COM CRÉDITO BANCÁRIO</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr 1fr; gap: 15px; text-align: center; margin-bottom: 15px;">
            <div><div style="font-weight: bold; color: #374151; margin-bottom: 8px;">MARCA</div><div style="background: white; padding: 12px; border: 1px solid #d1d5db; border-radius: 4px;">${data.veiculo.marca}</div></div>
            <div><div style="font-weight: bold; color: #374151; margin-bottom: 8px;">VALOR</div><div style="background: white; padding: 12px; border: 1px solid #d1d5db; border-radius: 4px;">R$ ${new Intl.NumberFormat('pt-BR').format(data.veiculo.valor)},00</div></div>
            <div><div style="font-weight: bold; color: #374151; margin-bottom: 8px;">VALOR FINAN.</div><div style="background: white; padding: 12px; border: 1px solid #d1d5db; border-radius: 4px;">R$ ${new Intl.NumberFormat('pt-BR').format(data.veiculo.valor - data.financiamento.entrada)},00</div></div>
            <div><div style="font-weight: bold; color: #374151; margin-bottom: 8px;">COR</div><div style="background: white; padding: 12px; border: 1px solid #d1d5db; border-radius: 4px;">-</div></div>
            <div><div style="font-weight: bold; color: #374151; margin-bottom: 8px;">ANO DE FAB.</div><div style="background: white; padding: 12px; border: 1px solid #d1d5db; border-radius: 4px;">${data.veiculo.ano}</div></div>
          </div>
          <div style="text-align: center;">
            <div style="font-weight: bold; color: #374151; margin-bottom: 8px;">NOME/MODELO</div>
            <div style="background: white; padding: 12px; border: 1px solid #d1d5db; border-radius: 4px; display: inline-block; min-width: 250px;">${data.veiculo.modelo}</div>
          </div>
        </div>

        <!-- Parcelamento Simulado -->
        <div style="background-color: #eff6ff; padding: 25px; border-radius: 8px; margin-bottom: 25px; border: 1px solid #bfdbfe;">
          <h3 style="color: #1e40af; text-align: center; margin: 0 0 20px 0; font-weight: bold;">PARCELAMENTO SIMULADO</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr 1fr; gap: 15px; text-align: center; font-size: 14px;">
            <div><strong>12X</strong><br/>R$ ${new Intl.NumberFormat('pt-BR').format(Math.round((data.veiculo.valor - data.financiamento.entrada) * 1.12 / 12))},00</div>
            <div><strong>24X</strong><br/>R$ ${new Intl.NumberFormat('pt-BR').format(Math.round((data.veiculo.valor - data.financiamento.entrada) * 1.24 / 24))},00</div>
            <div><strong>36X</strong><br/>R$ ${new Intl.NumberFormat('pt-BR').format(Math.round((data.veiculo.valor - data.financiamento.entrada) * 1.36 / 36))},00</div>
            <div><strong>48X</strong><br/>R$ ${new Intl.NumberFormat('pt-BR').format(Math.round((data.veiculo.valor - data.financiamento.entrada) * 1.48 / 48))},00</div>
            <div><strong>60X</strong><br/>R$ ${new Intl.NumberFormat('pt-BR').format(Math.round((data.veiculo.valor - data.financiamento.entrada) * 1.60 / 60))},00</div>
          </div>
        </div>

        <!-- Componentes Regularização -->
        <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #ef4444;">
          <h3 style="color: #dc2626; text-align: center; margin: 0 0 15px 0; font-weight: bold;">COMPONENTES COM NECESSIDADE DE REGULARIZAÇÃO</h3>
          <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #374151;">
            <li style="margin-bottom: 8px;">Dados inconsistentes com o sistema. Confirmação necessária para correção.</li>
            <li style="margin-bottom: 8px;">Renda não atualizada no sistema. Enviar documentação recente para regularização.</li>
            <li style="margin-bottom: 8px;">Histórico de consumo dos últimos 24 meses, com média de movimentação verificada.</li>
            <li>Confirmação necessária para atualizar o perfil cadastral do proponente de financiamento.</li>
          </ul>
        </div>

        <!-- Cotações Promocionais -->
        <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #22c55e;">
          <h3 style="color: #16a34a; text-align: center; margin: 0 0 15px 0; font-weight: bold;">COTAÇÕES PROMOCIONAIS DISPONÍVEIS POR PRAZO LIMITADO</h3>
          <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #374151;">
            <li style="margin-bottom: 8px;"><strong>1° PLANO CDC</strong> COM CONDIÇÕES ESPECIAIS INCLUSO DURANTE TODO O PERÍODO DE FINANCIAMENTO</li>
            <li style="margin-bottom: 8px;"><strong>2° GARANTIA ESTENDIDA</strong> DE 3 MESES PARA TODOS OS VEÍCULOS, OFERECENDO MAIS SEGURANÇA PARA VOCÊ</li>
            <li style="margin-bottom: 8px;"><strong>3° ACOMPANHAMENTO FINANCEIRO</strong> COMPLETO E SUPORTE TOTAL NA COMPLEMENTAÇÃO DOCUMENTAL</li>
            <li style="margin-bottom: 8px;"><strong>4° COMECE A PAGAR EM ATÉ</strong> 60 DIAS APÓS A ASSINATURA DO CONTRATO. MAIS FLEXIBILIDADE PARA O SEU BOLSO</li>
            <li><strong>5° FRETE GRATUITO VIA CEGONHA</strong> OU GUINCHO PARA CLIENTES SELECIONADOS. CONSULTE CONDIÇÕES</li>
          </ul>
        </div>

        <!-- Financiamento Principal -->
        <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 30px; border-radius: 8px; text-align: center; margin-bottom: 25px;">
          <h3 style="margin: 0 0 15px 0; font-size: 18px; font-weight: bold;">FINANCIAMENTO SOB REGULARIZAÇÃO</h3>
          <div style="font-size: 14px; margin-bottom: 10px; opacity: 0.9;">VALOR DE ENTRADA</div>
          <div style="font-size: 48px; font-weight: bold; margin-bottom: 20px;">R$ ${new Intl.NumberFormat('pt-BR').format(data.financiamento.entrada)},00</div>
          <div style="font-size: 14px; margin-bottom: 5px; font-weight: bold; opacity: 0.9;">PROPONENTE</div>
          <div style="font-size: 16px;">${data.cliente.nome}</div>
        </div>

        <!-- Datas -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;">
          <div style="text-align: center;">
            <div style="font-weight: bold; color: #374151; margin-bottom: 8px;">PROPOSTA ABERTA EM:</div>
            <div style="background: white; padding: 12px; border: 1px solid #d1d5db; border-radius: 4px;">${new Date().toLocaleDateString('pt-BR')}</div>
          </div>
          <div style="text-align: center;">
            <div style="font-weight: bold; color: #374151; margin-bottom: 8px;">EXPIRA EM:</div>
            <div style="background: white; padding: 12px; border: 1px solid #d1d5db; border-radius: 4px;">${new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')}</div>
          </div>
        </div>
      </div>

      <!-- Footer Legal -->
      <div style="background: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b;">
        <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 10px; justify-content: center;">
          <div style="background: #f59e0b; color: white; padding: 5px 10px; border-radius: 4px; font-weight: bold; font-size: 12px;">SPC BRASIL</div>
          <div style="font-size: 12px; color: #92400e; text-align: center;">LEI N 13.709 2018 BUSCA GARANTIR A QUALQUER PESSOA O DIREITO SOBRE OS SEUS DADOS PESSOAIS</div>
          <div style="background: #1e40af; color: white; padding: 5px 10px; border-radius: 4px; font-weight: bold; font-size: 12px;">LGPD</div>
        </div>

        <p style="margin: 0; font-size: 11px; color: #92400e; text-align: center;">
          <strong>LGPD - Lei Geral de Proteção de Dados:</strong> Seus dados pessoais são tratados em conformidade com a LGPD (Lei 13.709/2018). 
          Utilizamos suas informações exclusivamente para processar sua solicitação de financiamento.
        </p>
      </div>

      <div style="text-align: center; padding: 20px; font-size: 12px; color: #999;">
        Documento gerado em ${new Date().toLocaleDateString('pt-BR')} - Pro Motors Financiamentos
      </div>
    </div>
  `;
};

export const generateFinancingPDF = async (data: PDFData): Promise<Blob> => {
  console.log('Iniciando geração do PDF com dados:', data);
  
  const tempDiv = document.createElement('div');
  tempDiv.style.position = 'absolute';
  tempDiv.style.left = '-9999px';
  tempDiv.style.top = '0';
  tempDiv.style.width = '850px';
  tempDiv.style.backgroundColor = 'white';

  tempDiv.innerHTML = createPDFContent(data);
  document.body.appendChild(tempDiv);

  try {
    console.log('Aguardando renderização...');
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('Capturando canvas...');
    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      foreignObjectRendering: true,
      height: tempDiv.scrollHeight,
      width: tempDiv.scrollWidth
    });

    console.log('Canvas capturado, criando PDF...');
    const imgData = canvas.toDataURL('image/png', 1.0);
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

    console.log('PDF gerado com sucesso!');
    return pdf.output('blob');
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    throw error;
  } finally {
    if (document.body.contains(tempDiv)) {
      document.body.removeChild(tempDiv);
    }
  }
};

export const shareWhatsApp = (message: string, phone?: string) => {
  const phoneNumber = phone || '5561984833965';
  const encodedMessage = encodeURIComponent(message);
  window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
};

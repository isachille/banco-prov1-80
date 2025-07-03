
import React from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { PDFHeader } from './pdf/PDFHeader';
import { PDFProcessSteps } from './pdf/PDFProcessSteps';
import { PDFClientData } from './pdf/PDFClientData';
import { PDFVehicleData } from './pdf/PDFVehicleData';
import { PDFFinancingData } from './pdf/PDFFinancingData';
import { PDFOperatorData } from './pdf/PDFOperatorData';
import { PDFFooter } from './pdf/PDFFooter';

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

const PDFContent: React.FC<{ data: PDFData }> = ({ data }) => {
  const statusColor = data.status === 'APROVADO' ? '#22c55e' : 
                     data.status === 'PRE_APROVADO' ? '#f59e0b' : '#ef4444';

  const statusText = data.status === 'APROVADO' ? 'APROVADO' : 
                    data.status === 'PRE_APROVADO' ? 'PRÉ-APROVADO' : 'NEGADO';

  return (
    <div style={{ 
      maxWidth: '850px', 
      margin: '0 auto', 
      fontFamily: 'Arial, sans-serif', 
      lineHeight: '1.4', 
      background: 'white', 
      padding: '40px' 
    }}>
      <PDFHeader 
        statusColor={statusColor}
        statusText={statusText}
        codigoProposta={data.codigoProposta}
      />
      
      <PDFProcessSteps status={data.status} />
      
      <PDFClientData cliente={data.cliente} />
      
      <PDFVehicleData veiculo={data.veiculo} />
      
      <PDFFinancingData financiamento={data.financiamento} />
      
      <PDFOperatorData operador={data.operador} />
      
      <PDFFooter 
        status={data.status} 
        operadorTelefone={data.operador?.telefone} 
      />
    </div>
  );
};

export const generateFinancingPDF = async (data: PDFData): Promise<Blob> => {
  // Criar elemento temporário para renderizar o PDF
  const tempDiv = document.createElement('div');
  tempDiv.style.position = 'absolute';
  tempDiv.style.left = '-9999px';
  tempDiv.style.top = '0';
  tempDiv.style.width = '850px';
  tempDiv.style.backgroundColor = 'white';
  tempDiv.style.padding = '40px';
  tempDiv.style.fontFamily = 'Arial, sans-serif';

  // Renderizar o componente React no div temporário
  const React = await import('react');
  const ReactDOM = await import('react-dom/client');
  
  const root = ReactDOM.createRoot(tempDiv);
  
  // Renderizar o componente
  await new Promise<void>((resolve) => {
    root.render(React.createElement(PDFContent, { data }));
    // Aguardar a renderização
    setTimeout(resolve, 1500);
  });

  document.body.appendChild(tempDiv);

  try {
    // Aguardar um pouco para as imagens carregarem
    await new Promise(resolve => setTimeout(resolve, 1000));

    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      foreignObjectRendering: true,
      height: tempDiv.scrollHeight,
      width: tempDiv.scrollWidth,
      onclone: (clonedDoc) => {
        // Garantir que estilos sejam aplicados no clone
        const clonedDiv = clonedDoc.querySelector('div');
        if (clonedDiv) {
          clonedDiv.style.fontFamily = 'Arial, sans-serif';
          clonedDiv.style.backgroundColor = 'white';
        }
      }
    });

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

    // Cleanup
    root.unmount();
    
    return pdf.output('blob');
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

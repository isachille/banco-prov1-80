
import React from 'react';

interface FinancingData {
  entrada: number;
  parcelas: number;
  valorParcela: number;
  valorTotal: number;
}

interface PDFFinancingDataProps {
  financiamento: FinancingData;
}

export const PDFFinancingData: React.FC<PDFFinancingDataProps> = ({ financiamento }) => {
  return (
    <div style="margin-bottom: 25px;">
      <h3 style="color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; margin-bottom: 15px;">Simulação de Financiamento</h3>
      <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
          <div style="text-align: center; background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <div style="font-size: 12px; color: #666; margin-bottom: 5px;">ENTRADA</div>
            <div style="font-size: 20px; font-weight: bold; color: #1e40af;">
              ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(financiamento.entrada)}
            </div>
          </div>
          <div style="text-align: center; background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <div style="font-size: 12px; color: #666; margin-bottom: 5px;">PARCELAS</div>
            <div style="font-size: 20px; font-weight: bold; color: #1e40af;">
              ${financiamento.parcelas}x de ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(financiamento.valorParcela)}
            </div>
          </div>
        </div>
        <div style="text-align: center; background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 15px; border-radius: 8px;">
          <div style="font-size: 14px; margin-bottom: 5px;">VALOR TOTAL DO FINANCIAMENTO</div>
          <div style="font-size: 24px; font-weight: bold;">
            ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(financiamento.valorTotal)}
          </div>
        </div>
      </div>
    </div>
  );
};

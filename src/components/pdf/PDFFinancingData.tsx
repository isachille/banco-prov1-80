
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
    <div style={{ marginBottom: '25px' }}>
      <h3 style={{ color: '#1e40af', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px', marginBottom: '15px' }}>Simulação de Financiamento</h3>
      <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div style={{ textAlign: 'center', background: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>ENTRADA</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e40af' }}>
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(financiamento.entrada)}
            </div>
          </div>
          <div style={{ textAlign: 'center', background: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>PARCELAS</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e40af' }}>
              {financiamento.parcelas}x de {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(financiamento.valorParcela)}
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'center', background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)', color: 'white', padding: '15px', borderRadius: '8px' }}>
          <div style={{ fontSize: '14px', marginBottom: '5px' }}>VALOR TOTAL DO FINANCIAMENTO</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(financiamento.valorTotal)}
          </div>
        </div>
      </div>
    </div>
  );
};

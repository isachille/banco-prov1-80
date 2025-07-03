
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
    <div style={{ marginBottom: '20px', pageBreakInside: 'avoid' }}>
      <h3 style={{ color: '#1e40af', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px', marginBottom: '15px' }}>Simulação de Financiamento</h3>
      <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div style={{ textAlign: 'center', background: 'white', padding: '18px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px', fontWeight: 'bold' }}>ENTRADA</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e40af' }}>
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(financiamento.entrada)}
            </div>
          </div>
          <div style={{ textAlign: 'center', background: 'white', padding: '18px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px', fontWeight: 'bold' }}>PARCELAS</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e40af' }}>
              {financiamento.parcelas}x
            </div>
            <div style={{ fontSize: '16px', color: '#64748b', marginTop: '4px' }}>
              de {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(financiamento.valorParcela)}
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'center', background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)', color: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(30, 64, 175, 0.3)' }}>
          <div style={{ fontSize: '16px', marginBottom: '8px', opacity: '0.9' }}>VALOR TOTAL DO FINANCIAMENTO</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold' }}>
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(financiamento.valorTotal)}
          </div>
        </div>
      </div>
    </div>
  );
};

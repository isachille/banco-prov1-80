
import React from 'react';

interface FinancingDataProps {
  proposal: {
    entrada: number;
    parcelas: number;
    valorParcela: number;
    valorTotal: number;
  };
}

export const FinancingData: React.FC<FinancingDataProps> = ({ proposal }) => {
  return (
    <div style={{ marginBottom: '20px' }}>
      <h3 style={{ color: '#1e40af', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px', marginBottom: '15px' }}>Simulação de Financiamento</h3>
      <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '15px' }}>
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
        <div style={{ textAlign: 'center', background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)', color: 'white', padding: '15px', borderRadius: '8px' }}>
          <div style={{ fontSize: '14px', marginBottom: '5px' }}>VALOR TOTAL DO FINANCIAMENTO</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(proposal.valorTotal)}</div>
        </div>
      </div>
    </div>
  );
};

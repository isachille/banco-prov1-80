
import React from 'react';

interface VehicleDataProps {
  proposal: {
    marca: string;
    modelo: string;
    ano: number;
    valorVeiculo: number;
  };
}

export const VehicleData: React.FC<VehicleDataProps> = ({ proposal }) => {
  return (
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
  );
};

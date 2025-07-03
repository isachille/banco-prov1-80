
import React from 'react';

interface VehicleData {
  marca: string;
  modelo: string;
  ano: number;
  valor: number;
}

interface PDFVehicleDataProps {
  veiculo: VehicleData;
}

export const PDFVehicleData: React.FC<PDFVehicleDataProps> = ({ veiculo }) => {
  return (
    <div style={{ marginBottom: '25px' }}>
      <h3 style={{ color: '#1e40af', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px', marginBottom: '15px' }}>Veículo Selecionado</h3>
      <div style={{ backgroundColor: '#f1f5f9', padding: '20px', borderRadius: '8px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', alignItems: 'center' }}>
          <div>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#1e40af' }}>{veiculo.marca} {veiculo.modelo}</h4>
            <p style={{ margin: '0', color: '#666' }}>Ano: {veiculo.ano}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e40af' }}>
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(veiculo.valor)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

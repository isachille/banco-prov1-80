
import React from 'react';

interface OperatorDataProps {
  operador?: {
    nome: string;
    telefone: string;
  };
}

export const OperatorData: React.FC<OperatorDataProps> = ({ operador }) => {
  if (!operador) return null;

  return (
    <div style={{ marginBottom: '25px' }}>
      <h3 style={{ color: '#1e40af', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px', marginBottom: '15px' }}>Operador Responsável</h3>
      <div style={{ backgroundColor: '#f1f5f9', padding: '15px', borderRadius: '8px' }}>
        <p style={{ margin: '0', fontSize: '16px' }}><strong>{operador.nome}</strong></p>
        <p style={{ margin: '5px 0 0 0', color: '#666' }}>{operador.telefone}</p>
      </div>
    </div>
  );
};

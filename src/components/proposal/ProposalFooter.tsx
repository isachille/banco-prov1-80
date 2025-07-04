
import React from 'react';

interface ProposalFooterProps {
  operador?: {
    telefone: string;
  };
}

export const ProposalFooter: React.FC<ProposalFooterProps> = ({ operador }) => {
  return (
    <div style={{ marginTop: '40px', textAlign: 'center', borderTop: '2px solid #e5e7eb', paddingTop: '20px' }}>
      <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>Proposta pré-aprovada. Entre em contato para finalizar o processo.</p>
      <div style={{ marginTop: '15px', backgroundColor: '#1e40af', color: 'white', padding: '10px', borderRadius: '5px', display: 'inline-block' }}>
        <strong>{operador?.telefone || '(61) 98483-3965'}</strong>
      </div>
      
      <p style={{ margin: '15px 0 0 0', fontSize: '12px', color: '#999' }}>
        Documento gerado em {new Date().toLocaleDateString('pt-BR')} - Pro Motors Financiamentos
      </p>
    </div>
  );
};

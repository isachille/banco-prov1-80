
import React from 'react';

interface PDFProcessStepsProps {
  status: 'PRE_APROVADO' | 'APROVADO' | 'NEGADO';
}

export const PDFProcessSteps: React.FC<PDFProcessStepsProps> = ({ status }) => {
  return (
    <div style={{ marginBottom: '30px', backgroundColor: '#f8fafc', padding: '20px', borderRadius: '10px' }}>
      <h3 style={{ marginTop: '0', color: '#1e40af', fontSize: '16px' }}>Etapas do Financiamento</h3>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
        <div style={{ textAlign: 'center', flex: '1' }}>
          <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#22c55e', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 5px', fontWeight: 'bold' }}>1</div>
          <span style={{ fontSize: '12px', color: '#22c55e' }}>Solicitação</span>
        </div>
        <div style={{ flex: '1', height: '2px', backgroundColor: '#22c55e', margin: '0 10px' }}></div>
        <div style={{ textAlign: 'center', flex: '1' }}>
          <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: status !== 'NEGADO' ? '#22c55e' : '#e5e7eb', color: status !== 'NEGADO' ? 'white' : '#9ca3af', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 5px', fontWeight: 'bold' }}>2</div>
          <span style={{ fontSize: '12px', color: status !== 'NEGADO' ? '#22c55e' : '#9ca3af' }}>Análise</span>
        </div>
        <div style={{ flex: '1', height: '2px', backgroundColor: status === 'APROVADO' ? '#22c55e' : '#e5e7eb', margin: '0 10px' }}></div>
        <div style={{ textAlign: 'center', flex: '1' }}>
          <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: status === 'APROVADO' ? '#22c55e' : '#e5e7eb', color: status === 'APROVADO' ? 'white' : '#9ca3af', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 5px', fontWeight: 'bold' }}>3</div>
          <span style={{ fontSize: '12px', color: status === 'APROVADO' ? '#22c55e' : '#9ca3af' }}>Aprovação</span>
        </div>
      </div>
    </div>
  );
};


import React from 'react';

interface ProposalStatusProps {
  statusColor: string;
  statusText: string;
  proposalCode: string;
}

export const ProposalStatus: React.FC<ProposalStatusProps> = ({ statusColor, statusText, proposalCode }) => {
  return (
    <div style={{ textAlign: 'center', marginBottom: '25px' }}>
      <div style={{ backgroundColor: statusColor, color: 'white', padding: '18px 35px', borderRadius: '25px', display: 'inline-block', fontSize: '20px', fontWeight: 'bold' }}>{statusText}</div>
      <p style={{ marginTop: '12px', color: '#666', fontSize: '15px' }}>Código da Proposta: <strong style={{ color: '#1e40af' }}>{proposalCode}</strong></p>
    </div>
  );
};


import React from 'react';
import { ProposalActions } from './proposal/ProposalActions';
import { ProposalHeader } from './proposal/ProposalHeader';
import { ProposalStatus } from './proposal/ProposalStatus';
import { ClientData } from './proposal/ClientData';
import { VehicleData } from './proposal/VehicleData';
import { FinancingData } from './proposal/FinancingData';
import { OperatorData } from './proposal/OperatorData';
import { ProposalFooter } from './proposal/ProposalFooter';

interface ProposalPreviewProps {
  proposal: any;
  kycData: any;
  onBack: () => void;
}

export const ProposalPreview: React.FC<ProposalPreviewProps> = ({ proposal, kycData, onBack }) => {
  const statusColor = '#f59e0b'; // PRE_APROVADO - amarelo
  const statusText = 'PRÉ-APROVADO';

  return (
    <div className="max-w-4xl mx-auto bg-white">
      <ProposalActions proposal={proposal} kycData={kycData} onBack={onBack} />

      <div className="p-8">
        <div style={{ maxWidth: '850px', margin: '0 auto', fontFamily: 'Arial, sans-serif', lineHeight: '1.4', background: 'white', padding: '40px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
          <ProposalHeader />
          <ProposalStatus statusColor={statusColor} statusText={statusText} proposalCode={proposal.codigo} />
          <ClientData kycData={kycData} />
          <VehicleData proposal={proposal} />
          <FinancingData proposal={proposal} />
          <OperatorData operador={proposal.operador} />
          <ProposalFooter operador={proposal.operador} />
        </div>
      </div>
    </div>
  );
};

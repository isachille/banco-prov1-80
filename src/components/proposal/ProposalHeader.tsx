
import React from 'react';
import { BankIcons } from './BankIcons';

export const ProposalHeader: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', marginBottom: '30px', borderBottom: '3px solid #1e40af', paddingBottom: '20px' }}>
      <div style={{ background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)', color: 'white', padding: '25px', borderRadius: '10px', marginBottom: '20px' }}>
        <h1 style={{ margin: '0', fontSize: '38px', fontWeight: 'bold' }}>PRO MOTORS</h1>
        <p style={{ margin: '8px 0 0 0', fontSize: '18px', opacity: '0.95' }}>Financiamento Veicular</p>
      </div>
      
      <div style={{ backgroundColor: '#f0f9ff', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #0369a1' }}>
        <h4 style={{ margin: '0 0 8px 0', color: '#0369a1', fontSize: '14px', fontWeight: 'bold' }}>🔒 ANÁLISE VIA OPEN FINANCE</h4>
        <p style={{ margin: '0', fontSize: '12px', color: '#075985', lineHeight: '1.4' }}>
          Nosso sistema utiliza tecnologia Open Finance para avaliar seu perfil de crédito em tempo real junto aos principais bancos do país.
        </p>
      </div>
      
      <BankIcons />
    </div>
  );
};


import React from 'react';

interface ClientDataProps {
  kycData: {
    nome_completo: string;
    cpf: string;
    data_nascimento: string;
    nome_mae: string;
    profissao: string;
  };
}

export const ClientData: React.FC<ClientDataProps> = ({ kycData }) => {
  return (
    <div style={{ marginBottom: '25px' }}>
      <h3 style={{ color: '#1e40af', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px', marginBottom: '15px' }}>Dados do Cliente</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        <div><strong>Nome:</strong> {kycData.nome_completo}</div>
        <div><strong>CPF:</strong> {kycData.cpf}</div>
        <div><strong>Nascimento:</strong> {kycData.data_nascimento ? new Date(kycData.data_nascimento).toLocaleDateString('pt-BR') : 'Não informado'}</div>
        <div><strong>Nome da Mãe:</strong> {kycData.nome_mae}</div>
        <div style={{ gridColumn: 'span 2' }}><strong>Profissão:</strong> {kycData.profissao}</div>
      </div>
    </div>
  );
};

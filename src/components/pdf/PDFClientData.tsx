
import React from 'react';

interface ClientData {
  nome: string;
  cpf: string;
  nascimento: string;
  mae: string;
  profissao: string;
}

interface PDFClientDataProps {
  cliente: ClientData;
}

export const PDFClientData: React.FC<PDFClientDataProps> = ({ cliente }) => {
  return (
    <div style={{ marginBottom: '25px' }}>
      <h3 style={{ color: '#1e40af', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px', marginBottom: '15px' }}>Dados do Cliente</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        <div><strong>Nome:</strong> {cliente.nome}</div>
        <div><strong>CPF:</strong> {cliente.cpf}</div>
        <div><strong>Nascimento:</strong> {cliente.nascimento}</div>
        <div><strong>Nome da Mãe:</strong> {cliente.mae}</div>
        <div style={{ gridColumn: 'span 2' }}><strong>Profissão:</strong> {cliente.profissao}</div>
      </div>
    </div>
  );
};

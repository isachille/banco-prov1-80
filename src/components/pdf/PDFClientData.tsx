
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
    <div style="margin-bottom: 25px;">
      <h3 style="color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; margin-bottom: 15px;">Dados do Cliente</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
        <div><strong>Nome:</strong> ${cliente.nome}</div>
        <div><strong>CPF:</strong> ${cliente.cpf}</div>
        <div><strong>Nascimento:</strong> ${cliente.nascimento}</div>
        <div><strong>Nome da Mãe:</strong> ${cliente.mae}</div>
        <div style="grid-column: span 2;"><strong>Profissão:</strong> ${cliente.profissao}</div>
      </div>
    </div>
  );
};


import React from 'react';

interface PDFFooterProps {
  status: 'PRE_APROVADO' | 'APROVADO' | 'NEGADO';
  operadorTelefone?: string;
}

export const PDFFooter: React.FC<PDFFooterProps> = ({ status, operadorTelefone }) => {
  const getStatusMessage = () => {
    switch (status) {
      case 'PRE_APROVADO':
        return 'Proposta pré-aprovada. Entre em contato para finalizar o processo.';
      case 'APROVADO':
        return 'Parabéns! Sua proposta foi aprovada. Entre em contato para finalizar.';
      case 'NEGADO':
        return 'Proposta não aprovada no momento. Entre em contato para mais informações.';
      default:
        return '';
    }
  };

  return (
    <div style="margin-top: 40px; text-align: center; border-top: 2px solid #e5e7eb; padding-top: 20px;">
      <p style="margin: 0; font-size: 14px; color: #666;">
        ${getStatusMessage()}
      </p>
      <div style="margin-top: 15px; background-color: #1e40af; color: white; padding: 10px; border-radius: 5px; display: inline-block;">
        <strong>${operadorTelefone || '(61) 98483-3965'}</strong>
      </div>
      
      {/* Informações da Empresa */}
      <div style="margin-top: 20px; background-color: #f8fafc; padding: 15px; border-radius: 8px; text-align: left;">
        <h4 style="margin: 0 0 10px 0; color: #1e40af; text-align: center;">PRO MOTORS LTDA</h4>
        <div style="font-size: 12px; color: #666; line-height: 1.4;">
          <p style="margin: 5px 0;"><strong>CNPJ:</strong> 12.345.678/0001-90</p>
          <p style="margin: 5px 0;"><strong>Endereço:</strong> SIA Trecho 1, Lote 123 - Guará, Brasília - DF, CEP: 71200-000</p>
          <p style="margin: 5px 0;"><strong>Telefone:</strong> (61) 3333-4444</p>
          <p style="margin: 5px 0;"><strong>E-mail:</strong> contato@promotors.com.br</p>
        </div>
      </div>

      {/* LGPD */}
      <div style="margin-top: 15px; background-color: #fef3c7; padding: 10px; border-radius: 5px; border-left: 4px solid #f59e0b;">
        <p style="margin: 0; font-size: 11px; color: #92400e; text-align: left;">
          <strong>LGPD - Lei Geral de Proteção de Dados:</strong> Seus dados pessoais são tratados em conformidade com a LGPD (Lei 13.709/2018). 
          Utilizamos suas informações exclusivamente para processar sua solicitação de financiamento. Para exercer seus direitos ou obter mais informações 
          sobre o tratamento de seus dados, entre em contato conosco através dos canais oficiais.
        </p>
      </div>
      
      <p style="margin: 15px 0 0 0; font-size: 12px; color: #999;">
        Documento gerado em ${new Date().toLocaleDateString('pt-BR')} - Pro Motors Financiamentos
      </p>
    </div>
  );
};

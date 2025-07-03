
import React from 'react';

interface PDFHeaderProps {
  statusColor: string;
  statusText: string;
  codigoProposta: string;
}

export const PDFHeader: React.FC<PDFHeaderProps> = ({ statusColor, statusText, codigoProposta }) => {
  return (
    <>
      {/* Header com Logo */}
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px solid #1e40af; padding-bottom: 20px;">
        <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 20px; border-radius: 10px; margin-bottom: 15px; position: relative;">
          <div style="display: flex; align-items: center; justify-content: center; gap: 15px;">
            <img src="/lovable-uploads/4712549c-a705-4aad-8498-4702dc3cdd8f.png" alt="Pro Motors Logo" style="width: 80px; height: 80px; border-radius: 8px; background: white; padding: 8px;" />
            <div>
              <h1 style="margin: 0; font-size: 32px; font-weight: bold;">PRO MOTORS</h1>
              <p style="margin: 5px 0 0 0; font-size: 16px; opacity: 0.9;">Financiamento Veicular</p>
            </div>
          </div>
        </div>
        
        {/* Logos dos Bancos Parceiros */}
        <div style="display: flex; justify-content: center; align-items: center; gap: 20px; margin-bottom: 15px; flex-wrap: wrap;">
          <div style="text-align: center;">
            <div style="width: 60px; height: 40px; background: #FF6600; color: white; display: flex; align-items: center; justify-content: center; border-radius: 5px; font-weight: bold; font-size: 12px;">ITAÚ</div>
          </div>
          <div style="text-align: center;">
            <div style="width: 60px; height: 40px; background: #FFED00; color: #333; display: flex; align-items: center; justify-content: center; border-radius: 5px; font-weight: bold; font-size: 10px;">BANCO DO BRASIL</div>
          </div>
          <div style="text-align: center;">
            <div style="width: 60px; height: 40px; background: #E31E24; color: white; display: flex; align-items: center; justify-content: center; border-radius: 5px; font-weight: bold; font-size: 10px;">SANTANDER</div>
          </div>
          <div style="text-align: center;">
            <div style="width: 60px; height: 40px; background: #00A859; color: white; display: flex; align-items: center; justify-content: center; border-radius: 5px; font-weight: bold; font-size: 12px;">SICREDI</div>
          </div>
        </div>
      </div>

      {/* Status da Proposta */}
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="background-color: ${statusColor}; color: white; padding: 15px 30px; border-radius: 25px; display: inline-block; font-size: 18px; font-weight: bold;">
          ${statusText}
        </div>
        <p style="margin-top: 10px; color: #666; font-size: 14px;">Código da Proposta: <strong>${codigoProposta}</strong></p>
      </div>
    </>
  );
};

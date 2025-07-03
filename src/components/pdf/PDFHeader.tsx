
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
      <div style={{ textAlign: 'center', marginBottom: '30px', borderBottom: '3px solid #1e40af', paddingBottom: '20px' }}>
        <div style={{ background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)', color: 'white', padding: '20px', borderRadius: '10px', marginBottom: '15px', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
            <img src="/lovable-uploads/4712549c-a705-4aad-8498-4702dc3cdd8f.png" alt="Pro Motors Logo" style={{ width: '80px', height: '80px', borderRadius: '8px', background: 'white', padding: '8px' }} />
            <div>
              <h1 style={{ margin: '0', fontSize: '32px', fontWeight: 'bold' }}>PRO MOTORS</h1>
              <p style={{ margin: '5px 0 0 0', fontSize: '16px', opacity: '0.9' }}>Financiamento Veicular</p>
            </div>
          </div>
        </div>
        
        {/* Logos dos Bancos Parceiros */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginBottom: '15px', flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '60px', height: '40px', background: '#FF6600', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '5px', fontWeight: 'bold', fontSize: '12px' }}>ITAÚ</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '60px', height: '40px', background: '#FFED00', color: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '5px', fontWeight: 'bold', fontSize: '10px' }}>BANCO DO BRASIL</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '60px', height: '40px', background: '#E31E24', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '5px', fontWeight: 'bold', fontSize: '10px' }}>SANTANDER</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '60px', height: '40px', background: '#00A859', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '5px', fontWeight: 'bold', fontSize: '12px' }}>SICREDI</div>
          </div>
        </div>
      </div>

      {/* Status da Proposta */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <div style={{ backgroundColor: statusColor, color: 'white', padding: '15px 30px', borderRadius: '25px', display: 'inline-block', fontSize: '18px', fontWeight: 'bold' }}>
          {statusText}
        </div>
        <p style={{ marginTop: '10px', color: '#666', fontSize: '14px' }}>Código da Proposta: <strong>{codigoProposta}</strong></p>
      </div>
    </>
  );
};

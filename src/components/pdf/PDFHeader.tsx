
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
        <div style={{ background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)', color: 'white', padding: '25px', borderRadius: '10px', marginBottom: '20px', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
            <img 
              src="/lovable-uploads/4712549c-a705-4aad-8498-4702dc3cdd8f.png" 
              alt="Pro Motors Logo" 
              style={{ 
                width: '120px', 
                height: '120px', 
                borderRadius: '12px', 
                background: 'white', 
                padding: '12px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
              }} 
            />
            <div>
              <h1 style={{ margin: '0', fontSize: '38px', fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>PRO MOTORS</h1>
              <p style={{ margin: '8px 0 0 0', fontSize: '18px', opacity: '0.95', fontWeight: '500' }}>Financiamento Veicular</p>
            </div>
          </div>
        </div>
        
        {/* Open Finance Explanation */}
        <div style={{ backgroundColor: '#f0f9ff', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #0369a1' }}>
          <h4 style={{ margin: '0 0 8px 0', color: '#0369a1', fontSize: '14px', fontWeight: 'bold' }}>🔒 ANÁLISE VIA OPEN FINANCE</h4>
          <p style={{ margin: '0', fontSize: '12px', color: '#075985', lineHeight: '1.4' }}>
            Nosso sistema utiliza tecnologia Open Finance para avaliar seu perfil de crédito em tempo real junto aos principais bancos do país, 
            garantindo a melhor proposta de financiamento disponível no mercado.
          </p>
        </div>
        
        {/* Logos dos Bancos Parceiros */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', marginBottom: '15px', flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '70px', height: '45px', background: '#FF6600', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', fontWeight: 'bold', fontSize: '13px', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>ITAÚ</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '70px', height: '45px', background: '#FFED00', color: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', fontWeight: 'bold', fontSize: '9px', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>BANCO<br/>DO BRASIL</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '70px', height: '45px', background: '#E31E24', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', fontWeight: 'bold', fontSize: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>SANTANDER</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '70px', height: '45px', background: '#00A859', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', fontWeight: 'bold', fontSize: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>SICREDI</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '70px', height: '45px', background: '#1976D2', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', fontWeight: 'bold', fontSize: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>SAFRA</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '70px', height: '45px', background: '#662D91', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', fontWeight: 'bold', fontSize: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>NUBANK</div>
          </div>
        </div>
      </div>

      {/* Status da Proposta */}
      <div style={{ textAlign: 'center', marginBottom: '25px' }}>
        <div style={{ backgroundColor: statusColor, color: 'white', padding: '18px 35px', borderRadius: '25px', display: 'inline-block', fontSize: '20px', fontWeight: 'bold', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}>
          {statusText}
        </div>
        <p style={{ marginTop: '12px', color: '#666', fontSize: '15px', fontWeight: '500' }}>Código da Proposta: <strong style={{ color: '#1e40af' }}>{codigoProposta}</strong></p>
      </div>
    </>
  );
};

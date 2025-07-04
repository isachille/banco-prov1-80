
import React from 'react';

export const BankIcons: React.FC = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginBottom: '15px', flexWrap: 'wrap' }}>
      {/* Itaú */}
      <div style={{ width: '60px', height: '40px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', padding: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' }}>
        <svg width="44" height="24" viewBox="0 0 44 24" fill="none">
          <rect width="44" height="24" rx="4" fill="#FF6600"/>
          <text x="22" y="15" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">itaú</text>
        </svg>
      </div>
      
      {/* Banco do Brasil */}
      <div style={{ width: '60px', height: '40px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', padding: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' }}>
        <svg width="44" height="24" viewBox="0 0 44 24" fill="none">
          <rect width="44" height="24" rx="4" fill="#FFED00"/>
          <text x="22" y="10" textAnchor="middle" fill="#003366" fontSize="7" fontWeight="bold">BANCO</text>
          <text x="22" y="18" textAnchor="middle" fill="#003366" fontSize="7" fontWeight="bold">DO BRASIL</text>
        </svg>
      </div>
      
      {/* Santander */}
      <div style={{ width: '60px', height: '40px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', padding: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' }}>
        <svg width="44" height="24" viewBox="0 0 44 24" fill="none">
          <rect width="44" height="24" rx="4" fill="#E31E24"/>
          <text x="22" y="15" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">santander</text>
        </svg>
      </div>
      
      {/* Sicredi */}
      <div style={{ width: '60px', height: '40px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', padding: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' }}>
        <svg width="44" height="24" viewBox="0 0 44 24" fill="none">
          <rect width="44" height="24" rx="4" fill="#00A859"/>
          <text x="22" y="15" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">sicredi</text>
        </svg>
      </div>
      
      {/* Safra */}
      <div style={{ width: '60px', height: '40px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', padding: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' }}>
        <svg width="44" height="24" viewBox="0 0 44 24" fill="none">
          <rect width="44" height="24" rx="4" fill="#1976D2"/>
          <text x="22" y="15" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">safra</text>
        </svg>
      </div>
      
      {/* Nubank */}
      <div style={{ width: '60px', height: '40px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', padding: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' }}>
        <svg width="44" height="24" viewBox="0 0 44 24" fill="none">
          <rect width="44" height="24" rx="4" fill="#662D91"/>
          <text x="22" y="15" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">nubank</text>
        </svg>
      </div>
      
      {/* Inter */}
      <div style={{ width: '60px', height: '40px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', padding: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' }}>
        <svg width="44" height="24" viewBox="0 0 44 24" fill="none">
          <rect width="44" height="24" rx="4" fill="#FF7A00"/>
          <text x="22" y="15" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">inter</text>
        </svg>
      </div>
      
      {/* BTG */}
      <div style={{ width: '60px', height: '40px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', padding: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' }}>
        <svg width="44" height="24" viewBox="0 0 44 24" fill="none">
          <rect width="44" height="24" rx="4" fill="#000080"/>
          <text x="22" y="15" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">btg</text>
        </svg>
      </div>
    </div>
  );
};

import React from 'react';

interface Vehicle3DProps {
  categoria: string;
  cor: string;
  className?: string;
}

export const Vehicle3D: React.FC<Vehicle3DProps> = ({ categoria, cor, className = '' }) => {
  const getColorStyle = (color: string) => {
    const colorMap: { [key: string]: string } = {
      'Preto': '#1a1a1a',
      'Branco': '#f5f5f5',
      'Prata': '#c0c0c0',
      'Vermelho': '#dc2626',
      'Azul': '#2563eb',
      'Cinza': '#6b7280',
      'Amarelo': '#eab308',
      'Verde': '#16a34a'
    };
    return colorMap[color] || '#1a1a1a';
  };

  const colorHex = getColorStyle(cor);

  if (categoria === 'Motocicletas') {
    return (
      <div className={`relative ${className}`}>
        <svg viewBox="0 0 200 120" className="w-full h-full">
          {/* Rodas */}
          <circle cx="40" cy="90" r="20" fill="#2a2a2a" stroke="#404040" strokeWidth="2"/>
          <circle cx="40" cy="90" r="12" fill="#505050"/>
          <circle cx="160" cy="90" r="20" fill="#2a2a2a" stroke="#404040" strokeWidth="2"/>
          <circle cx="160" cy="90" r="12" fill="#505050"/>
          
          {/* Corpo da moto */}
          <path d="M 50 70 Q 80 60 100 50 L 120 55 Q 140 60 150 70" 
                fill={colorHex} stroke="#1a1a1a" strokeWidth="2"/>
          <rect x="95" y="50" width="30" height="15" fill={colorHex} stroke="#1a1a1a" strokeWidth="2"/>
          
          {/* Guidão */}
          <path d="M 130 40 L 140 35 M 130 40 L 120 35" 
                stroke="#2a2a2a" strokeWidth="3" fill="none"/>
          
          {/* Tanque */}
          <ellipse cx="100" cy="55" rx="18" ry="12" fill={colorHex} stroke="#1a1a1a" strokeWidth="2"/>
          
          {/* Suspensões */}
          <line x1="40" y1="70" x2="65" y2="55" stroke="#404040" strokeWidth="3"/>
          <line x1="160" y1="70" x2="135" y2="60" stroke="#404040" strokeWidth="3"/>
          
          {/* Escapamento */}
          <path d="M 70 75 Q 90 78 110 75" stroke="#505050" strokeWidth="4" fill="none"/>
        </svg>
      </div>
    );
  }

  if (categoria === 'Populares') {
    return (
      <div className={`relative ${className}`}>
        <svg viewBox="0 0 200 100" className="w-full h-full">
          {/* Corpo compacto */}
          <rect x="20" y="35" width="140" height="40" rx="8" fill={colorHex} stroke="#1a1a1a" strokeWidth="2"/>
          
          {/* Teto baixo */}
          <path d="M 40 35 Q 60 20 100 20 Q 140 20 150 35" 
                fill={colorHex} stroke="#1a1a1a" strokeWidth="2"/>
          
          {/* Janelas */}
          <rect x="50" y="25" width="35" height="18" rx="2" fill="#4a9eff" opacity="0.6"/>
          <rect x="110" y="25" width="35" height="18" rx="2" fill="#4a9eff" opacity="0.6"/>
          
          {/* Rodas */}
          <circle cx="45" cy="75" r="15" fill="#2a2a2a"/>
          <circle cx="45" cy="75" r="8" fill="#505050"/>
          <circle cx="145" cy="75" r="15" fill="#2a2a2a"/>
          <circle cx="145" cy="75" r="8" fill="#505050"/>
          
          {/* Faróis */}
          <circle cx="25" cy="50" r="5" fill="#ffe066"/>
          <circle cx="165" cy="50" r="5" fill="#ff6b6b"/>
        </svg>
      </div>
    );
  }

  if (categoria === 'Sedans') {
    return (
      <div className={`relative ${className}`}>
        <svg viewBox="0 0 200 100" className="w-full h-full">
          {/* Corpo alongado */}
          <rect x="10" y="35" width="170" height="40" rx="6" fill={colorHex} stroke="#1a1a1a" strokeWidth="2"/>
          
          {/* Teto sedan */}
          <path d="M 30 35 Q 50 18 90 18 L 130 18 Q 160 18 170 35" 
                fill={colorHex} stroke="#1a1a1a" strokeWidth="2"/>
          
          {/* Janelas */}
          <rect x="40" y="22" width="40" height="18" rx="2" fill="#4a9eff" opacity="0.6"/>
          <rect x="85" y="22" width="45" height="18" rx="2" fill="#4a9eff" opacity="0.6"/>
          <rect x="135" y="22" width="30" height="18" rx="2" fill="#4a9eff" opacity="0.6"/>
          
          {/* Rodas */}
          <circle cx="40" cy="75" r="16" fill="#2a2a2a"/>
          <circle cx="40" cy="75" r="9" fill="#505050"/>
          <circle cx="155" cy="75" r="16" fill="#2a2a2a"/>
          <circle cx="155" cy="75" r="9" fill="#505050"/>
          
          {/* Faróis */}
          <rect x="12" y="45" width="8" height="12" rx="2" fill="#ffe066"/>
          <rect x="172" y="45" width="8" height="12" rx="2" fill="#ff6b6b"/>
          
          {/* Grade frontal */}
          <rect x="12" y="52" width="8" height="8" fill="#2a2a2a"/>
        </svg>
      </div>
    );
  }

  // Default para SUVs, Picapes, etc
  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 200 110" className="w-full h-full">
        {/* Corpo robusto */}
        <rect x="15" y="30" width="160" height="45" rx="5" fill={colorHex} stroke="#1a1a1a" strokeWidth="2"/>
        
        {/* Teto alto */}
        <path d="M 35 30 Q 55 12 100 12 Q 145 12 160 30" 
              fill={colorHex} stroke="#1a1a1a" strokeWidth="2"/>
        
        {/* Janelas */}
        <rect x="45" y="18" width="45" height="18" rx="2" fill="#4a9eff" opacity="0.6"/>
        <rect x="105" y="18" width="45" height="18" rx="2" fill="#4a9eff" opacity="0.6"/>
        
        {/* Rodas grandes */}
        <circle cx="45" cy="80" r="18" fill="#2a2a2a"/>
        <circle cx="45" cy="80" r="10" fill="#505050"/>
        <circle cx="150" cy="80" r="18" fill="#2a2a2a"/>
        <circle cx="150" cy="80" r="10" fill="#505050"/>
        
        {/* Faróis */}
        <circle cx="20" cy="50" r="6" fill="#ffe066"/>
        <circle cx="175" cy="50" r="6" fill="#ff6b6b"/>
        
        {/* Grade */}        <rect x="18" y="55" width="10" height="15" fill="#2a2a2a"/>
      </svg>
    </div>
  );
};

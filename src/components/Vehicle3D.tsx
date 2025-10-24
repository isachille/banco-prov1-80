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
      'Branco': '#f8f9fa',
      'Prata': '#b8b8b8',
      'Vermelho': '#dc2626',
      'Azul': '#2563eb',
      'Cinza': '#6b7280',
      'Amarelo': '#fbbf24',
      'Verde': '#16a34a'
    };
    return colorMap[color] || '#1a1a1a';
  };

  const getGradientColors = (baseColor: string) => {
    const color = baseColor.toLowerCase();
    // Criar gradiente mais escuro para dar profundidade
    const brightness = 0.6; // Escurecer para sombra
    return {
      light: baseColor,
      dark: `${baseColor}${Math.floor(brightness * 100).toString(16).padStart(2, '0')}`
    };
  };

  const colorHex = getColorStyle(cor);
  const gradient = getGradientColors(colorHex);

  if (categoria === 'Motocicletas') {
    return (
      <div className={`relative ${className}`}>
        <svg viewBox="0 0 220 140" className="w-full h-full drop-shadow-2xl">
          <defs>
            <linearGradient id="motoBody" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: gradient.light, stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: gradient.dark, stopOpacity: 1 }} />
            </linearGradient>
            <radialGradient id="wheel">
              <stop offset="0%" style={{ stopColor: '#505050' }} />
              <stop offset="70%" style={{ stopColor: '#2a2a2a' }} />
              <stop offset="100%" style={{ stopColor: '#1a1a1a' }} />
            </radialGradient>
            <filter id="shadow">
              <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
              <feOffset dx="2" dy="4" result="offsetblur"/>
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.3"/>
              </feComponentTransfer>
              <feMerge>
                <feMergeNode/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Sombra no chão */}
          <ellipse cx="110" cy="115" rx="80" ry="8" fill="black" opacity="0.2"/>
          
          {/* Rodas com profundidade */}
          <g filter="url(#shadow)">
            <circle cx="45" cy="95" r="22" fill="url(#wheel)" stroke="#1a1a1a" strokeWidth="2"/>
            <circle cx="45" cy="95" r="14" fill="#404040"/>
            <circle cx="45" cy="95" r="8" fill="#606060"/>
            
            <circle cx="175" cy="95" r="22" fill="url(#wheel)" stroke="#1a1a1a" strokeWidth="2"/>
            <circle cx="175" cy="95" r="14" fill="#404040"/>
            <circle cx="175" cy="95" r="8" fill="#606060"/>
          </g>
          
          {/* Corpo da moto com gradiente */}
          <g filter="url(#shadow)">
            <path d="M 55 75 Q 85 62 110 52 L 135 57 Q 160 65 170 75" 
                  fill="url(#motoBody)" stroke="#0a0a0a" strokeWidth="2.5"/>
            <rect x="105" y="52" width="35" height="18" rx="2" fill="url(#motoBody)" stroke="#0a0a0a" strokeWidth="2"/>
            
            {/* Tanque com brilho */}
            <ellipse cx="110" cy="58" rx="22" ry="14" fill="url(#motoBody)" stroke="#0a0a0a" strokeWidth="2"/>
            <ellipse cx="108" cy="54" rx="12" ry="6" fill="white" opacity="0.3"/>
            
            {/* Banco */}
            <ellipse cx="85" cy="62" rx="16" ry="8" fill="#2a2a2a" stroke="#1a1a1a" strokeWidth="1.5"/>
          </g>
          
          {/* Guidão */}
          <path d="M 140 42 L 152 36 M 140 42 L 128 36" 
                stroke="#3a3a3a" strokeWidth="4" fill="none" strokeLinecap="round"/>
          
          {/* Suspensões */}
          <line x1="45" y1="73" x2="70" y2="58" stroke="#505050" strokeWidth="4"/>
          <line x1="175" y1="73" x2="150" y2="62" stroke="#505050" strokeWidth="4"/>
          
          {/* Escapamento com brilho metálico */}
          <path d="M 75 80 Q 95 83 120 80" stroke="#808080" strokeWidth="5" fill="none" strokeLinecap="round"/>
          <path d="M 75 80 Q 95 83 120 80" stroke="#a0a0a0" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6"/>
          
          {/* Farol */}
          <circle cx="148" cy="50" r="6" fill="#ffe066" opacity="0.8" filter="url(#shadow)"/>
        </svg>
      </div>
    );
  }

  if (categoria === 'Populares') {
    return (
      <div className={`relative ${className}`}>
        <svg viewBox="0 0 220 120" className="w-full h-full drop-shadow-2xl">
          <defs>
            <linearGradient id="popBody" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: gradient.light, stopOpacity: 1 }} />
              <stop offset="50%" style={{ stopColor: colorHex, stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: gradient.dark, stopOpacity: 1 }} />
            </linearGradient>
            <linearGradient id="popRoof" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: gradient.light, stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: colorHex, stopOpacity: 1 }} />
            </linearGradient>
            <radialGradient id="wheelPop">
              <stop offset="0%" style={{ stopColor: '#606060' }} />
              <stop offset="60%" style={{ stopColor: '#3a3a3a' }} />
              <stop offset="100%" style={{ stopColor: '#1a1a1a' }} />
            </radialGradient>
          </defs>
          
          {/* Sombra */}
          <ellipse cx="110" cy="100" rx="70" ry="6" fill="black" opacity="0.25"/>
          
          {/* Corpo compacto com gradiente */}
          <rect x="25" y="45" width="150" height="38" rx="6" fill="url(#popBody)" stroke="#0a0a0a" strokeWidth="2.5"/>
          
          {/* Teto baixo */}
          <path d="M 45 45 Q 65 25 110 25 Q 155 25 165 45" 
                fill="url(#popRoof)" stroke="#0a0a0a" strokeWidth="2.5"/>
          
          {/* Brilho no teto */}
          <path d="M 70 30 Q 110 28 150 30" stroke="white" strokeWidth="2" opacity="0.3" fill="none"/>
          
          {/* Janelas com reflexo */}
          <rect x="55" y="30" width="38" height="20" rx="2" fill="#87ceeb" opacity="0.7"/>
          <rect x="57" y="32" width="15" height="8" rx="1" fill="white" opacity="0.4"/>
          
          <rect x="120" y="30" width="38" height="20" rx="2" fill="#87ceeb" opacity="0.7"/>
          <rect x="122" y="32" width="15" height="8" rx="1" fill="white" opacity="0.4"/>
          
          {/* Detalhes laterais */}
          <line x1="25" y1="62" x2="175" y2="62" stroke="#0a0a0a" strokeWidth="1.5"/>
          <rect x="25" y="70" width="150" height="3" fill="#1a1a1a" opacity="0.3"/>
          
          {/* Rodas 3D */}
          <g>
            <circle cx="50" cy="85" r="17" fill="url(#wheelPop)" stroke="#0a0a0a" strokeWidth="2"/>
            <circle cx="50" cy="85" r="10" fill="#505050"/>
            <circle cx="50" cy="85" r="5" fill="#707070"/>
            <circle cx="48" cy="83" r="3" fill="#909090"/>
            
            <circle cx="160" cy="85" r="17" fill="url(#wheelPop)" stroke="#0a0a0a" strokeWidth="2"/>
            <circle cx="160" cy="85" r="10" fill="#505050"/>
            <circle cx="160" cy="85" r="5" fill="#707070"/>
            <circle cx="158" cy="83" r="3" fill="#909090"/>
          </g>
          
          {/* Faróis com brilho */}
          <ellipse cx="28" cy="55" rx="6" ry="7" fill="#ffe066" opacity="0.9"/>
          <circle cx="28" cy="53" r="3" fill="#fff8dc" opacity="0.7"/>
          
          {/* Lanternas */}
          <ellipse cx="172" cy="55" rx="5" ry="6" fill="#ff4444" opacity="0.8"/>
          
          {/* Grade */}
          <rect x="26" y="62" width="10" height="8" rx="1" fill="#2a2a2a"/>
        </svg>
      </div>
    );
  }

  if (categoria === 'Sedans') {
    return (
      <div className={`relative ${className}`}>
        <svg viewBox="0 0 240 120" className="w-full h-full drop-shadow-2xl">
          <defs>
            <linearGradient id="sedanBody" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: gradient.light, stopOpacity: 1 }} />
              <stop offset="40%" style={{ stopColor: colorHex, stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: gradient.dark, stopOpacity: 1 }} />
            </linearGradient>
            <linearGradient id="sedanRoof" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: gradient.light, stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: colorHex, stopOpacity: 1 }} />
            </linearGradient>
            <radialGradient id="wheelSedan">
              <stop offset="0%" style={{ stopColor: '#707070' }} />
              <stop offset="50%" style={{ stopColor: '#404040' }} />
              <stop offset="100%" style={{ stopColor: '#1a1a1a' }} />
            </radialGradient>
          </defs>
          
          {/* Sombra elegante */}
          <ellipse cx="120" cy="102" rx="85" ry="7" fill="black" opacity="0.3"/>
          
          {/* Corpo alongado e elegante */}
          <path d="M 15 45 L 15 70 Q 15 78 23 78 L 35 78 L 50 78 L 185 78 L 200 78 Q 208 78 208 70 L 208 45 Q 208 42 205 42 L 18 42 Q 15 42 15 45 Z" 
                fill="url(#sedanBody)" stroke="#0a0a0a" strokeWidth="2.5"/>
          
          {/* Teto sedan elegante */}
          <path d="M 35 42 Q 55 22 100 22 L 145 22 Q 185 22 200 42" 
                fill="url(#sedanRoof)" stroke="#0a0a0a" strokeWidth="2.5"/>
          
          {/* Brilho no capô */}
          <path d="M 25 50 Q 60 48 100 48" stroke="white" strokeWidth="2.5" opacity="0.25" fill="none" strokeLinecap="round"/>
          
          {/* Janelas com reflexo realista */}
          <rect x="45" y="27" width="45" height="20" rx="2" fill="#87ceeb" opacity="0.75"/>
          <rect x="47" y="29" width="18" height="10" rx="1" fill="white" opacity="0.4"/>
          
          <rect x="95" y="27" width="48" height="20" rx="2" fill="#87ceeb" opacity="0.75"/>
          <rect x="97" y="29" width="20" height="10" rx="1" fill="white" opacity="0.4"/>
          
          <rect x="148" y="27" width="45" height="20" rx="2" fill="#87ceeb" opacity="0.75"/>
          <rect x="150" y="29" width="18" height="10" rx="1" fill="white" opacity="0.4"/>
          
          {/* Divisores de janela (pilares) */}
          <rect x="90" y="27" width="5" height="20" fill="#1a1a1a"/>
          <rect x="143" y="27" width="5" height="20" fill="#1a1a1a"/>
          
          {/* Detalhes laterais */}
          <line x1="15" y1="65" x2="208" y2="65" stroke="#0a0a0a" strokeWidth="2"/>
          <path d="M 20 72 L 203 72" stroke="#1a1a1a" strokeWidth="1.5" opacity="0.4"/>
          
          {/* Rodas 3D realistas */}
          <g>
            <circle cx="50" cy="88" r="18" fill="url(#wheelSedan)" stroke="#0a0a0a" strokeWidth="2.5"/>
            <circle cx="50" cy="88" r="11" fill="#555555"/>
            <circle cx="50" cy="88" r="6" fill="#757575"/>
            <circle cx="48" cy="86" r="4" fill="#959595"/>
            
            <circle cx="180" cy="88" r="18" fill="url(#wheelSedan)" stroke="#0a0a0a" strokeWidth="2.5"/>
            <circle cx="180" cy="88" r="11" fill="#555555"/>
            <circle cx="180" cy="88" r="6" fill="#757575"/>
            <circle cx="178" cy="86" r="4" fill="#959595"/>
          </g>
          
          {/* Faróis modernos */}
          <ellipse cx="18" cy="52" rx="7" ry="10" fill="#ffe066" opacity="0.9"/>
          <ellipse cx="18" cy="50" rx="4" ry="6" fill="#fff8dc" opacity="0.8"/>
          
          {/* Lanternas traseiras */}
          <rect x="202" y="48" width="6" height="14" rx="2" fill="#ff4444" opacity="0.85"/>
          <rect x="203" y="50" width="4" height="6" rx="1" fill="#ff6666" opacity="0.6"/>
          
          {/* Grade frontal detalhada */}
          <rect x="16" y="58" width="9" height="10" rx="1" fill="#2a2a2a"/>
          <line x1="17" y1="60" x2="24" y2="60" stroke="#404040" strokeWidth="0.5"/>
          <line x1="17" y1="63" x2="24" y2="63" stroke="#404040" strokeWidth="0.5"/>
          <line x1="17" y1="66" x2="24" y2="66" stroke="#404040" strokeWidth="0.5"/>
          
          {/* Maçanetas */}
          <rect x="65" y="55" width="8" height="3" rx="1" fill="#3a3a3a"/>
          <rect x="120" y="55" width="8" height="3" rx="1" fill="#3a3a3a"/>
        </svg>
      </div>
    );
  }

  // Default para SUVs, Picapes, etc
  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 240 130" className="w-full h-full drop-shadow-2xl">
        <defs>
          <linearGradient id="suvBody" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: gradient.light, stopOpacity: 1 }} />
            <stop offset="35%" style={{ stopColor: colorHex, stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: gradient.dark, stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient id="suvRoof" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: gradient.light, stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: colorHex, stopOpacity: 1 }} />
          </linearGradient>
          <radialGradient id="wheelSUV">
            <stop offset="0%" style={{ stopColor: '#808080' }} />
            <stop offset="40%" style={{ stopColor: '#505050' }} />
            <stop offset="100%" style={{ stopColor: '#202020' }} />
          </radialGradient>
        </defs>
        
        {/* Sombra robusta */}
        <ellipse cx="120" cy="110" rx="90" ry="8" fill="black" opacity="0.35"/>
        
        {/* Corpo robusto e alto */}
        <path d="M 20 40 L 20 75 Q 20 82 27 82 L 40 82 L 55 82 L 185 82 L 200 82 Q 207 82 207 75 L 207 40 Q 207 37 204 37 L 23 37 Q 20 37 20 40 Z" 
              fill="url(#suvBody)" stroke="#0a0a0a" strokeWidth="2.8"/>
        
        {/* Teto alto característico de SUV */}
        <path d="M 40 37 Q 60 15 120 15 Q 180 15 195 37" 
              fill="url(#suvRoof)" stroke="#0a0a0a" strokeWidth="2.8"/>
        
        {/* Brilho no capô */}
        <path d="M 30 48 Q 70 45 120 45" stroke="white" strokeWidth="3" opacity="0.3" fill="none" strokeLinecap="round"/>
        
        {/* Rack de teto */}
        <rect x="50" y="17" width="4" height="8" fill="#3a3a3a" rx="1"/>
        <rect x="48" y="16" width="8" height="2" fill="#4a4a4a" rx="1"/>
        <rect x="175" y="17" width="4" height="8" fill="#3a3a3a" rx="1"/>
        <rect x="173" y="16" width="8" height="2" fill="#4a4a4a" rx="1"/>
        
        {/* Janelas grandes com reflexos */}
        <rect x="50" y="22" width="50" height="20" rx="2" fill="#87ceeb" opacity="0.8"/>
        <rect x="52" y="24" width="22" height="12" rx="1" fill="white" opacity="0.45"/>
        
        <rect x="115" y="22" width="50" height="20" rx="2" fill="#87ceeb" opacity="0.8"/>
        <rect x="117" y="24" width="22" height="12" rx="1" fill="white" opacity="0.45"/>
        
        {/* Divisores de janela (pilares fortes) */}
        <rect x="100" y="22" width="7" height="20" fill="#1a1a1a"/>
        <rect x="165" y="22" width="7" height="20" fill="#1a1a1a"/>
        
        {/* Detalhes laterais e proteção */}
        <rect x="20" y="68" width="187" height="4" fill="#2a2a2a" opacity="0.6"/>
        <line x1="20" y1="70" x2="207" y2="70" stroke="#0a0a0a" strokeWidth="2.5"/>
        <path d="M 25 78 L 202 78" stroke="#1a1a1a" strokeWidth="2" opacity="0.5"/>
        
        {/* Para-choque inferior robusto */}
        <rect x="20" y="80" width="187" height="5" rx="1" fill="#2a2a2a"/>
        
        {/* Rodas grandes off-road */}
        <g>
          <circle cx="55" cy="95" r="20" fill="url(#wheelSUV)" stroke="#0a0a0a" strokeWidth="3"/>
          <circle cx="55" cy="95" r="13" fill="#606060"/>
          <circle cx="55" cy="95" r="7" fill="#808080"/>
          <circle cx="53" cy="93" r="5" fill="#a0a0a0"/>
          {/* Desenho do pneu */}
          <circle cx="55" cy="95" r="19" fill="none" stroke="#1a1a1a" strokeWidth="1.5"/>
          
          <circle cx="185" cy="95" r="20" fill="url(#wheelSUV)" stroke="#0a0a0a" strokeWidth="3"/>
          <circle cx="185" cy="95" r="13" fill="#606060"/>
          <circle cx="185" cy="95" r="7" fill="#808080"/>
          <circle cx="183" cy="93" r="5" fill="#a0a0a0"/>
          {/* Desenho do pneu */}
          <circle cx="185" cy="95" r="19" fill="none" stroke="#1a1a1a" strokeWidth="1.5"/>
        </g>
        
        {/* Faróis modernos LED */}
        <g>
          <ellipse cx="25" cy="52" rx="8" ry="11" fill="#ffe066" opacity="0.95"/>
          <ellipse cx="25" cy="49" rx="5" ry="7" fill="#fff8dc" opacity="0.85"/>
          <rect x="22" y="47" width="2" height="3" fill="white" opacity="0.9"/>
        </g>
        
        {/* Lanternas traseiras LED */}
        <g>
          <rect x="200" y="48" width="7" height="16" rx="2" fill="#ff3333" opacity="0.9"/>
          <rect x="201" y="50" width="5" height="5" rx="1" fill="#ff5555" opacity="0.7"/>
          <rect x="201" y="58" width="5" height="4" rx="1" fill="#ff6666" opacity="0.6"/>
        </g>
        
        {/* Grade frontal robusta */}
        <rect x="22" y="62" width="11" height="13" rx="1" fill="#2a2a2a"/>
        <line x1="24" y1="64" x2="31" y2="64" stroke="#454545" strokeWidth="0.8"/>
        <line x1="24" y1="67" x2="31" y2="67" stroke="#454545" strokeWidth="0.8"/>
        <line x1="24" y1="70" x2="31" y2="70" stroke="#454545" strokeWidth="0.8"/>
        <line x1="24" y1="73" x2="31" y2="73" stroke="#454545" strokeWidth="0.8"/>
        
        {/* Maçanetas e detalhes */}
        <rect x="75" y="58" width="10" height="4" rx="1" fill="#404040"/>
        <rect x="135" y="58" width="10" height="4" rx="1" fill="#404040"/>
        
        {/* Espelho retrovisor */}
        <ellipse cx="42" cy="45" rx="4" ry="6" fill="#2a2a2a" stroke="#1a1a1a" strokeWidth="1"/>
      </svg>
    </div>
  );
};

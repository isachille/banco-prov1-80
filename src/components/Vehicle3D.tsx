import React from 'react';
import motoBase from '@/assets/moto-base.png';
import sedanBase from '@/assets/sedan-base.png';
import suvBase from '@/assets/suv-base.png';

interface Vehicle3DProps {
  categoria: string;
  cor: string;
  className?: string;
}

export const Vehicle3D: React.FC<Vehicle3DProps> = ({ categoria, cor, className = '' }) => {
  const getColorFilter = (color: string) => {
    // Mapear cores para filtros CSS hue-rotate e saturate
    const colorFilters: { [key: string]: string } = {
      'Preto': 'brightness(0.3) saturate(0)',
      'Branco': 'brightness(1.5) saturate(0)',
      'Prata': 'brightness(1.2) saturate(0.3)',
      'Vermelho': 'hue-rotate(0deg) saturate(1.5)',
      'Azul': 'hue-rotate(200deg) saturate(1.3)',
      'Cinza': 'brightness(0.7) saturate(0.2)',
      'Amarelo': 'hue-rotate(50deg) saturate(1.8) brightness(1.2)',
      'Verde': 'hue-rotate(100deg) saturate(1.4)'
    };
    return colorFilters[color] || 'none';
  };

  const colorFilter = getColorFilter(cor);
  
  const getVehicleImage = () => {
    if (categoria === 'Motocicletas') {
      return motoBase;
    } else if (categoria === 'Populares') {
      return sedanBase;
    } else if (categoria === 'Sedans') {
      return sedanBase;
    } else {
      // SUVs, Picapes, etc
      return suvBase;
    }
  };

  const vehicleImage = getVehicleImage();

  return (
    <div className={`relative ${className} flex items-center justify-center`}>
      <img 
        src={vehicleImage} 
        alt={`${categoria} ${cor}`}
        className="w-full h-full object-contain drop-shadow-2xl transition-all duration-300"
        style={{ 
          filter: colorFilter,
          maxHeight: '300px'
        }}
      />
    </div>
  );
};

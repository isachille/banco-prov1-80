
import React from 'react';

interface VehicleData {
  marca: string;
  modelo: string;
  ano: number;
  valor: number;
}

interface PDFVehicleDataProps {
  veiculo: VehicleData;
}

export const PDFVehicleData: React.FC<PDFVehicleDataProps> = ({ veiculo }) => {
  return (
    <div style="margin-bottom: 25px;">
      <h3 style="color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; margin-bottom: 15px;">Veículo Selecionado</h3>
      <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; align-items: center;">
          <div>
            <h4 style="margin: 0 0 10px 0; font-size: 18px; color: #1e40af;">${veiculo.marca} ${veiculo.modelo}</h4>
            <p style="margin: 0; color: #666;">Ano: ${veiculo.ano}</p>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 24px; font-weight: bold; color: #1e40af;">
              ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(veiculo.valor)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

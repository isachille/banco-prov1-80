
import React from 'react';

interface PDFProcessStepsProps {
  status: 'PRE_APROVADO' | 'APROVADO' | 'NEGADO';
}

export const PDFProcessSteps: React.FC<PDFProcessStepsProps> = ({ status }) => {
  return (
    <div style="margin-bottom: 30px; background-color: #f8fafc; padding: 20px; border-radius: 10px;">
      <h3 style="margin-top: 0; color: #1e40af; font-size: 16px;">Etapas do Financiamento</h3>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
        <div style="text-align: center; flex: 1;">
          <div style="width: 30px; height: 30px; border-radius: 50%; background-color: #22c55e; color: white; display: flex; align-items: center; justify-content: center; margin: 0 auto 5px; font-weight: bold;">1</div>
          <span style="font-size: 12px; color: #22c55e;">Solicitação</span>
        </div>
        <div style="flex: 1; height: 2px; background-color: #22c55e; margin: 0 10px;"></div>
        <div style="text-align: center; flex: 1;">
          <div style="width: 30px; height: 30px; border-radius: 50%; background-color: ${status !== 'NEGADO' ? '#22c55e' : '#e5e7eb'}; color: ${status !== 'NEGADO' ? 'white' : '#9ca3af'}; display: flex; align-items: center; justify-content: center; margin: 0 auto 5px; font-weight: bold;">2</div>
          <span style="font-size: 12px; color: ${status !== 'NEGADO' ? '#22c55e' : '#9ca3af'};">Análise</span>
        </div>
        <div style="flex: 1; height: 2px; background-color: ${status === 'APROVADO' ? '#22c55e' : '#e5e7eb'}; margin: 0 10px;"></div>
        <div style="text-align: center; flex: 1;">
          <div style="width: 30px; height: 30px; border-radius: 50%; background-color: ${status === 'APROVADO' ? '#22c55e' : '#e5e7eb'}; color: ${status === 'APROVADO' ? 'white' : '#9ca3af'}; display: flex; align-items: center; justify-content: center; margin: 0 auto 5px; font-weight: bold;">3</div>
          <span style="font-size: 12px; color: ${status === 'APROVADO' ? '#22c55e' : '#9ca3af'};">Aprovação</span>
        </div>
      </div>
    </div>
  );
};

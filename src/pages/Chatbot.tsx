
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import MobileLayout from '@/components/MobileLayout';

const Chatbot = () => {
  const navigate = useNavigate();

  return (
    <MobileLayout>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Ajuda e Suporte</h1>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-semibold">Central de Ajuda</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Use o botão flutuante da Zoe no canto inferior direito para obter ajuda instantânea ou suporte especializado.
          </p>
          
          <div className="space-y-3">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h3 className="font-medium text-blue-900 dark:text-blue-100">💬 Ajuda Geral</h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Perguntas sobre como usar o app, fazer transferências, PIX, pagamentos, etc.
              </p>
            </div>
            
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <h3 className="font-medium text-red-900 dark:text-red-100">🚨 Suporte Técnico</h3>
              <p className="text-sm text-red-700 dark:text-red-300">
                Problemas técnicos que precisam ser resolvidos por nossa equipe especializada.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default Chatbot;


import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink, MessageCircle, Mail, FileText } from 'lucide-react';

const Ajuda = () => {
  const handleWhatsAppSupport = () => {
    window.open('https://wa.me/5511999999999', '_blank');
  };

  const handleEmailOuvidoria = () => {
    window.open('mailto:ouvidoria@bancopro.com.br', '_blank');
  };

  const handlePrivacyPolicy = () => {
    window.open('https://bancopro.com.br/privacidade', '_blank');
  };

  const helpItems = [
    {
      icon: MessageCircle,
      title: 'Falar com suporte',
      description: 'Entre em contato via WhatsApp para suporte imediato',
      action: handleWhatsAppSupport,
      buttonText: 'Abrir WhatsApp'
    },
    {
      icon: Mail,
      title: 'Ouvidoria',
      description: 'Para reclamações e sugestões',
      action: handleEmailOuvidoria,
      buttonText: 'Enviar e-mail'
    },
    {
      icon: FileText,
      title: 'Política de privacidade',
      description: 'Saiba como protegemos seus dados',
      action: handlePrivacyPolicy,
      buttonText: 'Acessar política'
    }
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-[#1F1F1F] mb-6">Ajuda e Suporte</h1>
        
        <div className="space-y-6">
          {helpItems.map((item, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start space-x-4">
                <div className="bg-[#D4E4FF] p-3 rounded-lg">
                  <item.icon className="w-6 h-6 text-[#0057FF]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#1F1F1F] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {item.description}
                  </p>
                  <Button
                    onClick={item.action}
                    className="bg-[#0057FF] hover:bg-[#0047CC] text-white"
                  >
                    {item.buttonText}
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Informações da versão */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            Banco Pro - Versão 1.0.0
          </p>
          <p className="text-xs text-gray-400 mt-1">
            © 2024 Banco Pro. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Ajuda;

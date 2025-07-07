
import React from 'react';
import { ArrowLeft, User, Shield, Bell, CreditCard, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Configuracoes = () => {
  const navigate = useNavigate();

  const configOptions = [
    {
      icon: User,
      title: 'Perfil',
      description: 'Editar informações pessoais',
      action: () => navigate('/perfil')
    },
    {
      icon: Shield,
      title: 'Segurança',
      description: 'Alterar senha e configurações de segurança',
      action: () => console.log('Segurança')
    },
    {
      icon: Bell,
      title: 'Notificações',
      description: 'Gerenciar alertas e notificações',
      action: () => console.log('Notificações')
    },
    {
      icon: CreditCard,
      title: 'Cartões',
      description: 'Gerenciar cartões de crédito e débito',
      action: () => navigate('/cartoes')
    },
    {
      icon: HelpCircle,
      title: 'Ajuda',
      description: 'Central de ajuda e suporte',
      action: () => navigate('/ajuda')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-blue-900 p-4 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/home')}
            className="text-[#0057FF] hover:bg-blue-100"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-[#0057FF]">Configurações</h1>
            <p className="text-muted-foreground">Gerencie suas preferências e configurações</p>
          </div>
        </div>

        {/* Opções de Configuração */}
        <div className="grid gap-4 md:grid-cols-2">
          {configOptions.map((option, index) => {
            const IconComponent = option.icon;
            return (
              <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={option.action}>
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <IconComponent className="h-6 w-6 text-[#0057FF]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{option.title}</h3>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Configuracoes;

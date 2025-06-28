
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const Configuracoes = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    pushNotifications: true,
    lowBalanceAlert: false,
    emailNewsletter: true
  });

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    toast.success('Configuração atualizada com sucesso!');
  };

  const handleChangePassword = () => {
    toast.info('Funcionalidade em desenvolvimento');
  };

  const handleChangePin = () => {
    toast.info('Funcionalidade em desenvolvimento');
  };

  const handleLogout = () => {
    // Limpar token/dados de sessão
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logout realizado com sucesso!');
    navigate('/');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-[#1F1F1F] mb-6">Configurações</h1>
        
        {/* Configurações com switches */}
        <div className="space-y-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="push-notifications" className="text-[#1F1F1F] font-medium">
                Receber notificações push
              </Label>
              <p className="text-sm text-gray-500">
                Receba alertas sobre transações e atividades da conta
              </p>
            </div>
            <Switch
              id="push-notifications"
              checked={settings.pushNotifications}
              onCheckedChange={(value) => handleSettingChange('pushNotifications', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="low-balance" className="text-[#1F1F1F] font-medium">
                Alertas de saldo baixo
              </Label>
              <p className="text-sm text-gray-500">
                Seja notificado quando seu saldo estiver baixo
              </p>
            </div>
            <Switch
              id="low-balance"
              checked={settings.lowBalanceAlert}
              onCheckedChange={(value) => handleSettingChange('lowBalanceAlert', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-newsletter" className="text-[#1F1F1F] font-medium">
                Enviar boletins por e-mail
              </Label>
              <p className="text-sm text-gray-500">
                Receba informações sobre produtos e serviços
              </p>
            </div>
            <Switch
              id="email-newsletter"
              checked={settings.emailNewsletter}
              onCheckedChange={(value) => handleSettingChange('emailNewsletter', value)}
            />
          </div>
        </div>

        {/* Botões de ação */}
        <div className="space-y-3">
          <Button
            onClick={handleChangePassword}
            variant="outline"
            className="w-full justify-start text-[#1F1F1F] border-gray-300"
          >
            Alterar senha
          </Button>

          <Button
            onClick={handleChangePin}
            variant="outline"
            className="w-full justify-start text-[#1F1F1F] border-gray-300"
          >
            Alterar PIN
          </Button>

          <Button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium"
          >
            Sair da conta
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Configuracoes;

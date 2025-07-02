
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Settings, Bell, Shield, Mail } from 'lucide-react';

const AdminConfiguracoes = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Configurações do Sistema</h1>
        <Button>Salvar Alterações</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configurações Gerais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nome da Empresa</label>
              <Input defaultValue="Banco Pro" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email de Contato</label>
              <Input defaultValue="contato@bancopro.com" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Telefone</label>
              <Input defaultValue="(11) 99999-9999" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notificações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Email de transações</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span>Alertas de segurança</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span>Relatórios automáticos</span>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Segurança
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Autenticação de dois fatores</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span>Logs de acesso</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span>Timeout de sessão</span>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Servidor SMTP</label>
              <Input placeholder="smtp.gmail.com" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Porta</label>
              <Input placeholder="587" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Usuário</label>
              <Input placeholder="usuario@gmail.com" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminConfiguracoes;

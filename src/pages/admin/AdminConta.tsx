
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, CreditCard, Calendar, Settings } from 'lucide-react';

const AdminConta = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Conta / Faturamento</h1>
        <Button>Gerenciar Plano</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informações da Conta
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Empresa</label>
              <p className="text-lg">Banco Pro Ltda</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Plano Atual</label>
              <p className="text-lg font-semibold text-blue-600">Premium</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Usuários</label>
              <p className="text-lg">1,234 / 5,000</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Faturamento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Próximo Vencimento</label>
              <p className="text-lg">15/02/2024</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Valor Mensal</label>
              <p className="text-lg font-semibold text-green-600">R$ 299,90</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Status</label>
              <p className="text-lg text-green-600">Ativo</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Histórico de Faturas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Faturas e Pagamentos</h3>
            <p className="text-gray-500">Histórico completo de faturamento e pagamentos realizados.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminConta;


import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const AccountBalance = () => {
  const [showBalance, setShowBalance] = React.useState(true);

  return (
    <Card className="bg-gradient-to-r from-blue-600 to-cyan-500 border-none text-white">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Conta Corrente</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowBalance(!showBalance)}
            className="text-white hover:bg-white/20"
          >
            {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-blue-100 text-sm">Saldo disponível</p>
            <p className="text-3xl font-bold">
              {showBalance ? 'R$ 12.458,90' : '••••••'}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-blue-100 text-sm">Limite disponível</p>
              <p className="text-lg font-semibold">
                {showBalance ? 'R$ 5.000,00' : '••••••'}
              </p>
            </div>
            <div>
              <p className="text-blue-100 text-sm">Rendimento do mês</p>
              <p className="text-lg font-semibold text-green-300">
                {showBalance ? '+ R$ 124,50' : '••••••'}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

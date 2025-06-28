
import React from 'react';
import { Send, Smartphone, QrCode, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const QuickActions = () => {
  const actions = [
    { icon: Send, label: 'Transferir', color: 'from-blue-500 to-blue-600' },
    { icon: Smartphone, label: 'Pagar', color: 'from-cyan-500 to-cyan-600' },
    { icon: QrCode, label: 'QR Code', color: 'from-blue-400 to-cyan-500' },
    { icon: CreditCard, label: 'Cartão', color: 'from-slate-500 to-slate-600' },
  ];

  return (
    <Card className="bg-slate-800/50 backdrop-blur border-blue-500/20">
      <CardHeader>
        <CardTitle className="text-white">Ações Rápidas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="ghost"
              className={`h-20 flex-col space-y-2 bg-gradient-to-r ${action.color} hover:opacity-90 text-white border-none`}
            >
              <action.icon className="h-6 w-6" />
              <span className="text-sm">{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

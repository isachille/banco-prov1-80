
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, QrCode, CreditCard, Receipt } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RecargaCelularButton } from './RecargaCelularButton';

export const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    { 
      icon: Send, 
      label: 'Transferir', 
      color: 'from-blue-500 to-blue-600',
      path: '/transferir'
    },
    { 
      icon: QrCode, 
      label: 'PIX', 
      color: 'from-green-500 to-green-600',
      path: '/pix'
    },
    { 
      icon: Receipt, 
      label: 'Pagar', 
      color: 'from-orange-500 to-orange-600',
      path: '/pagar'
    },
    { 
      icon: CreditCard, 
      label: 'Cartões', 
      color: 'from-purple-500 to-purple-600',
      path: '/cartoes'
    },
  ];

  return (
    <Card className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-gray-900 dark:text-white">Ações Rápidas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={() => navigate(action.path)}
              className={`h-20 flex flex-col items-center justify-center space-y-2 bg-gradient-to-r ${action.color} hover:opacity-90 text-white rounded-xl transition-all duration-200 hover:scale-105`}
            >
              <action.icon className="h-6 w-6" />
              <span className="text-sm font-medium">{action.label}</span>
            </button>
          ))}
        </div>
        <div className="mt-3">
          <RecargaCelularButton />
        </div>
      </CardContent>
    </Card>
  );
};

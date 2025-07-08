
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Send, QrCode, CreditCard, Receipt, PiggyBank, TrendingUp, 
  Coins, Users, HelpCircle, Phone, Banknote, Shield
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
    { 
      icon: PiggyBank, 
      label: 'Cofrinho', 
      color: 'from-pink-500 to-pink-600',
      path: '/cofrinho'
    },
    { 
      icon: TrendingUp, 
      label: 'Investir', 
      color: 'from-emerald-500 to-emerald-600',
      path: '/investimentos'
    },
    { 
      icon: Phone, 
      label: 'Recarga', 
      color: 'from-indigo-500 to-indigo-600',
      path: '/recarga'
    },
    { 
      icon: Coins, 
      label: 'Cripto', 
      color: 'from-yellow-500 to-yellow-600',
      path: '/cripto'
    },
    { 
      icon: Users, 
      label: 'Consórcio', 
      color: 'from-cyan-500 to-cyan-600',
      path: '/consorcio'
    },
    { 
      icon: Banknote, 
      label: 'Empréstimo', 
      color: 'from-red-500 to-red-600',
      path: '/emprestimo'
    },
    { 
      icon: Shield, 
      label: 'Seguros', 
      color: 'from-slate-500 to-slate-600',
      path: '/seguros'
    },
    { 
      icon: HelpCircle, 
      label: 'Ajuda', 
      color: 'from-teal-500 to-teal-600',
      path: '/chatbot'
    },
  ];

  return (
    <Card className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 mx-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-gray-900 dark:text-white">Ações Rápidas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto pb-2">
          <div className="flex space-x-3 min-w-max">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={() => navigate(action.path)}
                className={`flex-shrink-0 w-20 h-20 flex flex-col items-center justify-center space-y-1 bg-gradient-to-r ${action.color} hover:opacity-90 text-white rounded-xl transition-all duration-200 hover:scale-105`}
              >
                <action.icon className="h-5 w-5" />
                <span className="text-xs font-medium text-center leading-tight">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};



import React from 'react';
import { ArrowUpRight, ArrowDownLeft, Smartphone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const RecentTransactions = () => {
  const transactions = [
    {
      id: 1,
      type: 'sent',
      description: 'Transferência PIX',
      recipient: 'João Silva',
      amount: -250.00,
      date: 'Hoje, 14:30',
      icon: ArrowUpRight
    },
    {
      id: 2,
      type: 'received',
      description: 'PIX Recebido',
      recipient: 'Maria Santos',
      amount: 180.50,
      date: 'Hoje, 10:15',
      icon: ArrowDownLeft
    },
    {
      id: 3,
      type: 'payment',
      description: 'Pagamento',
      recipient: 'Conta de Luz',
      amount: -89.90,
      date: 'Ontem, 16:45',
      icon: Smartphone
    }
  ];

  return (
    <Card className="bg-slate-800/50 backdrop-blur border-blue-500/20">
      <CardHeader>
        <CardTitle className="text-white">Transações Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${
                  transaction.type === 'received' 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-blue-500/20 text-blue-400'
                }`}>
                  <transaction.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{transaction.description}</p>
                  <p className="text-gray-400 text-xs">{transaction.recipient}</p>
                  <p className="text-gray-500 text-xs">{transaction.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${
                  transaction.amount > 0 ? 'text-green-400' : 'text-white'
                }`}>
                  {transaction.amount > 0 ? '+' : ''}R$ {Math.abs(transaction.amount).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowDownLeft, ArrowUpRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ExtratoPix = () => {
  const navigate = useNavigate();
  
  // Simulação de transações PIX
  const transactions = [
    {
      id: '1',
      type: 'sent',
      description: 'PIX enviado',
      recipient: 'João Silva',
      amount: 150.00,
      date: '2024-01-08',
      time: '14:30',
      key: 'joao@email.com'
    },
    {
      id: '2',
      type: 'received',
      description: 'PIX recebido',
      sender: 'Maria Santos',
      amount: 200.00,
      date: '2024-01-07',
      time: '09:15',
      key: '+55 11 99999-9999'
    },
    {
      id: '3',
      type: 'sent',
      description: 'PIX enviado',
      recipient: 'Loja Virtual',
      amount: 89.90,
      date: '2024-01-06',
      time: '16:45',
      key: '12.345.678/0001-90'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-[#001B3A] to-[#003F5C] text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/pix')}
              className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Extrato PIX</h1>
              <p className="text-blue-100">Histórico de transações PIX</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6 max-w-md space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Transações Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.type === 'sent' ? 'bg-red-100' : 'bg-green-100'
                    }`}>
                      {transaction.type === 'sent' ? (
                        <ArrowUpRight className={`w-5 h-5 text-red-600`} />
                      ) : (
                        <ArrowDownLeft className={`w-5 h-5 text-green-600`} />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {transaction.type === 'sent' 
                          ? transaction.recipient 
                          : transaction.sender
                        }
                      </p>
                      <p className="text-xs text-gray-500">{transaction.key}</p>
                      <p className="text-xs text-gray-400">
                        {transaction.date} às {transaction.time}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${
                      transaction.type === 'sent' ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {transaction.type === 'sent' ? '-' : '+'}R$ {transaction.amount.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExtratoPix;
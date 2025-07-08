
import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

export const AccountBalance = () => {
  const [showBalance, setShowBalance] = useState(true);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const fetchBalance = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: walletData } = await supabase
          .from('wallets')
          .select('saldo')
          .eq('user_id', user.id)
          .single();

        if (walletData) {
          setBalance(walletData.saldo || 0);
        }
      }
    };

    fetchBalance();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <Card className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 mx-4">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <span className="text-gray-900 dark:text-white">Conta Corrente</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowBalance(!showBalance)}
            className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Saldo disponível</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {showBalance ? formatCurrency(balance) : '••••••'}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Limite disponível</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {showBalance ? 'R$ 0,00' : '••••••'}
              </p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Rendimento do mês</p>
              <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                {showBalance ? 'R$ 0,00' : '••••••'}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};


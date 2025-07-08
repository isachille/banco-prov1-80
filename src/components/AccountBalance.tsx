
import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Settings, Moon, Sun } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export const AccountBalance = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showBalance, setShowBalance] = useState(true);
  const [balance, setBalance] = useState(0);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: userData } = await supabase
          .from('users')
          .select('nome_completo')
          .eq('id', user.id)
          .single();
        
        if (userData) {
          const firstName = userData.nome_completo?.split(' ')[0] || 'Usuário';
          setUserName(firstName);
        }

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

    fetchUserData();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <Card className="bg-gradient-to-r from-[#0047AB] to-[#1E5BA8] border-none text-white">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/4712549c-a705-4aad-8498-4702dc3cdd8f.png" 
              alt="Banco Pro" 
              className="h-8 w-auto"
            />
            <div>
              <p className="text-sm opacity-90">Olá,</p>
              <h2 className="text-lg font-bold">{userName}</h2>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-white hover:bg-white/20"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/configuracoes')}
              className="text-white hover:bg-white/20"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <CardTitle className="flex items-center justify-between mt-4">
          <span className="text-lg">Conta Corrente</span>
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
              {showBalance ? formatCurrency(balance) : '••••••'}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-blue-100 text-sm">Limite disponível</p>
              <p className="text-lg font-semibold">
                {showBalance ? 'R$ 0,00' : '••••••'}
              </p>
            </div>
            <div>
              <p className="text-blue-100 text-sm">Rendimento do mês</p>
              <p className="text-lg font-semibold text-green-300">
                {showBalance ? 'R$ 0,00' : '••••••'}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

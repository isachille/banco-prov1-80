
import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Settings, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const BankingHeader = () => {
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
    <header className="fixed top-0 left-0 right-0 bg-gradient-to-r from-[#6B46C1] to-[#8B5CF6] text-white p-4 z-50 shadow-lg">
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
      
      <div className="mt-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">Saldo Disponível</p>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold">
                {showBalance ? formatCurrency(balance) : '••••••'}
              </span>
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="text-white/80 hover:text-white"
              >
                {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs opacity-75">Rendimento</p>
            <p className="text-sm font-medium text-green-300">+R$ 0,00 este mês</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default BankingHeader;

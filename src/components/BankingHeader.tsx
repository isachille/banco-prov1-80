
import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Settings, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const BankingHeader = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
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
      }
    };

    fetchUserData();
  }, []);

  return (
    <header className="bg-gradient-to-r from-[#0047AB] to-[#1E5BA8] text-white p-4 rounded-2xl mx-4 mt-4 shadow-sm">
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
    </header>
  );
};

export default BankingHeader;


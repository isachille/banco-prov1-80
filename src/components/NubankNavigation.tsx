
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, Send, Gift, PiggyBank, FileText, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

const NubankNavigation = () => {
  const navigate = useNavigate();

  // Fetch user data to check role for admin panel visibility
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      return { ...user, role: userData?.role };
    }
  });

  const menuItems = [
    {
      titulo: "Carteira",
      icone: Wallet,
      acao: () => navigate('/dashboard'),
      tela: "carteira"
    },
    {
      titulo: "Pix",
      icone: Send,
      acao: () => navigate('/pix'),
      tela: "pix"
    },
    {
      titulo: "Gift Card",
      icone: Gift,
      acao: () => navigate('/gift-cards-page'),
      tela: "giftcard"
    },
    {
      titulo: "Cofrinho",
      icone: PiggyBank,
      acao: () => navigate('/cofrinho'),
      tela: "cofrinho"
    },
    {
      titulo: "Financiamento",
      icone: FileText,
      acao: () => navigate('/financing-page'),
      tela: "financiamento"
    }
  ];

  // Add admin panel if user is 'dono' or 'admin'
  if (user?.role && ['dono', 'admin'].includes(user.role)) {
    menuItems.push({
      titulo: "Painel Admin",
      icone: Shield,
      acao: () => navigate('/admin/dashboard'),
      tela: "painel_adm"
    });
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50 shadow-lg">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {menuItems.map((item, index) => {
          const IconComponent = item.icone;
          return (
            <button
              key={index}
              onClick={item.acao}
              className="flex flex-col items-center space-y-1 px-2 py-1 rounded-lg transition-colors hover:bg-purple-50 active:bg-purple-100"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg flex items-center justify-center">
                <IconComponent className="h-4 w-4 text-white" />
              </div>
              <span className="text-xs font-medium text-gray-700">{item.titulo}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default NubankNavigation;


import React from 'react';
import { Home, CreditCard, Send, Smartphone, TrendingUp, Settings, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const BankingSidebar = () => {
  const menuItems = [
    { icon: Home, label: 'Início', active: true },
    { icon: CreditCard, label: 'Cartões' },
    { icon: Send, label: 'Transferir' },
    { icon: Smartphone, label: 'Pagar' },
    { icon: TrendingUp, label: 'Investir' },
    { icon: Settings, label: 'Configurações' },
    { icon: HelpCircle, label: 'Ajuda' },
  ];

  return (
    <aside className="w-64 bg-slate-900/30 backdrop-blur-sm border-r border-blue-500/20 min-h-screen">
      <nav className="p-4 space-y-2">
        {menuItems.map((item, index) => (
          <Button
            key={index}
            variant="ghost"
            className={`w-full justify-start text-left ${
              item.active 
                ? 'bg-blue-500/20 text-blue-300 border-l-4 border-blue-400' 
                : 'text-gray-300 hover:bg-blue-500/10 hover:text-blue-200'
            }`}
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.label}
          </Button>
        ))}
      </nav>
    </aside>
  );
};

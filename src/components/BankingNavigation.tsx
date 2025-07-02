
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, Receipt, Send, CreditCard, 
  Car, Gift, PiggyBank, TrendingUp, Settings 
} from 'lucide-react';

const BankingNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Send, label: 'PIX', path: '/pix' },
    { icon: CreditCard, label: 'Transferências', path: '/transferencias' },
    { icon: Receipt, label: 'Extrato', path: '/extrato-page' },
    { icon: Car, label: 'Financiamento', path: '/financing-page' },
    { icon: Gift, label: 'Gift Cards', path: '/gift-cards-page' },
    { icon: PiggyBank, label: 'Cofrinho', path: '/cofrinho' },
    { icon: TrendingUp, label: 'Investimentos', path: '/investimentos' },
    { icon: Settings, label: 'Configurações', path: '/configuracoes' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navigationItems.slice(0, 5).map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center space-y-1 px-2 py-1 rounded-lg transition-colors ${
                isActive 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BankingNavigation;

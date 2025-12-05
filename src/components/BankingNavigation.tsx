
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, Receipt, Send, CreditCard, 
  Car, Gift, PiggyBank, TrendingUp, Settings, Bitcoin, FileText
} from 'lucide-react';

const BankingNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { icon: Home, label: 'Home', path: '/home' },
    { icon: Send, label: 'PIX', path: '/pix' },
    { icon: FileText, label: 'Fichas', path: '/fichas-admin' },
    { icon: CreditCard, label: 'Transferências', path: '/transferencias' },
    { icon: Gift, label: 'Gift Cards', path: '/gift-cards-page' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navigationItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center space-y-1 px-2 py-1 rounded-lg transition-colors ${
                isActive 
                  ? 'text-purple-600 bg-purple-50' 
                  : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
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

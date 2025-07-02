
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Send, FileText, Settings } from 'lucide-react';

const MobileNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/home' },
    { icon: Send, label: 'Pix', path: '/pix' },
    { icon: FileText, label: 'Extrato', path: '/extrato' },
    { icon: Settings, label: 'Config', path: '/configuracoes' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-gray-700 z-50">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center justify-center p-3 rounded-lg transition-colors ${
              isActive(item.path)
                ? 'text-[#0047AB] bg-blue-50 dark:bg-blue-900/20'
                : 'text-gray-500 dark:text-gray-400 hover:text-[#0047AB]'
            }`}
          >
            <item.icon className="h-6 w-6 mb-1" />
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobileNavigation;

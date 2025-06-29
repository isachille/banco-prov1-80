
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, CreditCard, ArrowRight, Smartphone, TrendingUp, Settings, HelpCircle, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const menuItems = [
    { id: 'home', label: 'Início', icon: Home, path: '/home' },
    { id: 'cartoes', label: 'Cartões', icon: CreditCard, path: '/cartoes' },
    { id: 'transferir', label: 'Transferir', icon: ArrowRight, path: '/transferir' },
    { id: 'pagar', label: 'Pagar', icon: Smartphone, path: '/pagar' },
    { id: 'investir', label: 'Investir', icon: TrendingUp, path: '/investir' },
    { id: 'configuracoes', label: 'Configurações', icon: Settings, path: '/configuracoes' },
    { id: 'ajuda', label: 'Ajuda', icon: HelpCircle, path: '/ajuda' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="w-[220px] bg-hsl(var(--banking-sidebar)) min-h-screen fixed left-0 top-0 flex flex-col transition-colors duration-300">
      {/* Logo */}
      <div className="p-4 border-b border-blue-700/30">
        <div className="flex items-center space-x-3">
          <img 
            src="/lovable-uploads/4712549c-a705-4aad-8498-4702dc3cdd8f.png" 
            alt="Banco Pro" 
            className="h-8 w-auto"
          />
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 py-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavigation(item.path)}
            className={`w-full flex items-center space-x-3 px-4 py-3 mx-2 rounded-lg transition-colors ${
              isActive(item.path)
                ? 'bg-blue-600 text-white'
                : 'text-[#B0C4DE] hover:bg-blue-700/30 hover:text-white'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Theme Toggle */}
      <div className="p-4 border-t border-blue-700/30">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className="w-full flex items-center space-x-3 text-[#B0C4DE] hover:bg-blue-700/30 hover:text-white"
        >
          {theme === 'light' ? (
            <>
              <Moon className="w-5 h-5" />
              <span className="font-medium">Modo Escuro</span>
            </>
          ) : (
            <>
              <Sun className="w-5 h-5" />
              <span className="font-medium">Modo Claro</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;

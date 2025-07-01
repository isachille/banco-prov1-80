
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, CreditCard, ArrowRight, Smartphone, TrendingUp, 
  Settings, HelpCircle, Sun, Moon, FileText, Building2 
} from 'lucide-react';
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
    { id: 'extrato', label: 'Extrato', icon: FileText, path: '/extrato' },
    { id: 'perfil', label: 'Perfil', icon: Building2, path: '/perfil' },
    { id: 'configuracoes', label: 'Configurações', icon: Settings, path: '/configuracoes' },
    { id: 'ajuda', label: 'Ajuda', icon: HelpCircle, path: '/ajuda' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="w-[220px] bg-white dark:bg-slate-900 min-h-screen fixed left-0 top-16 flex flex-col border-r border-blue-200 dark:border-blue-800 shadow-sm">
      {/* Menu Items */}
      <nav className="flex-1 py-6 px-3">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive(item.path)
                  ? 'bg-[#0057FF] text-white shadow-lg'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-[#0057FF]'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Theme Toggle */}
      <div className="p-3 border-t border-blue-200 dark:border-blue-800">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className="w-full flex items-center space-x-3 text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/30"
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

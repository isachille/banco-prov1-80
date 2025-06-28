
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, CreditCard, ArrowRight, Smartphone, TrendingUp, Settings, HelpCircle } from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

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
    <div className="w-[220px] bg-[#061A44] min-h-screen fixed left-0 top-0 flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-blue-700/30">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">🏦</span>
          <span className="text-white font-bold text-lg">Banco Pro</span>
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
    </div>
  );
};

export default Sidebar;

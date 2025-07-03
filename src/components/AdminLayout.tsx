
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, FileText, Send, ArrowRight, CreditCard, 
  Users, Upload, Receipt, TrendingUp, Settings, 
  Menu, X, Home, UserCheck, Shield
} from 'lucide-react';
import BankingHeader from './BankingHeader';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const adminMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, path: '/admin/dashboard' },
    { id: 'usuarios', label: 'Gerenciar Usuários', icon: UserCheck, path: '/admin/users' },
    { id: 'contas-ativas', label: 'Contas Ativas', icon: Users, path: '/admin/contas-ativas' },
    { id: 'extrato', label: 'Extrato', icon: FileText, path: '/admin/extrato' },
    { id: 'pix', label: 'PIX Admin', icon: Send, path: '/admin/pix' },
    { id: 'transferencias', label: 'Transferências', icon: ArrowRight, path: '/admin/transferencias' },
    { id: 'pagamentos', label: 'Pagamentos', icon: CreditCard, path: '/admin/pagamentos' },
    { id: 'cobrancas', label: 'Cobranças', icon: Receipt, path: '/admin/cobrancas' },
    { id: 'arquivos', label: 'Arquivos', icon: Upload, path: '/admin/arquivos' },
    { id: 'relatorios', label: 'Relatórios', icon: FileText, path: '/admin/relatorios' },
    { id: 'configuracoes', label: 'Configurações', icon: Settings, path: '/admin/configuracoes' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <BankingHeader />
      
      {/* Mobile Menu Button */}
      <div className="fixed top-16 left-4 z-50 md:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-white dark:bg-slate-800"
        >
          {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      <div className="flex pt-16">
        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0 pt-16`}>
          <div className="p-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/home')}
              className="w-full justify-start mb-4 text-[#0047AB] hover:bg-blue-50"
            >
              <Home className="h-4 w-4 mr-2" />
              Voltar ao App
            </Button>
            
            <nav className="space-y-1">
              {adminMenuItems.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                  className={`w-full justify-start ${
                    isActive(item.path)
                      ? 'bg-[#0047AB] text-white hover:bg-[#0047AB]/90'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <item.icon className="h-4 w-4 mr-3" />
                  {item.label}
                </Button>
              ))}
            </nav>
          </div>
        </div>

        {/* Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 md:ml-0">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

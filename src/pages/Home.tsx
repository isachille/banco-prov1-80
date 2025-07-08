
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useUserStatus } from '@/hooks/useUserStatus';
import MobileLayout from '@/components/MobileLayout';
import { BankingDashboard } from '@/components/BankingDashboard';
import { Button } from "@/components/ui/button";
import { Shield } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [nomeUsuario, setNomeUsuario] = useState<string | null>(null);
  const { status, loading, userData } = useUserStatus(null);

  useEffect(() => {
    const fetchUserName = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setNomeUsuario(user.email);
      }
    };

    fetchUserName();
  }, []);

  // Verificar se o usuário tem permissão de admin
  const isAdminUser = userData?.role && ['admin', 'dono', 'gerente', 'analista'].includes(userData.role);

  return (
    <MobileLayout>
      <div className="space-y-6">
        {/* Admin Panel Button - Only for privileged users */}
        {isAdminUser && (
          <div className="flex justify-center mb-4">
            <Button 
              variant="outline" 
              className="w-full bg-gradient-to-r from-[#0047AB] to-[#1E5BA8] text-white border-none hover:from-[#003580] hover:to-[#1A4F96]"
              onClick={() => navigate('/painel-admin')}
            >
              <Shield className="mr-2 h-4 w-4" />
              Painel Admin
            </Button>
          </div>
        )}

        {/* Status Card */}
        {loading ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/2 mb-2"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-3/4"></div>
            </div>
          </div>
        ) : status ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Status da Conta</h3>
            {status === 'pendente' && (
              <p className="text-yellow-600 dark:text-yellow-400">Sua conta está pendente de aprovação.</p>
            )}
            {status === 'analise' && (
              <p className="text-blue-600 dark:text-blue-400">Sua conta está em análise.</p>
            )}
            {status === 'ativo' && (
              <p className="text-green-600 dark:text-green-400">Sua conta está ativa!</p>
            )}
            {status === 'recusado' && (
              <p className="text-red-600 dark:text-red-400">Sua conta foi recusada.</p>
            )}
          </div>
        ) : null}

        {/* Banking Dashboard with all features */}
        <BankingDashboard />
      </div>
    </MobileLayout>
  );
};

export default Home;

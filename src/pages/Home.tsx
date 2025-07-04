
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useUserStatus } from '@/hooks/useUserStatus';
import Layout from '@/components/Layout';
import { BankingDashboard } from '@/components/BankingDashboard';
import { Button } from "@/components/ui/button";
import { Shield } from 'lucide-react';
import { toast } from 'sonner';

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

  const isAdminUser = userData?.role && ['admin', 'dono', 'gerente', 'analista'].includes(userData.role);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Admin Panel Button - Only for privileged users */}
        {isAdminUser && (
          <div className="flex justify-center mb-4">
            <Button 
              variant="outline" 
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white border-none hover:from-purple-700 hover:to-blue-700"
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
    </Layout>
  );
};

export default Home;

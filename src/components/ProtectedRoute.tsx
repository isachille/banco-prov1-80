
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireActive?: boolean;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireActive = true,
  adminOnly = false
}) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/login');
        return;
      }

      setUser(session.user);

      // Verificar se é rota admin
      if (adminOnly) {
        const { data: userData, error } = await supabase
          .from('users')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();

        if (error || !userData?.is_admin) {
          console.error('Acesso negado - não é admin:', error);
          navigate('/login');
          return;
        }
      }

      if (requireActive && !adminOnly) {
        // Verificar status do usuário
        const { data: userData, error } = await supabase
          .from('users')
          .select('status')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Erro ao verificar status:', error);
          navigate('/login');
          return;
        }

        // Redirecionar baseado no status
        switch (userData.status) {
          case 'pendente':
            navigate('/aguardando-aprovacao');
            return;
          case 'recusado':
            navigate('/conta-recusada');
            return;
          case 'ativo':
            // Continuar normalmente
            break;
          default:
            navigate('/aguardando-aprovacao');
            return;
        }
      }

      setLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          navigate('/login');
        } else {
          setUser(session.user);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate, requireActive, adminOnly]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#0057FF]"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;

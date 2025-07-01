
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireActive?: boolean;
  adminOnly?: boolean;
  allowPendingForAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireActive = true,
  adminOnly = false,
  allowPendingForAdmin = false
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

      try {
        // Buscar dados do usuário na tabela users
        const { data: userData, error } = await supabase
          .from('users')
          .select('status, is_admin, role')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Erro ao verificar dados do usuário:', error);
          navigate('/login');
          return;
        }

        console.log('Dados do usuário na proteção:', userData);

        // Verificar se é rota admin
        if (adminOnly) {
          const isAdmin = userData?.is_admin || 
                         userData?.role === 'admin' || 
                         userData?.role === 'gerente' || 
                         userData?.role === 'dono';
          
          if (!isAdmin) {
            console.error('Acesso negado - não é admin');
            navigate('/login');
            return;
          }

          // Para admins, permitir acesso mesmo com status pendente se allowPendingForAdmin for true
          if (!allowPendingForAdmin && userData.status !== 'ativo') {
            navigate('/aguardando-aprovacao');
            return;
          }
        }

        // Para usuários normais, verificar status
        if (requireActive && !adminOnly) {
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

      } catch (error) {
        console.error('Erro na verificação de autenticação:', error);
        navigate('/login');
      }
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
  }, [navigate, requireActive, adminOnly, allowPendingForAdmin]);

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

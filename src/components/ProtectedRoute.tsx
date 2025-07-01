
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
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log('Nenhuma sessão encontrada, redirecionando para login');
          navigate('/login');
          return;
        }

        console.log('Sessão encontrada:', session.user.id);
        setUser(session.user);

        // Verificar se o email foi confirmado
        if (!session.user.email_confirmed_at) {
          console.log('Email não confirmado, redirecionando para confirme-email');
          navigate('/confirme-email');
          return;
        }

        // Buscar dados do usuário na tabela users
        const { data: userData, error } = await supabase
          .from('users')
          .select('status, is_admin, role')
          .eq('id', session.user.id)
          .maybeSingle();

        if (error) {
          console.error('Erro ao verificar dados do usuário:', error);
          navigate('/login');
          return;
        }

        // Se não encontrou o usuário, o trigger ainda não rodou
        if (!userData) {
          console.log('Usuário não encontrado na tabela users, redirecionando para confirme-email');
          navigate('/confirme-email');
          return;
        }

        console.log('Dados do usuário na proteção:', userData);

        // Verificar se é rota admin
        if (adminOnly) {
          const isAdmin = userData?.is_admin === true || 
                         userData?.role === 'admin' || 
                         userData?.role === 'gerente' || 
                         userData?.role === 'dono';
          
          console.log('Verificando se é admin:', { 
            isAdmin, 
            is_admin: userData?.is_admin, 
            role: userData?.role 
          });
          
          if (!isAdmin) {
            console.log('Acesso negado - não é admin/gerente/dono');
            navigate('/login');
            return;
          }

          console.log('Acesso autorizado para admin - role:', userData.role);
        }

        // Para usuários normais ou verificações de status
        if (requireActive && !adminOnly) {
          // Usuários dono/admin sempre passam na verificação de status
          const isAdminUser = userData?.is_admin === true || 
                             userData?.role === 'admin' || 
                             userData?.role === 'gerente' || 
                             userData?.role === 'dono';
          
          if (!isAdminUser) {
            switch (userData.status) {
              case 'pendente':
                console.log('Status pendente, redirecionando para /pendente');
                navigate('/pendente');
                return;
              case 'recusado':
                console.log('Status recusado, redirecionando para /recusado');
                navigate('/recusado');
                return;
              case 'ativo':
                console.log('Status ativo, permitindo acesso');
                break;
              default:
                console.log('Status desconhecido, redirecionando para /pendente');
                navigate('/pendente');
                return;
            }
          } else {
            console.log('Usuário admin/dono, ignorando verificação de status');
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
        console.log('Auth state changed:', event, session?.user?.id);
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

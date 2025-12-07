
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
          // No session found, redirect to login
          navigate('/login');
          return;
        }

        // Session found
        setUser(session.user);

        // Verificar se o email foi confirmado
        if (!session.user.email_confirmed_at) {
          // Email not confirmed, redirect to confirmation
          navigate('/confirme-email');
          return;
        }

        // Buscar dados do usuário na tabela users (status only)
        const { data: userData, error } = await supabase
          .from('users')
          .select('status')
          .eq('id', session.user.id)
          .maybeSingle();

        if (error) {
          // Error verifying user data
          navigate('/login');
          return;
        }

        // Check admin roles server-side using has_role RPC
        let hasAdminRole = false;
        try {
          const adminRoles = ['admin', 'dono', 'gerente'] as const;
          for (const role of adminRoles) {
            const { data: roleCheck } = await supabase.rpc('has_role', { 
              _user_id: session.user.id, 
              _role: role 
            });
            if (roleCheck === true) {
              hasAdminRole = true;
              break;
            }
          }
        } catch {
          // Error checking roles - continue with default permissions
        }

        // Se não encontrou o usuário, aguardar processamento dos triggers
        if (!userData) {
          // Aguardar um pouco e tentar novamente
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          const { data: userData2 } = await supabase
            .from('users')
            .select('status')
            .eq('id', session.user.id)
            .maybeSingle();
          
          if (!userData2) {
            navigate('/confirmado');
            return;
          }
        }

        const finalUserData = userData || null;
        // User data loaded for protection check

        // Verificar se é rota admin usando has_role server-side
        if (adminOnly) {
          if (!hasAdminRole) {
            navigate('/home');
            return;
          }
        }

        // Para usuários normais ou verificações de status
        if (requireActive && !adminOnly && finalUserData) {
          // Usuários com roles admin sempre passam na verificação de status
          if (!hasAdminRole) {
            switch (finalUserData.status) {
              case 'pendente':
                navigate('/pendente');
                return;
              case 'recusado':
                navigate('/recusado');
                return;
              case 'ativo':
                break;
              default:
                navigate('/pendente');
                return;
            }
          }
        }

        setLoading(false);

      } catch {
        // Authentication verification error
        navigate('/login');
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // Auth state changed
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

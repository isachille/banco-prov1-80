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
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log('Nenhuma sessão encontrada, redirecionando para login');
          navigate('/login');
          return;
        }

        console.log('Sessão encontrada:', session.user.id);
        setUser(session.user);

        // Buscar dados do usuário na tabela users
        const { data: userData, error } = await supabase
          .from('users')
          .select('status, is_admin, role')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Erro ao verificar dados do usuário:', error);
          // Se não encontrar o usuário, criar um registro básico
          if (error.code === 'PGRST116') {
            const { error: insertError } = await supabase
              .from('users')
              .insert({
                id: session.user.id,
                email: session.user.email || '',
                nome: session.user.user_metadata?.nome || '',
                nome_completo: session.user.user_metadata?.nome_completo || '',
                cpf_cnpj: session.user.user_metadata?.cpf_cnpj || '',
                telefone: session.user.user_metadata?.telefone || '',
                tipo: 'cliente',
                status: 'pendente',
                role: 'usuario' // Usando 'usuario' que deve ser permitido pela constraint
              });
            
            if (!insertError) {
              navigate('/aguardando-aprovacao');
              return;
            }
          }
          navigate('/login');
          return;
        }

        console.log('Dados do usuário na proteção:', userData);
        console.log('AdminOnly:', adminOnly, 'RequireActive:', requireActive);

        // Verificar se é rota admin
        if (adminOnly) {
          const isAdmin = userData?.is_admin === true || 
                         userData?.role === 'admin' || 
                         userData?.role === 'gerente' || 
                         userData?.role === 'dono';
          
          console.log('Verificando se é admin:', { 
            isAdmin, 
            is_admin: userData?.is_admin, 
            role: userData?.role,
            userData 
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
          
          console.log('Verificando status para usuário:', {
            isAdminUser,
            status: userData.status,
            role: userData.role
          });
          
          if (!isAdminUser) {
            switch (userData.status) {
              case 'pendente':
                console.log('Status pendente, redirecionando para aguardando aprovação');
                navigate('/aguardando-aprovacao');
                return;
              case 'recusado':
                console.log('Status recusado, redirecionando para conta recusada');
                navigate('/conta-recusada');
                return;
              case 'ativo':
                console.log('Status ativo, permitindo acesso');
                // Continuar normalmente
                break;
              default:
                console.log('Status desconhecido, redirecionando para aguardando aprovação');
                navigate('/aguardando-aprovacao');
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


import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export type UserStatus = 'pendente' | 'ativo' | 'recusado' | null;

export const useUserStatus = (user: User | null) => {
  const [status, setStatus] = useState<UserStatus>(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    if (!user) {
      setStatus(null);
      setLoading(false);
      return;
    }

    const fetchUserStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Erro ao buscar status do usuário:', error);
          setStatus(null);
        } else {
          setStatus(data.status as UserStatus);
          setUserData(data);
        }
      } catch (error) {
        console.error('Erro ao buscar status do usuário:', error);
        setStatus(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStatus();
  }, [user]);

  return { status, loading, userData };
};

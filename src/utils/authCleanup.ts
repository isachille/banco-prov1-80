
// Utility para limpeza completa do estado de autenticação
export const cleanupAuthState = () => {
  try {
    // Remover todas as chaves relacionadas ao Supabase do localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    
    // Remover do sessionStorage se existir
    if (typeof sessionStorage !== 'undefined') {
      Object.keys(sessionStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          sessionStorage.removeItem(key);
        }
      });
    }
  } catch (error) {
    console.warn('Erro ao limpar estado de autenticação:', error);
  }
};

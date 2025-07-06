
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  loading: true,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoggedIn: !!user, 
        loading 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
</ov-write>

Agora vou corrigir a página Index para remover a referência ao AuthContext que estava faltando:

<lov-write file_path="src/pages/Index.tsx">
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BarChart3, TrendingUp, User } from 'lucide-react';

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header Section */}
      <header className="py-6 px-4">
        <div className="container mx-auto flex justify-between items-center">
          <a href="/" className="text-2xl font-bold text-white">
            <span className="text-purple-500">Pro</span>Bank
          </a>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <a href="#features" className="text-gray-300 hover:text-white transition-colors">
                  Funcionalidades
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">
                  Preços
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-300 hover:text-white transition-colors">
                  Contato
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center">
        <div className="container mx-auto">
          <h1 className="text-5xl font-extrabold text-white mb-6">
            Bem-vindo ao <span className="text-purple-500">Pro</span>Bank
          </h1>
          <p className="text-lg text-gray-300 mb-8">
            A plataforma financeira completa para você e sua empresa.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button 
              size="lg" 
              className="bg-white text-purple-900 hover:bg-gray-100 font-semibold px-8 py-3"
              onClick={() => navigate('/login')}
            >
              Entrar
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-purple-900 font-semibold px-8 py-3"
              onClick={() => navigate('/cadastro-efi')}
            >
              Cadastrar na Efí Bank
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white/5 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-16">
            Integração Completa com Efí Bank
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg bg-white/10 backdrop-blur-sm">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Cadastro Automático</h3>
              <p className="text-gray-300">
                Criação automática de conta na Efí Bank com integração completa via API
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-white/10 backdrop-blur-sm">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Gestão Financeira</h3>
              <p className="text-gray-300">
                Controle total de transações PIX, boletos e TEDs com cálculo automático de lucro
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-white/10 backdrop-blur-sm">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Relatórios Avançados</h3>
              <p className="text-gray-300">
                Dashboards completos com gráficos de lucro mensal e métricas de performance
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="py-6 px-4 text-center text-gray-400">
        <p>&copy; 2024 ProBank. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Smartphone, Banknote, FileText, History } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [saldo, setSaldo] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // Mock user data - em produção viria de contexto/auth
  const userName = "João Silva";
  const userId = "123";
  const token = "mock-token";

  useEffect(() => {
    // Simular chamada da API
    const fetchSaldo = async () => {
      try {
        // Em produção seria: 
        // const response = await fetch(`https://seu-xano.com/api/wallets/user/${userId}`, {
        //   headers: {
        //     'Authorization': `Bearer ${token}`
        //   }
        // });
        // const data = await response.json();
        
        // Mock data por enquanto
        setTimeout(() => {
          setSaldo(5230.80);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Erro ao buscar saldo:', error);
        setLoading(false);
      }
    };

    fetchSaldo();
  }, [userId, token]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleNavigation = (route: string) => {
    navigate(`/${route.toLowerCase()}`);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-inter p-4">
      {/* Container Principal */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
        <h1 className="text-lg font-bold text-[#1F1F1F]">
          Olá, {userName} 👋
        </h1>
      </div>

      {/* Container de Saldo */}
      <div className="bg-[#D4E4FF] rounded-lg p-6 mb-6">
        <h2 className="text-[#1F1F1F] text-sm font-medium mb-2">Saldo atual</h2>
        {loading ? (
          <div className="animate-pulse">
            <div className="h-8 bg-white/30 rounded w-32 mb-2"></div>
          </div>
        ) : (
          <p className="text-[#1F1F1F] text-2xl font-bold mb-3">
            {formatCurrency(saldo)}
          </p>
        )}
        <div className="text-xs text-[#1F1F1F]/60">
          <p>📈 Gráfico 7 dias - em breve</p>
        </div>
      </div>

      {/* Grid de Botões */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => handleNavigation('pix')}
          className="bg-[#0057FF] text-white rounded-lg p-4 flex flex-col items-center justify-center space-y-2 h-24 transition-colors hover:bg-[#0047CC]"
        >
          <Smartphone className="w-6 h-6" />
          <span className="text-sm font-medium">Pix</span>
        </button>

        <button
          onClick={() => handleNavigation('ted')}
          className="bg-[#D4E4FF] text-[#0057FF] rounded-lg p-4 flex flex-col items-center justify-center space-y-2 h-24 transition-colors hover:bg-[#C4D4EF]"
        >
          <Banknote className="w-6 h-6" />
          <span className="text-sm font-medium">TED</span>
        </button>

        <button
          onClick={() => handleNavigation('cobranca')}
          className="bg-[#D4E4FF] text-[#0057FF] rounded-lg p-4 flex flex-col items-center justify-center space-y-2 h-24 transition-colors hover:bg-[#C4D4EF]"
        >
          <FileText className="w-6 h-6" />
          <span className="text-sm font-medium">Cobrar</span>
        </button>

        <button
          onClick={() => handleNavigation('extrato')}
          className="bg-[#D4E4FF] text-[#0057FF] rounded-lg p-4 flex flex-col items-center justify-center space-y-2 h-24 transition-colors hover:bg-[#C4D4EF]"
        >
          <History className="w-6 h-6" />
          <span className="text-sm font-medium">Extrato</span>
        </button>
      </div>
    </div>
  );
};

export default Home;

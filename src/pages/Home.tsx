
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Smartphone, QrCode, CreditCard } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    nome: 'João Silva',
    saldo: 5230.80,
    limite: 2000.00,
    rendimento_mes: 125.50
  });
  const [loading, setLoading] = useState(true);

  // Mock user data
  const userId = "123";
  const token = "mock-token";

  useEffect(() => {
    // Simular chamada da API
    const fetchUserData = async () => {
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
          setUserData({
            nome: 'João Silva',
            saldo: 5230.80,
            limite: 2000.00,
            rendimento_mes: 125.50
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, token]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const quickActions = [
    { label: 'Transferir', icon: ArrowRight, path: '/transferir' },
    { label: 'Pagar', icon: Smartphone, path: '/pagar' },
    { label: 'QR Code', icon: QrCode, path: '/qrcode' },
    { label: 'Cartão', icon: CreditCard, path: '/cartoes' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Saudação */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-xl font-bold text-[#1F1F1F]">
          Olá, {userData.nome} 👋
        </h1>
      </div>

      {/* Informações Financeiras */}
      <div className="bg-[#D4E4FF] rounded-xl p-6">
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-white/30 rounded w-48"></div>
            <div className="h-6 bg-white/30 rounded w-32"></div>
            <div className="h-6 bg-white/30 rounded w-40"></div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-[#1F1F1F] text-sm font-medium">Saldo disponível</p>
              <p className="text-[#1F1F1F] text-2xl font-bold">
                {formatCurrency(userData.saldo)}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[#1F1F1F] text-sm font-medium">Limite</p>
                <p className="text-[#1F1F1F] text-lg font-semibold">
                  {formatCurrency(userData.limite)}
                </p>
              </div>
              <div>
                <p className="text-[#1F1F1F] text-sm font-medium">Rendimento do mês</p>
                <p className="text-[#1F1F1F] text-lg font-semibold text-green-600">
                  {formatCurrency(userData.rendimento_mes)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Ações Rápidas */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-lg font-bold text-[#1F1F1F] mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-2 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => navigate(action.path)}
              className="flex items-center space-x-3 p-4 rounded-xl bg-[#0057FF] text-white hover:bg-[#0047CC] transition-colors"
            >
              <action.icon className="w-6 h-6" />
              <span className="font-medium">{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;

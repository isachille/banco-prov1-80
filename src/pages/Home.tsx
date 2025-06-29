
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Eye, EyeOff, CreditCard, Smartphone, TrendingUp, Building, Car, QrCode, Receipt } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [showBalance, setShowBalance] = useState(true);
  const [userData, setUserData] = useState({
    nome: 'João Silva',
    saldo: 2500.45,
    limite: 5000.00,
    rendimento: 125.30
  });

  const quickActions = [
    { icon: Smartphone, label: 'Pix', action: () => navigate('/pix'), color: 'bg-purple-100 text-purple-600' },
    { icon: Receipt, label: 'Boletos', action: () => navigate('/pagar'), color: 'bg-red-100 text-red-600' },
    { icon: CreditCard, label: 'Cartões', action: () => navigate('/cartoes'), color: 'bg-blue-100 text-blue-600' },
    { icon: TrendingUp, label: 'Investir', action: () => navigate('/investir'), color: 'bg-green-100 text-green-600' },
    { icon: Building, label: 'Financiamento', action: () => navigate('/financiamento'), color: 'bg-orange-100 text-orange-600' },
    { icon: Car, label: 'Consórcio', action: () => navigate('/consorcio'), color: 'bg-indigo-100 text-indigo-600' }
  ];

  useEffect(() => {
    // Simular busca de dados do usuário
    console.log('Buscando dados do usuário...');
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#0057FF] text-white p-6 rounded-b-3xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Olá, {userData.nome} 👋</h1>
            <p className="text-blue-200">Bem-vindo ao seu Banco Pro</p>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={() => navigate('/perfil')}
              className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center"
            >
              👤
            </button>
            <button 
              onClick={() => navigate('/ajuda')}
              className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center"
            >
              ❓
            </button>
          </div>
        </div>

        {/* Saldo */}
        <Card className="bg-white bg-opacity-10 border-0 text-white">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-blue-200">Saldo disponível</span>
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="text-blue-200 hover:text-white"
              >
                {showBalance ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <div className="text-3xl font-bold">
              {showBalance ? `R$ ${userData.saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '• • • • •'}
            </div>
            <div className="flex justify-between mt-4 text-sm text-blue-200">
              <span>Limite: R$ {userData.limite.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              <span>Rendimento: +R$ {userData.rendimento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="p-6 -mt-4">
        {/* Cartões */}
        <Card className="mb-6 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold">Cartão Banco Pro</p>
                  <p className="text-sm text-gray-500">•••• 1234</p>
                </div>
              </div>
              <button 
                onClick={() => navigate('/cartoes')}
                className="text-[#0057FF] text-sm font-medium"
              >
                Ver cartões
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Banners promocionais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white cursor-pointer hover:scale-105 transition-transform">
            <CardContent className="p-4">
              <h3 className="font-bold">Financiamento</h3>
              <p className="text-sm opacity-90">Realize seus sonhos</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-500 to-teal-500 text-white cursor-pointer hover:scale-105 transition-transform"
                onClick={() => navigate('/cartoes')}>
            <CardContent className="p-4">
              <h3 className="font-bold">Cartão de Crédito</h3>
              <p className="text-sm opacity-90">Sem anuidade</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white cursor-pointer hover:scale-105 transition-transform"
                onClick={() => navigate('/cartoes')}>
            <CardContent className="p-4">
              <h3 className="font-bold">Cartão de Débito</h3>
              <p className="text-sm opacity-90">Sem taxas</p>
            </CardContent>
          </Card>
        </div>

        {/* Ações Rápidas */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <Card 
                key={index}
                className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
                onClick={action.action}
              >
                <CardContent className="p-4 text-center">
                  <div className={`w-12 h-12 ${action.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                    <action.icon className="w-6 h-6" />
                  </div>
                  <p className="font-medium text-gray-800">{action.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Últimas transações */}
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-800">Últimas transações</h3>
              <button 
                onClick={() => navigate('/extrato')}
                className="text-[#0057FF] text-sm font-medium"
              >
                Ver todas
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-sm">↓</span>
                  </div>
                  <div>
                    <p className="font-medium">Transferência recebida</p>
                    <p className="text-sm text-gray-500">Ontem às 14:30</p>
                  </div>
                </div>
                <span className="font-bold text-green-600">+R$ 350,00</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 text-sm">📱</span>
                  </div>
                  <div>
                    <p className="font-medium">Pix enviado</p>
                    <p className="text-sm text-gray-500">Hoje às 09:15</p>
                  </div>
                </div>
                <span className="font-bold text-red-600">-R$ 120,00</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;

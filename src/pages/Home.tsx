import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Eye, EyeOff, CreditCard, Smartphone, TrendingUp, Building, Car, QrCode, Receipt, User, Gift, Banknote, PiggyBank, Link, Sun, Moon, Settings, HelpCircle, ArrowRight } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const Home = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [showBalance, setShowBalance] = useState(true);
  const [userData, setUserData] = useState({
    nome: 'João Silva',
    saldo: 2500.45,
    saldoBloqueado: 150.00,
    limite: 5000.00,
    rendimento: 125.30
  });

  const quickActions = [
    { icon: Smartphone, label: 'Pix', action: () => navigate('/pix'), color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400' },
    { icon: Receipt, label: 'Boletos', action: () => navigate('/pagar'), color: 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400' },
    { icon: CreditCard, label: 'Cartões', action: () => navigate('/cartoes'), color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' },
    { icon: TrendingUp, label: 'Investir', action: () => navigate('/investir'), color: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' },
    { icon: ArrowRight, label: 'Transferir', action: () => navigate('/transferir'), color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400' },
    { icon: Building, label: 'Financiamento', action: () => navigate('/financiamento'), color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400' }
  ];

  const navigationItems = [
    { icon: Settings, label: 'Configurações', action: () => navigate('/configuracoes') },
    { icon: HelpCircle, label: 'Ajuda', action: () => navigate('/ajuda') }
  ];

  const giftCards = [
    {
      name: 'Netflix',
      image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=200&fit=crop',
      description: 'Stranger Things, La Casa de Papel e muito mais',
      values: [25, 50, 100]
    },
    {
      name: 'Google Play',
      image: 'https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=400&h=200&fit=crop',
      description: 'Apps, jogos e entretenimento',
      values: [15, 30, 50, 100]
    },
    {
      name: 'PlayStation',
      image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=200&fit=crop',
      description: 'God of War, FIFA, Spider-Man e mais',
      values: [50, 100, 150, 200]
    },
    {
      name: 'Xbox',
      image: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=400&h=200&fit=crop',
      description: 'Call of Duty, Halo e jogos exclusivos',
      values: [50, 100, 150, 200]
    }
  ];

  useEffect(() => {
    console.log('Buscando dados do usuário...');
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header com novo visual espacial */}
      <div className="bg-gradient-to-r from-[#001B3A] to-[#003F5C] text-white p-4 rounded-b-3xl">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/4712549c-a705-4aad-8498-4702dc3cdd8f.png" 
              alt="Banco Pro" 
              className="h-8 w-auto filter brightness-0 invert"
            />
            <div>
              <h1 className="text-xl font-bold">Olá, {userData.nome} 👋</h1>
              <p className="text-blue-200 text-sm">Bem-vindo ao seu Banco Pro</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors backdrop-blur-sm"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
            <button 
              onClick={() => navigate('/perfil')}
              className="w-9 h-9 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors backdrop-blur-sm"
            >
              <User className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Saldo com novo visual */}
        <Card className="bg-white bg-opacity-10 border-0 text-white mb-4 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-blue-200 text-sm">Saldo disponível</span>
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="text-blue-200 hover:text-white transition-colors"
              >
                {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="text-2xl font-bold mb-2">
              {showBalance ? `R$ ${userData.saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '• • • • •'}
            </div>
            
            {/* Sistema de espelho - mostra saldo bloqueado */}
            {userData.saldoBloqueado > 0 && (
              <div className="mb-3 p-2 bg-orange-500 bg-opacity-20 rounded border border-orange-400 border-opacity-30">
                <p className="text-xs text-orange-200">
                  R$ {userData.saldoBloqueado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} em análise / retenção
                </p>
              </div>
            )}
            
            <div className="flex justify-between text-xs text-blue-200">
              <span>Limite: R$ {userData.limite.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              <span>Rendimento: +R$ {userData.rendimento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
          </CardContent>
        </Card>

        {/* Open Finance e Cofrinho - Compactos */}
        <div className="grid grid-cols-2 gap-2">
          <Card 
            className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 bg-gradient-to-r from-green-500 to-teal-500 text-white"
            onClick={() => navigate('/open-finance')}
          >
            <CardContent className="p-3 flex items-center space-x-2">
              <Link className="w-5 h-5" />
              <div>
                <h3 className="font-bold text-sm">Open Finance</h3>
                <p className="text-xs opacity-90">Conectar conta</p>
              </div>
            </CardContent>
          </Card>
          
          <Card 
            className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 bg-gradient-to-r from-pink-500 to-purple-500 text-white"
            onClick={() => navigate('/cofrinho')}
          >
            <CardContent className="p-3 flex items-center space-x-2">
              <PiggyBank className="w-5 h-5" />
              <div>
                <h3 className="font-bold text-sm">Cofrinho</h3>
                <p className="text-xs opacity-90">Guardar e Investir</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="p-4 -mt-2">
        {/* Cartões */}
        <Card className="mb-4 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Cartão Banco Pro</p>
                  <p className="text-xs text-muted-foreground">•••• 1234</p>
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

        {/* Ações Rápidas */}
        <div className="mb-4">
          <h2 className="text-lg font-bold text-foreground mb-3">Ações Rápidas</h2>
          <div className="grid grid-cols-3 gap-3">
            {quickActions.map((action, index) => (
              <Card 
                key={index}
                className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
                onClick={action.action}
              >
                <CardContent className="p-3 text-center">
                  <div className={`w-10 h-10 ${action.color} rounded-full flex items-center justify-center mx-auto mb-2 transition-colors`}>
                    <action.icon className="w-5 h-5" />
                  </div>
                  <p className="font-medium text-foreground text-xs">{action.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Últimas transações */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-foreground">Últimas transações</h3>
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
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                    <span className="text-green-600 dark:text-green-400 text-sm">↓</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">Transferência recebida</p>
                    <p className="text-xs text-muted-foreground">Ontem às 14:30</p>
                  </div>
                </div>
                <span className="font-bold text-green-600 dark:text-green-400 text-sm">+R$ 350,00</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 dark:text-purple-400 text-sm">📱</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">Pix enviado</p>
                    <p className="text-xs text-muted-foreground">Hoje às 09:15</p>
                  </div>
                </div>
                <span className="font-bold text-red-600 dark:text-red-400 text-sm">-R$ 120,00</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gift Cards */}
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-3">
            <Gift className="w-5 h-5 text-[#0057FF]" />
            <h2 className="text-lg font-bold text-foreground">Gift Cards</h2>
          </div>
          <Carousel className="w-full">
            <CarouselContent className="-ml-2">
              {giftCards.map((card, index) => (
                <CarouselItem key={index} className="pl-2 basis-3/4">
                  <Card 
                    className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 overflow-hidden"
                    onClick={() => navigate('/gift-cards', { state: { card } })}
                  >
                    <div className="relative">
                      <img 
                        src={card.image} 
                        alt={card.name}
                        className="w-full h-24 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-0 left-0 p-2 text-white">
                        <h3 className="font-bold text-sm">{card.name}</h3>
                        <p className="text-xs opacity-90">{card.description}</p>
                      </div>
                    </div>
                    <CardContent className="p-2">
                      <div className="flex flex-wrap gap-1">
                        {card.values.slice(0, 3).map((value, i) => (
                          <span key={i} className="bg-[#0057FF] text-white text-xs px-2 py-1 rounded">
                            R$ {value}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>

        {/* Menu de navegação inferior */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          {navigationItems.map((item, index) => (
            <Card 
              key={index}
              className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
              onClick={item.action}
            >
              <CardContent className="p-4 text-center">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-2">
                  <item.icon className="w-5 h-5" />
                </div>
                <p className="font-medium text-foreground text-sm">{item.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;

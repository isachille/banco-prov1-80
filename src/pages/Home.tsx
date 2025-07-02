import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Send, ArrowRight, QrCode, Gift, Sun, Moon, TrendingUp, PiggyBank, CreditCard } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import GiftCardModal from '@/components/GiftCardModal';

interface WalletData {
  id: string;
  saldo: number;
  limite: number;
  rendimento_mes: number;
  status: string;
}

interface UserData {
  nome: string;
  nome_completo: string;
  status: string;
  tipo: string;
}

interface GiftCard {
  id: string;
  name: string;
  image: string;
  values: number[];
  description: string;
}

const Home = () => {
  const [showBalance, setShowBalance] = useState(false);
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedGiftCard, setSelectedGiftCard] = useState<GiftCard | null>(null);
  const [selectedValue, setSelectedValue] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const giftCards: GiftCard[] = [
    {
      id: 'netflix',
      name: 'Netflix',
      image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=64&h=64&fit=crop&crop=center',
      values: [25, 50, 100],
      description: 'Cartão presente Netflix para assinar ou renovar sua conta'
    },
    {
      id: 'steam',
      name: 'Steam',
      image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=64&h=64&fit=crop&crop=center',
      values: [20, 50, 100, 200],
      description: 'Créditos Steam para comprar jogos e conteúdo'
    },
    {
      id: 'ifood',
      name: 'iFood',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=64&h=64&fit=crop&crop=center',
      values: [25, 50, 75, 100],
      description: 'Vale-refeição iFood para seus pedidos favoritos'
    },
    {
      id: 'uber',
      name: 'Uber',
      image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=64&h=64&fit=crop&crop=center',
      values: [20, 40, 60, 100],
      description: 'Créditos Uber para viagens e entregas'
    },
    {
      id: 'spotify',
      name: 'Spotify',
      image: 'https://images.unsplash.com/photo-1611339555312-e607c8352fd7?w=64&h=64&fit=crop&crop=center',
      values: [15, 30, 60],
      description: 'Cartão presente Spotify Premium'
    }
  ];

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error('Usuário não autenticado');
        return;
      }

      const { data: user, error: userError } = await supabase
        .from('users')
        .select('nome, nome_completo, status, tipo')
        .eq('id', session.user.id)
        .single();

      if (userError) {
        console.error('Erro ao carregar dados do usuário:', userError);
        toast.error('Erro ao carregar dados do usuário');
        return;
      }

      setUserData(user);

      if (user.status === 'ativo') {
        const { data: wallet, error: walletError } = await supabase
          .from('wallets')
          .select('*')
          .eq('user_id', session.user.id)
          .single();

        if (walletError) {
          console.error('Erro ao carregar dados da carteira:', walletError);
        } else {
          setWalletData(wallet);
        }
      }

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const toggleBalanceVisibility = () => {
    setShowBalance(!showBalance);
  };

  const handleGiftCardClick = (giftCard: GiftCard) => {
    setSelectedGiftCard(giftCard);
    setSelectedValue(null);
    setIsModalOpen(true);
  };

  const handleConfirmPurchase = async () => {
    if (!selectedGiftCard || !selectedValue) return;

    setIsProcessing(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Não autenticado');

      const { data, error } = await supabase.rpc('comprar_giftcard', {
        p_user: session.user.id,
        p_servico: selectedGiftCard.name,
        p_valor: selectedValue
      });

      if (error) throw error;

      toast.success(`✅ ${selectedGiftCard.name} de ${formatCurrency(selectedValue)} adquirido com sucesso!`);
      
      await loadUserData();
      
      setIsModalOpen(false);
      setSelectedGiftCard(null);
      setSelectedValue(null);

    } catch (error: any) {
      toast.error(error.message || 'Erro ao processar compra');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0047AB]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com tema toggle */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Olá, {userData?.nome}! 👋
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Bem-vindo ao seu Banco Pro
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className="text-gray-600 dark:text-gray-400"
        >
          {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </Button>
      </div>

      {userData?.status !== 'ativo' ? (
        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                Conta em Análise
              </h3>
              <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                Suas funcionalidades bancárias serão liberadas após a aprovação.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Cartão do Saldo - Estilo Nubank */}
          <Card className="bg-gradient-to-r from-[#0047AB] to-[#0056CC] text-white shadow-xl rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Saldo disponível</p>
                  <div className="flex items-center gap-3">
                    <div className="text-3xl font-bold">
                      {showBalance 
                        ? formatCurrency(walletData?.saldo || 0)
                        : '••••••'
                      }
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleBalanceVisibility}
                      className="text-white hover:bg-white/10 p-2"
                    >
                      {showBalance ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-blue-200">Limite</p>
                  <p className="font-semibold">
                    {showBalance 
                      ? formatCurrency(walletData?.limite || 0)
                      : '••••••'
                    }
                  </p>
                </div>
                <div>
                  <p className="text-blue-200">Rendimento</p>
                  <p className="font-semibold text-green-300">
                    {showBalance 
                      ? formatCurrency(walletData?.rendimento_mes || 0)
                      : '••••••'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ações Rápidas - Grid 2x3 */}
          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2 rounded-xl border-2 hover:border-[#0047AB] hover:text-[#0047AB] transition-all"
              onClick={() => navigate('/pix')}
            >
              <Send className="h-8 w-8" />
              <span className="text-sm font-semibold">Enviar Pix</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2 rounded-xl border-2 hover:border-[#0047AB] hover:text-[#0047AB] transition-all"
              onClick={() => navigate('/transferir')}
            >
              <ArrowRight className="h-8 w-8" />
              <span className="text-sm font-semibold">Transferir</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2 rounded-xl border-2 hover:border-[#0047AB] hover:text-[#0047AB] transition-all"
              onClick={() => navigate('/cobranca')}
            >
              <QrCode className="h-8 w-8" />
              <span className="text-sm font-semibold">Cobrar</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2 rounded-xl border-2 hover:border-[#0047AB] hover:text-[#0047AB] transition-all"
              onClick={() => navigate('/gift-cards')}
            >
              <Gift className="h-8 w-8" />
              <span className="text-sm font-semibold">Gift Cards</span>
            </Button>

            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2 rounded-xl border-2 hover:border-[#0047AB] hover:text-[#0047AB] transition-all"
              onClick={() => navigate('/financiamento')}
            >
              <CreditCard className="h-8 w-8" />
              <span className="text-sm font-semibold">Financiamento</span>
            </Button>

            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2 rounded-xl border-2 hover:border-[#0047AB] hover:text-[#0047AB] transition-all"
              onClick={() => navigate('/investir')}
            >
              <TrendingUp className="h-8 w-8" />
              <span className="text-sm font-semibold">Investir</span>
            </Button>
          </div>

          {/* Cofrinho - Card especial */}
          <Card className="rounded-2xl bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 border-pink-200 dark:border-pink-800">
            <CardContent className="p-4">
              <Button 
                variant="ghost" 
                className="w-full h-16 flex items-center justify-start space-x-4 hover:bg-pink-100 dark:hover:bg-pink-900/30 transition-all"
                onClick={() => navigate('/cofrinho')}
              >
                <div className="bg-pink-500 p-3 rounded-full">
                  <PiggyBank className="h-6 w-6 text-white" />
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-pink-800 dark:text-pink-200">Cofrinho</h4>
                  <p className="text-sm text-pink-600 dark:text-pink-300">Guarde seu dinheiro</p>
                </div>
              </Button>
            </CardContent>
          </Card>

          {/* Gift Cards em destaque */}
          <Card className="rounded-2xl">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Gift Cards Populares
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {giftCards.slice(0, 3).map((giftCard) => (
                  <Card 
                    key={giftCard.id} 
                    className="cursor-pointer hover:shadow-lg transition-all duration-200 rounded-xl"
                    onClick={() => handleGiftCardClick(giftCard)}
                  >
                    <CardContent className="p-3 text-center">
                      <img 
                        src={giftCard.image} 
                        alt={giftCard.name}
                        className="w-10 h-10 mx-auto mb-2 rounded-lg object-cover"
                      />
                      <h4 className="font-medium text-xs mb-1">{giftCard.name}</h4>
                      <p className="text-xs text-gray-500">
                        R$ {Math.min(...giftCard.values)}+
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Modal de Gift Card */}
      <GiftCardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        giftCard={selectedGiftCard}
        selectedValue={selectedValue}
        onValueSelect={setSelectedValue}
        onConfirmPurchase={handleConfirmPurchase}
        isProcessing={isProcessing}
      />
    </div>
  );
};

export default Home;

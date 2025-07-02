
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Gift, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const giftCards = [
  { id: 1, name: 'Netflix', value: 50, image: '🎬' },
  { id: 2, name: 'Rappi', value: 100, image: '🍔' },
  { id: 3, name: 'iFood', value: 75, image: '🍕' },
  { id: 4, name: 'Spotify', value: 30, image: '🎵' },
  { id: 5, name: 'Amazon', value: 200, image: '📦' },
  { id: 6, name: 'Google Play', value: 25, image: '🎮' },
];

const GiftCardsPage = () => {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState<number | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: walletData } = await supabase
          .from('binance_wallets')
          .select('balance')
          .eq('user_id', user.id)
          .single();

        if (walletData) {
          setBalance(walletData.balance || 0);
        }
      }
    };

    fetchBalance();
  }, []);

  const handlePurchase = async (giftCard: typeof giftCards[0]) => {
    if (balance < giftCard.value) {
      toast.error('Saldo insuficiente');
      return;
    }

    setLoading(giftCard.id);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Usuário não autenticado');
        return;
      }

      // Gerar código do gift card
      const codigo = `${giftCard.name.toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      // Registrar compra
      const { error: giftCardError } = await supabase
        .from('giftcards')
        .insert({
          user_id: user.id,
          nome: giftCard.name,
          valor: giftCard.value,
          codigo: codigo
        });

      if (giftCardError) throw giftCardError;

      // Registrar transação
      const { error: transactionError } = await supabase
        .from('binance_transactions')
        .insert({
          user_id: user.id,
          tipo: 'giftcard',
          valor: giftCard.value,
          moeda: 'BRL',
          status: 'concluido',
          metadata: { giftcard_name: giftCard.name, codigo: codigo }
        });

      if (transactionError) throw transactionError;

      // Atualizar saldo
      const newBalance = balance - giftCard.value;
      await supabase
        .from('binance_wallets')
        .update({ balance: newBalance })
        .eq('user_id', user.id);

      setBalance(newBalance);
      toast.success(`Gift Card ${giftCard.name} comprado com sucesso! Código: ${codigo}`);
    } catch (error) {
      console.error('Erro na compra:', error);
      toast.error('Erro ao comprar gift card');
    } finally {
      setLoading(null);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Gift Cards</h1>
      </div>

      <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Saldo Disponível</p>
              <p className="text-xl font-bold">{formatCurrency(balance)}</p>
            </div>
            <Gift className="h-8 w-8 text-purple-100" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {giftCards.map((giftCard) => (
          <Card key={giftCard.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="text-4xl mb-2">{giftCard.image}</div>
              <CardTitle className="text-lg">{giftCard.name}</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(giftCard.value)}
                </p>
              </div>
              <Button
                className="w-full"
                onClick={() => handlePurchase(giftCard)}
                disabled={loading === giftCard.id || balance < giftCard.value}
              >
                {loading === giftCard.id ? (
                  'Comprando...'
                ) : balance < giftCard.value ? (
                  'Saldo Insuficiente'
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Comprar
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GiftCardsPage;

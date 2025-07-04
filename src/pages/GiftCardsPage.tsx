
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Gift, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const GiftCardsPage = () => {
  const navigate = useNavigate();

  const giftCards = [
    { id: 1, name: 'Amazon', value: 50, image: '🛒' },
    { id: 2, name: 'Netflix', value: 30, image: '🎬' },
    { id: 3, name: 'Spotify', value: 20, image: '🎵' },
    { id: 4, name: 'Google Play', value: 25, image: '📱' },
  ];

  const handlePurchase = (cardName: string, value: number) => {
    toast.success(`Gift Card ${cardName} de R$ ${value} comprado com sucesso!`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/home')}
              className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Gift Cards</h1>
              <p className="text-purple-100">Presenteie quem você ama</p>
            </div>
          </div>
          <Gift className="h-8 w-8" />
        </div>
      </div>

      <div className="container mx-auto p-6 max-w-md">
        <div className="space-y-4">
          {giftCards.map((card) => (
            <Card key={card.id} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{card.image}</div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{card.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">R$ {card.value}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handlePurchase(card.name, card.value)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    Comprar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-none">
          <CardContent className="p-4 text-center">
            <Star className="h-8 w-8 mx-auto mb-2" />
            <h3 className="font-bold mb-1">Gift Cards Especiais</h3>
            <p className="text-sm text-yellow-100">
              Ganhe pontos e desccontos especiais em compras de gift cards
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GiftCardsPage;

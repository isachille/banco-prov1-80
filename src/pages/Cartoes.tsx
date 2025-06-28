
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Card {
  id: string;
  final_number: string;
  type: 'Débito' | 'Crédito';
  brand: 'Visa' | 'Master';
  status: 'Ativo' | 'Bloqueado';
}

const Cartoes = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock user data
  const userId = "123";
  const token = "mock-token";

  useEffect(() => {
    const fetchCards = async () => {
      try {
        // Em produção seria:
        // const response = await fetch(`https://seu-xano.com/api/cards/user/${userId}`, {
        //   headers: {
        //     'Authorization': `Bearer ${token}`
        //   }
        // });
        // const data = await response.json();

        // Mock data
        setTimeout(() => {
          setCards([
            {
              id: '1',
              final_number: '4521',
              type: 'Débito',
              brand: 'Visa',
              status: 'Ativo'
            },
            {
              id: '2',
              final_number: '8765',
              type: 'Crédito',
              brand: 'Master',
              status: 'Ativo'
            }
          ]);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Erro ao buscar cartões:', error);
        setLoading(false);
      }
    };

    fetchCards();
  }, [userId, token]);

  const handleRequestCard = () => {
    toast.success('Solicitação enviada! Você receberá seu cartão em até 7 dias úteis.');
  };

  const getBrandColor = (brand: string) => {
    return brand === 'Visa' ? 'text-blue-600' : 'text-red-600';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-[#1F1F1F] mb-6">Meus Cartões</h1>

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-32 bg-gray-200 rounded-xl"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {cards.map((card) => (
              <div
                key={card.id}
                className="bg-[#1B2C59] text-white rounded-xl p-6 shadow-lg"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm opacity-80">Final do cartão</p>
                    <p className="text-xl font-bold">•••• •••• •••• {card.final_number}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${getBrandColor(card.brand)}`}>
                      {card.brand}
                    </p>
                    <p className="text-sm opacity-80">{card.type}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm opacity-80">Status: {card.status}</span>
                  <span className="text-sm opacity-80">Banco Pro</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6">
          <Button
            onClick={handleRequestCard}
            className="w-full bg-[#0057FF] hover:bg-[#0047CC] text-white font-medium py-3"
          >
            Solicitar novo cartão
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Cartoes;

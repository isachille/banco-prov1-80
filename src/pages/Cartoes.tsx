
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface Card {
  id: string;
  final_number: string;
  type: 'Débito' | 'Crédito';
  brand: 'Visa' | 'Master';
  status: 'Ativo' | 'Bloqueado';
}

const Cartoes = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCards = async () => {
      try {
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
  }, []);

  const handleRequestCard = () => {
    toast.success('Solicitação enviada! Você receberá seu cartão em até 7 dias úteis.');
  };

  const getBrandColor = (brand: string) => {
    return brand === 'Visa' ? 'text-blue-600' : 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#001B3A] to-[#003F5C] text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/home')}
              className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Meus Cartões</h1>
              <p className="text-blue-100">Gerencie seus cartões</p>
            </div>
          </div>
          <img 
            src="/lovable-uploads/4712549c-a705-4aad-8498-4702dc3cdd8f.png" 
            alt="Banco Pro" 
            className="h-12 w-auto"
          />
        </div>
      </div>

      <div className="container mx-auto p-6 max-w-4xl">
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-32 bg-gray-200 rounded-xl"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4 mb-6">
            {cards.map((card) => (
              <Card key={card.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-gradient-to-r from-[#001B3A] to-[#003F5C] text-white p-6">
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
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Solicitar Novo Cartão</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Solicite um novo cartão de débito ou crédito para sua conta.
            </p>
            <Button
              onClick={handleRequestCard}
              className="w-full bg-gradient-to-r from-[#001B3A] to-[#003F5C] hover:from-[#002A4A] hover:to-[#004F6C]"
            >
              Solicitar novo cartão
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Cartoes;

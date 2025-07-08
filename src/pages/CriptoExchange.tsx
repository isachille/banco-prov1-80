import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown, Wallet, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const CriptoExchange = () => {
  const navigate = useNavigate();
  const [balance, setBalance] = useState({ BRL: 1000, BTC: 0.05, ETH: 0.5 });
  const [showBalance, setShowBalance] = useState(true);
  const [buyAmount, setBuyAmount] = useState('');
  const [sellAmount, setSellAmount] = useState('');

  const cryptos = [
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      price: 295000,
      change: 2.5,
      volume24h: 'R$ 1.2B',
      marketCap: 'R$ 5.8T'
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      price: 12500,
      change: -1.2,
      volume24h: 'R$ 450M',
      marketCap: 'R$ 1.5T'
    },
    {
      symbol: 'BNB',
      name: 'Binance Coin',
      price: 1250,
      change: 0.8,
      volume24h: 'R$ 180M',
      marketCap: 'R$ 190B'
    },
    {
      symbol: 'ADA',
      name: 'Cardano',
      price: 2.50,
      change: -3.1,
      volume24h: 'R$ 95M',
      marketCap: 'R$ 85B'
    }
  ];

  const handleBuy = (crypto: string) => {
    if (!buyAmount || parseFloat(buyAmount) <= 0) {
      toast.error('Informe um valor válido');
      return;
    }

    const amount = parseFloat(buyAmount);
    if (amount > balance.BRL) {
      toast.error('Saldo insuficiente');
      return;
    }

    // Simular compra
    const cryptoPrice = cryptos.find(c => c.symbol === crypto)?.price || 0;
    const cryptoAmount = amount / cryptoPrice;
    
    setBalance(prev => ({
      ...prev,
      BRL: prev.BRL - amount,
      [crypto]: (prev[crypto as keyof typeof prev] as number || 0) + cryptoAmount
    }));

    toast.success(`Compra de ${crypto} realizada com sucesso!`);
    setBuyAmount('');
  };

  const handleSell = (crypto: string) => {
    if (!sellAmount || parseFloat(sellAmount) <= 0) {
      toast.error('Informe um valor válido');
      return;
    }

    const amount = parseFloat(sellAmount);
    const currentBalance = balance[crypto as keyof typeof balance] as number || 0;
    
    if (amount > currentBalance) {
      toast.error('Quantidade insuficiente');
      return;
    }

    // Simular venda
    const cryptoPrice = cryptos.find(c => c.symbol === crypto)?.price || 0;
    const brlAmount = amount * cryptoPrice;
    
    setBalance(prev => ({
      ...prev,
      BRL: prev.BRL + brlAmount,
      [crypto]: (prev[crypto as keyof typeof prev] as number || 0) - amount
    }));

    toast.success(`Venda de ${crypto} realizada com sucesso!`);
    setSellAmount('');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-[#001B3A] to-[#003F5C] text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/cripto')}
              className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Exchange de Criptomoedas</h1>
              <p className="text-blue-100">Compre e venda criptomoedas</p>
            </div>
          </div>
          <Wallet className="w-8 h-8" />
        </div>
      </div>

      <div className="container mx-auto p-6 max-w-4xl space-y-6">
        {/* Saldo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Minha Carteira</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBalance(!showBalance)}
              >
                {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Real (BRL)</p>
                <p className="font-bold text-lg">
                  {showBalance ? `R$ ${balance.BRL.toFixed(2)}` : '••••••'}
                </p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Bitcoin (BTC)</p>
                <p className="font-bold text-lg">
                  {showBalance ? `${balance.BTC.toFixed(6)}` : '••••••'}
                </p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Ethereum (ETH)</p>
                <p className="font-bold text-lg">
                  {showBalance ? `${balance.ETH.toFixed(4)}` : '••••••'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Criptomoedas */}
        <Card>
          <CardHeader>
            <CardTitle>Mercado de Criptomoedas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cryptos.map((crypto) => (
                <div key={crypto.symbol} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="font-bold text-blue-600">{crypto.symbol}</span>
                      </div>
                      <div>
                        <p className="font-semibold">{crypto.name}</p>
                        <p className="text-sm text-gray-600">{crypto.symbol}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">R$ {crypto.price.toLocaleString('pt-BR')}</p>
                      <div className={`flex items-center ${crypto.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {crypto.change >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                        <span className="text-sm">{Math.abs(crypto.change)}%</span>
                      </div>
                    </div>
                  </div>

                  <Tabs defaultValue="buy" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="buy" className="text-green-600">Comprar</TabsTrigger>
                      <TabsTrigger value="sell" className="text-red-600">Vender</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="buy" className="space-y-3">
                      <div className="flex space-x-2">
                        <Input
                          type="number"
                          placeholder="Valor em R$"
                          value={buyAmount}
                          onChange={(e) => setBuyAmount(e.target.value)}
                          className="flex-1"
                        />
                        <Button 
                          onClick={() => handleBuy(crypto.symbol)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Comprar
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500">
                        Você receberá: ~{buyAmount ? (parseFloat(buyAmount) / crypto.price).toFixed(6) : '0'} {crypto.symbol}
                      </p>
                    </TabsContent>
                    
                    <TabsContent value="sell" className="space-y-3">
                      <div className="flex space-x-2">
                        <Input
                          type="number"
                          placeholder={`Quantidade de ${crypto.symbol}`}
                          value={sellAmount}
                          onChange={(e) => setSellAmount(e.target.value)}
                          className="flex-1"
                        />
                        <Button 
                          onClick={() => handleSell(crypto.symbol)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Vender
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500">
                        Você receberá: ~R$ {sellAmount ? (parseFloat(sellAmount) * crypto.price).toFixed(2) : '0,00'}
                      </p>
                    </TabsContent>
                  </Tabs>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CriptoExchange;
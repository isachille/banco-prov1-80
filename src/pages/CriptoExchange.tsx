import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown, Wallet, Eye, EyeOff, BarChart3, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CriptoExchange = () => {
  const navigate = useNavigate();
  const [balance, setBalance] = useState({ BRL: 1000, BTC: 0.05, ETH: 0.5 });
  const [showBalance, setShowBalance] = useState(true);
  const [buyAmount, setBuyAmount] = useState('');
  const [sellAmount, setSellAmount] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState('BTC');

  const cryptos = [
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      price: 295000,
      change: 2.5,
      volume24h: 'R$ 1.2B',
      marketCap: 'R$ 5.8T',
      high24h: 298000,
      low24h: 291000
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      price: 12500,
      change: -1.2,
      volume24h: 'R$ 450M',
      marketCap: 'R$ 1.5T',
      high24h: 12800,
      low24h: 12200
    },
    {
      symbol: 'BNB',
      name: 'Binance Coin',
      price: 1250,
      change: 0.8,
      volume24h: 'R$ 180M',
      marketCap: 'R$ 190B',
      high24h: 1280,
      low24h: 1220
    },
    {
      symbol: 'ADA',
      name: 'Cardano',
      price: 2.50,
      change: -3.1,
      volume24h: 'R$ 95M',
      marketCap: 'R$ 85B',
      high24h: 2.65,
      low24h: 2.40
    }
  ];

  // Dados simulados para os gráficos
  const generateChartData = (crypto: string) => {
    const basePrice = cryptos.find(c => c.symbol === crypto)?.price || 100;
    const data = [];
    for (let i = 23; i >= 0; i--) {
      const variation = (Math.random() - 0.5) * 0.1;
      const price = basePrice * (1 + variation);
      data.push({
        time: `${23 - i}:00`,
        price: price,
        volume: Math.random() * 1000000
      });
    }
    return data;
  };

  const chartData = generateChartData(selectedCrypto);

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

      <div className="container mx-auto p-6 max-w-7xl space-y-6">
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

        {/* Seletor de Criptomoeda e Gráfico */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <BarChart3 className="mr-2 h-5 w-5" />
                    Gráfico de Preços
                  </CardTitle>
                  <div className="flex space-x-2">
                    {cryptos.map((crypto) => (
                      <Button
                        key={crypto.symbol}
                        variant={selectedCrypto === crypto.symbol ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCrypto(crypto.symbol)}
                      >
                        {crypto.symbol}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR')}`, 'Preço']}
                        labelFormatter={(label) => `Horário: ${label}`}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="price" 
                        stroke="#2563eb" 
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Métricas da Moeda Selecionada */}
          <div className="space-y-4">
            {(() => {
              const selectedCoin = cryptos.find(c => c.symbol === selectedCrypto);
              return selectedCoin ? (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">{selectedCoin.name} ({selectedCoin.symbol})</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600">Preço Atual</p>
                        <p className="text-2xl font-bold">R$ {selectedCoin.price.toLocaleString('pt-BR')}</p>
                        <div className={`flex items-center ${selectedCoin.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {selectedCoin.change >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                          <span>{Math.abs(selectedCoin.change)}%</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Máxima 24h</p>
                          <p className="font-semibold">R$ {selectedCoin.high24h.toLocaleString('pt-BR')}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Mínima 24h</p>
                          <p className="font-semibold">R$ {selectedCoin.low24h.toLocaleString('pt-BR')}</p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600">Volume 24h</p>
                        <p className="font-semibold">{selectedCoin.volume24h}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600">Market Cap</p>
                        <p className="font-semibold">{selectedCoin.marketCap}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Activity className="mr-2 h-4 w-4" />
                        Volume 24h
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-32">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData.slice(-6)}>
                            <XAxis dataKey="time" hide />
                            <YAxis hide />
                            <Tooltip formatter={(value) => [Number(value).toLocaleString('pt-BR'), 'Volume']} />
                            <Area 
                              type="monotone" 
                              dataKey="volume" 
                              stroke="#10b981" 
                              fill="#10b981" 
                              fillOpacity={0.3}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : null;
            })()}
          </div>
        </div>

        {/* Mesa de Trading */}
        <Card>
          <CardHeader>
            <CardTitle>Mesa de Trading</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Moeda</th>
                    <th className="text-right p-2">Preço</th>
                    <th className="text-right p-2">24h %</th>
                    <th className="text-right p-2">24h Volume</th>
                    <th className="text-right p-2">Market Cap</th>
                    <th className="text-center p-2">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {cryptos.map((crypto) => (
                    <tr key={crypto.symbol} className="border-b hover:bg-gray-50">
                      <td className="p-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="font-bold text-blue-600 text-sm">{crypto.symbol}</span>
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{crypto.name}</p>
                            <p className="text-xs text-gray-600">{crypto.symbol}</p>
                          </div>
                        </div>
                      </td>
                      <td className="text-right p-2 font-semibold">
                        R$ {crypto.price.toLocaleString('pt-BR')}
                      </td>
                      <td className={`text-right p-2 ${crypto.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        <div className="flex items-center justify-end">
                          {crypto.change >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                          <span className="text-sm">{Math.abs(crypto.change)}%</span>
                        </div>
                      </td>
                      <td className="text-right p-2 text-sm">{crypto.volume24h}</td>
                      <td className="text-right p-2 text-sm">{crypto.marketCap}</td>
                      <td className="text-center p-2">
                        <div className="flex justify-center space-x-1">
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700 text-xs px-2 py-1"
                            onClick={() => setSelectedCrypto(crypto.symbol)}
                          >
                            Comprar
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-red-600 border-red-600 hover:bg-red-50 text-xs px-2 py-1"
                            onClick={() => setSelectedCrypto(crypto.symbol)}
                          >
                            Vender
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Painel de Trading da Moeda Selecionada */}
        <Card>
          <CardHeader>
            <CardTitle>Trading - {cryptos.find(c => c.symbol === selectedCrypto)?.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="buy" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="buy" className="text-green-600">Comprar {selectedCrypto}</TabsTrigger>
                <TabsTrigger value="sell" className="text-red-600">Vender {selectedCrypto}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="buy" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Valor em Real (BRL)</label>
                    <Input
                      type="number"
                      placeholder="0,00"
                      value={buyAmount}
                      onChange={(e) => setBuyAmount(e.target.value)}
                    />
                    <p className="text-xs text-gray-500">
                      Você receberá: ~{buyAmount ? (parseFloat(buyAmount) / (cryptos.find(c => c.symbol === selectedCrypto)?.price || 1)).toFixed(6) : '0'} {selectedCrypto}
                    </p>
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Resumo da Ordem</label>
                    <div className="p-3 bg-gray-50 rounded-lg space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Preço:</span>
                        <span>R$ {cryptos.find(c => c.symbol === selectedCrypto)?.price.toLocaleString('pt-BR')}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Taxa (0.2%):</span>
                        <span>R$ {buyAmount ? (parseFloat(buyAmount) * 0.002).toFixed(2) : '0,00'}</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-semibold">
                        <span>Total:</span>
                        <span>R$ {buyAmount ? (parseFloat(buyAmount) * 1.002).toFixed(2) : '0,00'}</span>
                      </div>
                    </div>
                    <Button 
                      onClick={() => handleBuy(selectedCrypto)}
                      className="w-full bg-green-600 hover:bg-green-700"
                      disabled={!buyAmount || parseFloat(buyAmount) <= 0}
                    >
                      Comprar {selectedCrypto}
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="sell" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Quantidade de {selectedCrypto}</label>
                    <Input
                      type="number"
                      placeholder="0,000000"
                      value={sellAmount}
                      onChange={(e) => setSellAmount(e.target.value)}
                    />
                    <p className="text-xs text-gray-500">
                      Você receberá: ~R$ {sellAmount ? (parseFloat(sellAmount) * (cryptos.find(c => c.symbol === selectedCrypto)?.price || 0)).toFixed(2) : '0,00'}
                    </p>
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Resumo da Ordem</label>
                    <div className="p-3 bg-gray-50 rounded-lg space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Preço:</span>
                        <span>R$ {cryptos.find(c => c.symbol === selectedCrypto)?.price.toLocaleString('pt-BR')}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Taxa (0.2%):</span>
                        <span>R$ {sellAmount ? ((parseFloat(sellAmount) * (cryptos.find(c => c.symbol === selectedCrypto)?.price || 0)) * 0.002).toFixed(2) : '0,00'}</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-semibold">
                        <span>Total:</span>
                        <span>R$ {sellAmount ? ((parseFloat(sellAmount) * (cryptos.find(c => c.symbol === selectedCrypto)?.price || 0)) * 0.998).toFixed(2) : '0,00'}</span>
                      </div>
                    </div>
                    <Button 
                      onClick={() => handleSell(selectedCrypto)}
                      className="w-full bg-red-600 hover:bg-red-700"
                      disabled={!sellAmount || parseFloat(sellAmount) <= 0}
                    >
                      Vender {selectedCrypto}
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CriptoExchange;
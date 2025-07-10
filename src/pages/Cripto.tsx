
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Wallet, Search, TrendingUp, TrendingDown, Bitcoin, DollarSign, BarChart3, Activity, Settings, RefreshCw, Zap, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import MobileLayout from '@/components/MobileLayout';
import { toast } from 'sonner';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Bar } from 'recharts';

const Cripto = () => {
  const navigate = useNavigate();
  const [connectedWallet, setConnectedWallet] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPair, setSelectedPair] = useState('BTC/BRL');
  const [chartType, setChartType] = useState('line');
  const [timeframe, setTimeframe] = useState('1h');
  const [balance, setBalance] = useState({ BRL: 0, BTC: 0, ETH: 0, BNB: 0 });
  const [showBalance, setShowBalance] = useState(true);
  const [buyAmount, setBuyAmount] = useState('');
  const [sellAmount, setSellAmount] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  const cryptos = [
    { symbol: 'BTC', name: 'Bitcoin', price: 'R$ 295.000,00', priceNum: 295000, change: '+2.5%', changeNum: 2.5, icon: Bitcoin, volume24h: 'R$ 1.2B', marketCap: 'R$ 5.8T', high24h: 298000, low24h: 291000 },
    { symbol: 'ETH', name: 'Ethereum', price: 'R$ 12.500,00', priceNum: 12500, change: '+1.8%', changeNum: 1.8, icon: DollarSign, volume24h: 'R$ 450M', marketCap: 'R$ 1.5T', high24h: 12800, low24h: 12200 },
    { symbol: 'BNB', name: 'Binance Coin', price: 'R$ 1.250,00', priceNum: 1250, change: '-0.5%', changeNum: -0.5, icon: TrendingUp, volume24h: 'R$ 180M', marketCap: 'R$ 190B', high24h: 1280, low24h: 1220 },
    { symbol: 'ADA', name: 'Cardano', price: 'R$ 2,50', priceNum: 2.50, change: '-3.1%', changeNum: -3.1, icon: DollarSign, volume24h: 'R$ 95M', marketCap: 'R$ 85B', high24h: 2.65, low24h: 2.40 },
  ];

  const tradingPairs = [
    'BTC/BRL', 'ETH/BRL', 'BNB/BRL', 'ADA/BRL',
    'BTC/USDT', 'ETH/USDT', 'BNB/USDT', 'ADA/USDT',
    'ETH/BTC', 'BNB/BTC', 'ADA/BTC'
  ];

  const walletProviders = [
    { name: 'Binance', icon: '🟡', url: 'https://www.binance.com/en/my/wallet/exchange/main' },
    { name: 'MetaMask', icon: '🦊', url: 'https://metamask.io/download/' },
    { name: 'Trust Wallet', icon: '🛡️', url: 'https://trustwallet.com/download' },
    { name: 'Coinbase Wallet', icon: '💙', url: 'https://wallet.coinbase.com/' }
  ];

  // Gerar dados simulados para gráficos de velas
  const generateCandlestickData = () => {
    const selectedCrypto = cryptos.find(c => selectedPair.startsWith(c.symbol));
    const basePrice = selectedCrypto?.priceNum || 100;
    const data = [];
    let currentPrice = basePrice;
    
    for (let i = 23; i >= 0; i--) {
      const variation = (Math.random() - 0.5) * 0.05;
      const open = currentPrice;
      const close = currentPrice * (1 + variation);
      const high = Math.max(open, close) * (1 + Math.random() * 0.02);
      const low = Math.min(open, close) * (1 - Math.random() * 0.02);
      const volume = Math.random() * 1000000;
      
      data.push({
        time: `${String(23 - i).padStart(2, '0')}:00`,
        open,
        high,
        low,
        close,
        volume,
        price: close
      });
      
      currentPrice = close;
    }
    return data;
  };

  const chartData = generateCandlestickData();

  const connectWallet = async (provider: any) => {
    setIsConnecting(true);
    toast.info(`Conectando com ${provider.name}...`);
    
    try {
      if (provider.name === 'Binance') {
        // Simular conexão real com Binance
        window.open(provider.url, '_blank', 'width=800,height=600');
        
        // Simular dados reais após conexão
        setTimeout(() => {
          setConnectedWallet(provider.name);
          setBalance({
            BRL: 15420.50,
            BTC: 0.12543,
            ETH: 2.8764,
            BNB: 45.32
          });
          toast.success(`Conectado com ${provider.name}! Saldo sincronizado.`);
          setIsConnecting(false);
        }, 3000);
      } else {
        // Para outras wallets, simular conexão
        if (typeof window !== 'undefined' && provider.name === 'MetaMask') {
          if ((window as any).ethereum) {
            try {
              await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
              setConnectedWallet(provider.name);
              setBalance({ BRL: 2500, BTC: 0.05, ETH: 0.8, BNB: 12 });
              toast.success(`Conectado com ${provider.name}!`);
            } catch (error) {
              toast.error('Conexão cancelada pelo usuário');
            }
          } else {
            window.open(provider.url, '_blank');
            toast.info('MetaMask não encontrado. Redirecionando para download...');
          }
        } else {
          setTimeout(() => {
            setConnectedWallet(provider.name);
            setBalance({ BRL: 1000, BTC: 0.02, ETH: 0.3, BNB: 5 });
            toast.success(`Conectado com ${provider.name}!`);
          }, 2000);
        }
        setIsConnecting(false);
      }
    } catch (error) {
      toast.error('Erro ao conectar wallet');
      setIsConnecting(false);
    }
  };

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

    const cryptoPrice = cryptos.find(c => c.symbol === crypto)?.priceNum || 0;
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

    const cryptoPrice = cryptos.find(c => c.symbol === crypto)?.priceNum || 0;
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
    <MobileLayout>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Exchange de Criptomoedas</h1>
        </div>

        {/* Busca de Pares de Trading */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="mr-2 h-5 w-5" />
              Buscar Par de Trading
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <Input
                placeholder="Buscar par (ex: BTC/BRL)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Select value={selectedPair} onValueChange={setSelectedPair}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Selecionar par" />
                </SelectTrigger>
                <SelectContent>
                  {tradingPairs
                    .filter(pair => pair.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((pair) => (
                      <SelectItem key={pair} value={pair}>{pair}</SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Conectar Carteira */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wallet className="mr-2 h-5 w-5" />
              {connectedWallet ? `Carteira Conectada - ${connectedWallet}` : 'Conectar Carteira'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {connectedWallet ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-green-600 font-semibold">✅ Conectado com {connectedWallet}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowBalance(!showBalance)}
                  >
                    {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg text-center">
                    <p className="text-sm text-gray-600">Real (BRL)</p>
                    <p className="font-bold">
                      {showBalance ? `R$ ${balance.BRL.toLocaleString('pt-BR', {minimumFractionDigits: 2})}` : '••••••'}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg text-center">
                    <p className="text-sm text-gray-600">Bitcoin (BTC)</p>
                    <p className="font-bold">
                      {showBalance ? `${balance.BTC.toFixed(6)}` : '••••••'}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg text-center">
                    <p className="text-sm text-gray-600">Ethereum (ETH)</p>
                    <p className="font-bold">
                      {showBalance ? `${balance.ETH.toFixed(4)}` : '••••••'}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg text-center">
                    <p className="text-sm text-gray-600">Binance Coin (BNB)</p>
                    <p className="font-bold">
                      {showBalance ? `${balance.BNB.toFixed(2)}` : '••••••'}
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    onClick={() => setConnectedWallet(null)}
                    variant="outline"
                    className="flex-1"
                  >
                    Desconectar
                  </Button>
                  <Button 
                    onClick={() => connectWallet(walletProviders.find(w => w.name === connectedWallet)!)}
                    disabled={isConnecting}
                    className="flex-1"
                  >
                    <RefreshCw className={`mr-2 h-4 w-4 ${isConnecting ? 'animate-spin' : ''}`} />
                    Sincronizar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {walletProviders.map((provider) => (
                  <Button
                    key={provider.name}
                    variant="outline"
                    onClick={() => connectWallet(provider)}
                    disabled={isConnecting}
                    className="h-16 flex flex-col items-center justify-center"
                  >
                    <span className="text-2xl mb-1">{provider.icon}</span>
                    <span className="text-sm">{provider.name}</span>
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Gráfico de Trading Avançado */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <BarChart3 className="mr-2 h-5 w-5" />
                Gráfico de Trading - {selectedPair}
              </div>
              <div className="flex space-x-2">
                <Select value={chartType} onValueChange={setChartType}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="line">Linha</SelectItem>
                    <SelectItem value="candle">Velas</SelectItem>
                    <SelectItem value="area">Área</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={timeframe} onValueChange={setTimeframe}>
                  <SelectTrigger className="w-[80px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1m">1m</SelectItem>
                    <SelectItem value="5m">5m</SelectItem>
                    <SelectItem value="15m">15m</SelectItem>
                    <SelectItem value="1h">1h</SelectItem>
                    <SelectItem value="4h">4h</SelectItem>
                    <SelectItem value="1d">1d</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'line' ? (
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
                      dataKey="close" 
                      stroke="#2563eb" 
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                ) : chartType === 'area' ? (
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR')}`, 'Preço']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="close" 
                      stroke="#2563eb" 
                      fill="#2563eb" 
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                ) : (
                  <ComposedChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => {
                        if (name === 'volume') return [Number(value).toLocaleString('pt-BR'), 'Volume'];
                        return [`R$ ${Number(value).toLocaleString('pt-BR')}`, name];
                      }}
                    />
                    <Bar dataKey="volume" fill="#8884d8" opacity={0.3} />
                    <Line type="monotone" dataKey="high" stroke="#10b981" strokeWidth={1} dot={false} />
                    <Line type="monotone" dataKey="low" stroke="#ef4444" strokeWidth={1} dot={false} />
                    <Line type="monotone" dataKey="close" stroke="#2563eb" strokeWidth={2} dot={false} />
                  </ComposedChart>
                )}
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        {/* Mesa de Trading */}
        <Card>
          <CardHeader>
            <CardTitle>Mercado de Criptomoedas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Input
                placeholder="Buscar por nome ou símbolo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Moeda</th>
                    <th className="text-right p-2">Preço</th>
                    <th className="text-right p-2">24h %</th>
                    <th className="text-right p-2">Alta 24h</th>
                    <th className="text-right p-2">Baixa 24h</th>
                    <th className="text-center p-2">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {cryptos
                    .filter(crypto => 
                      crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((crypto) => (
                      <tr key={crypto.symbol} className="border-b hover:bg-gray-50">
                        <td className="p-2">
                          <div className="flex items-center space-x-3">
                            <crypto.icon className="h-8 w-8 text-orange-500" />
                            <div>
                              <p className="font-semibold">{crypto.symbol}</p>
                              <p className="text-sm text-gray-600">{crypto.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="text-right p-2 font-semibold">{crypto.price}</td>
                        <td className={`text-right p-2 ${crypto.changeNum >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          <div className="flex items-center justify-end">
                            {crypto.changeNum >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                            <span>{crypto.change}</span>
                          </div>
                        </td>
                        <td className="text-right p-2 text-sm">R$ {crypto.high24h.toLocaleString('pt-BR')}</td>
                        <td className="text-right p-2 text-sm">R$ {crypto.low24h.toLocaleString('pt-BR')}</td>
                        <td className="text-center p-2">
                          <Button 
                            size="sm" 
                            onClick={() => setSelectedPair(`${crypto.symbol}/BRL`)}
                            className="bg-gradient-to-r from-[#001B3A] to-[#003F5C]"
                          >
                            <Zap className="w-3 h-3 mr-1" />
                            Trade
                          </Button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Painel de Trading */}
        {connectedWallet && (
          <Card>
            <CardHeader>
              <CardTitle>Painel de Trading - {selectedPair}</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="buy" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="buy" className="text-green-600">Comprar</TabsTrigger>
                  <TabsTrigger value="sell" className="text-red-600">Vender</TabsTrigger>
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
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => setBuyAmount((balance.BRL * 0.25).toString())}
                        >
                          25%
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => setBuyAmount((balance.BRL * 0.5).toString())}
                        >
                          50%
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => setBuyAmount((balance.BRL * 0.75).toString())}
                        >
                          75%
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => setBuyAmount(balance.BRL.toString())}
                        >
                          100%
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-medium">Resumo da Ordem</label>
                      <div className="p-3 bg-gray-50 rounded-lg space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Par:</span>
                          <span>{selectedPair}</span>
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
                        onClick={() => handleBuy(selectedPair.split('/')[0])}
                        className="w-full bg-green-600 hover:bg-green-700"
                        disabled={!buyAmount || parseFloat(buyAmount) <= 0}
                      >
                        Comprar {selectedPair.split('/')[0]}
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="sell" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <label className="text-sm font-medium">Quantidade de {selectedPair.split('/')[0]}</label>
                      <Input
                        type="number"
                        placeholder="0,000000"
                        value={sellAmount}
                        onChange={(e) => setSellAmount(e.target.value)}
                      />
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => {
                            const symbol = selectedPair.split('/')[0];
                            const available = balance[symbol as keyof typeof balance] as number || 0;
                            setSellAmount((available * 0.25).toString());
                          }}
                        >
                          25%
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => {
                            const symbol = selectedPair.split('/')[0];
                            const available = balance[symbol as keyof typeof balance] as number || 0;
                            setSellAmount((available * 0.5).toString());
                          }}
                        >
                          50%
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => {
                            const symbol = selectedPair.split('/')[0];
                            const available = balance[symbol as keyof typeof balance] as number || 0;
                            setSellAmount((available * 0.75).toString());
                          }}
                        >
                          75%
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => {
                            const symbol = selectedPair.split('/')[0];
                            const available = balance[symbol as keyof typeof balance] as number || 0;
                            setSellAmount(available.toString());
                          }}
                        >
                          100%
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-medium">Resumo da Ordem</label>
                      <div className="p-3 bg-gray-50 rounded-lg space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Par:</span>
                          <span>{selectedPair}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Taxa (0.2%):</span>
                          <span>R$ {sellAmount ? ((parseFloat(sellAmount) * (cryptos.find(c => c.symbol === selectedPair.split('/')[0])?.priceNum || 0)) * 0.002).toFixed(2) : '0,00'}</span>
                        </div>
                        <div className="border-t pt-2 flex justify-between font-semibold">
                          <span>Total:</span>
                          <span>R$ {sellAmount ? ((parseFloat(sellAmount) * (cryptos.find(c => c.symbol === selectedPair.split('/')[0])?.priceNum || 0)) * 0.998).toFixed(2) : '0,00'}</span>
                        </div>
                      </div>
                      <Button 
                        onClick={() => handleSell(selectedPair.split('/')[0])}
                        className="w-full bg-red-600 hover:bg-red-700"
                        disabled={!sellAmount || parseFloat(sellAmount) <= 0}
                      >
                        Vender {selectedPair.split('/')[0]}
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}

        {/* Aviso sobre Taxa */}
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-yellow-800 font-semibold">
                  Taxa de Transação: 0.2%
                </p>
                <p className="text-xs text-yellow-700">
                  Taxa cobrada sobre o valor de cada operação. Spreads competitivos garantidos.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MobileLayout>
  );
};

export default Cripto;



import React, { useState } from 'react';
import { ArrowLeft, Wallet, Search, TrendingUp, Bitcoin, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import MobileLayout from '@/components/MobileLayout';

const Cripto = () => {
  const navigate = useNavigate();
  const [connectedWallet, setConnectedWallet] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const cryptos = [
    { symbol: 'BTC', name: 'Bitcoin', price: 'R$ 295.000,00', change: '+2.5%', icon: Bitcoin },
    { symbol: 'ETH', name: 'Ethereum', price: 'R$ 12.500,00', change: '+1.8%', icon: DollarSign },
    { symbol: 'BNB', name: 'Binance Coin', price: 'R$ 1.250,00', change: '-0.5%', icon: TrendingUp },
  ];

  const walletProviders = [
    'MetaMask', 'Trust Wallet', 'Binance Wallet', 'Coinbase Wallet'
  ];

  const connectWallet = (provider: string) => {
    setConnectedWallet(provider);
    // Aqui seria implementada a integração real com a carteira
  };

  return (
    <MobileLayout>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Criptomoedas</h1>
        </div>

        {/* Conectar Carteira */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wallet className="mr-2 h-5 w-5" />
              {connectedWallet ? 'Carteira Conectada' : 'Conectar Carteira'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {connectedWallet ? (
              <div className="space-y-4">
                <p className="text-green-600">Conectado com {connectedWallet}</p>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Saldo disponível</p>
                  <p className="text-2xl font-bold">R$ 0,00</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {walletProviders.map((provider) => (
                  <Button
                    key={provider}
                    variant="outline"
                    onClick={() => connectWallet(provider)}
                    className="h-12"
                  >
                    {provider}
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Buscar Moedas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="mr-2 h-5 w-5" />
              Buscar Criptomoedas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Buscar por nome ou símbolo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-4"
            />
            
            <div className="space-y-3">
              {cryptos
                .filter(crypto => 
                  crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((crypto) => (
                  <div key={crypto.symbol} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <crypto.icon className="h-8 w-8 text-orange-500" />
                      <div>
                        <p className="font-semibold">{crypto.symbol}</p>
                        <p className="text-sm text-gray-600">{crypto.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{crypto.price}</p>
                      <p className={`text-sm ${crypto.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                        {crypto.change}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Aviso sobre Taxa */}
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <p className="text-sm text-yellow-800">
              <strong>Taxa de Transação:</strong> 0.2% sobre o valor da operação será cobrado em cada transação.
            </p>
          </CardContent>
        </Card>
      </div>
    </MobileLayout>
  );
};

export default Cripto;


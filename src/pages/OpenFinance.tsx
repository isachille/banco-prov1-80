
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, CheckCircle, Link, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const OpenFinance = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [connectedBanks, setConnectedBanks] = useState([]);
  const [isConnecting, setIsConnecting] = useState(false);

  const mockBanks = [
    { name: 'Nubank', saldo: 1250.30, logo: '🟣' },
    { name: 'Itaú', saldo: 3400.50, logo: '🟠' },
    { name: 'Bradesco', saldo: 890.75, logo: '🔴' }
  ];

  const handleConnect = async () => {
    setIsConnecting(true);
    
    // Simular autorização Open Finance
    setTimeout(() => {
      setConnectedBanks(mockBanks);
      setIsConnected(true);
      setIsConnecting(false);
      toast({
        title: "Contas conectadas!",
        description: "Suas contas foram conectadas com sucesso via Open Finance",
      });
    }, 3000);
  };

  const totalBalance = connectedBanks.reduce((total, bank) => total + bank.saldo, 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-[#0057FF] text-white p-6">
        <div className="flex items-center space-x-4 mb-4">
          <button
            onClick={() => navigate('/home')}
            className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">Open Finance</h1>
        </div>
      </div>

      <div className="p-6 -mt-4">
        {!isConnected ? (
          <>
            {/* Explicação */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-foreground">
                  <Link className="w-6 h-6 text-[#0057FF]" />
                  <span>Conecte suas contas</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Com o Open Finance, você pode visualizar todas as suas contas bancárias 
                  em um só lugar, de forma segura e autorizada.
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-foreground">Conexão segura e criptografada</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-foreground">Autorização controlada por você</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-foreground">Compatível com Open Finance Brasil</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Segurança */}
            <Card className="mb-6 border-green-200 dark:border-green-800">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Shield className="w-8 h-8 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-foreground">100% Seguro</h3>
                    <p className="text-sm text-muted-foreground">
                      Regulamentado pelo Banco Central do Brasil
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={handleConnect}
              disabled={isConnecting}
              className="w-full bg-[#0057FF] hover:bg-[#0057FF]/90 text-white py-6 text-lg"
            >
              {isConnecting ? 'Conectando...' : 'Autorizar Conexão'}
            </Button>
          </>
        ) : (
          <>
            {/* Saldo Total */}
            <Card className="mb-6 bg-gradient-to-r from-[#0057FF] to-blue-600 text-white">
              <CardContent className="p-6">
                <h2 className="text-sm opacity-90 mb-2">Saldo Total Agregado</h2>
                <p className="text-3xl font-bold">
                  R$ {(2500.45 + totalBalance).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-sm opacity-90 mt-2">Incluindo Banco Pro + contas conectadas</p>
              </CardContent>
            </Card>

            {/* Bancos Conectados */}
            <div className="mb-6">
              <h2 className="text-lg font-bold text-foreground mb-4">Contas Conectadas</h2>
              <div className="space-y-3">
                {connectedBanks.map((bank, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{bank.logo}</span>
                          <div>
                            <h3 className="font-semibold text-foreground">{bank.name}</h3>
                            <p className="text-sm text-muted-foreground">Conta corrente</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-foreground">
                            R$ {bank.saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </p>
                          <p className="text-xs text-green-600">Atualizado agora</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Última atualização */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Última atualização</span>
                  <span className="text-sm font-medium text-foreground">Agora há pouco</span>
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={() => navigate('/home')}
              variant="outline"
              className="w-full mt-6"
            >
              Voltar ao Início
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default OpenFinance;

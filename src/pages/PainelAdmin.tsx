
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Wallet, PiggyBank, Activity, Building, Globe, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const PainelAdmin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const adminSections = [
    { id: 'overview', label: 'Visão Geral', icon: Activity },
    { id: 'subcontas', label: 'Controle de Subcontas', icon: Users },
    { id: 'carteira', label: 'Carteira-Mãe', icon: Wallet },
    { id: 'cofrinho', label: 'Alocação Cofrinho', icon: PiggyBank },
    { id: 'whitelabel', label: 'White Label', icon: Building },
    { id: 'web3', label: 'Integração Web3', icon: Globe },
  ];

  const mockData = {
    totalUsers: 1247,
    totalBalance: 2850000,
    pendingAllocations: 5,
    activeSubaccounts: 23,
    monthlyTransactions: 15678
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockData.totalUsers.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+12% em relação ao mês passado</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ {(mockData.totalBalance / 1000000).toFixed(1)}M</div>
                <p className="text-xs text-muted-foreground">Carteira-mãe + Subcontas</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Alocações Pendentes</CardTitle>
                <PiggyBank className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockData.pendingAllocations}</div>
                <p className="text-xs text-muted-foreground">Investimentos Cofrinho</p>
              </CardContent>
            </Card>
          </div>
        );

      case 'subcontas':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Controle de Subcontas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'João Silva', email: 'joao@email.com', balance: 15000, status: 'Ativa' },
                  { name: 'Maria Santos', email: 'maria@email.com', balance: 8500, status: 'Bloqueada' },
                  { name: 'Pedro Costa', email: 'pedro@email.com', balance: 22000, status: 'Em Análise' },
                ].map((user, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{user.name}</h4>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">R$ {user.balance.toLocaleString()}</p>
                      <Badge variant={user.status === 'Ativa' ? 'default' : user.status === 'Bloqueada' ? 'destructive' : 'secondary'}>
                        {user.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case 'carteira':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Carteira-Mãe</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
                  <h3 className="text-3xl font-bold text-[#0057FF]">R$ 2.850.000,00</h3>
                  <p className="text-muted-foreground">Saldo total disponível</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium">Entradas (30 dias)</h4>
                    <p className="text-2xl font-bold text-green-600">R$ 485.000</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium">Saídas (30 dias)</h4>
                    <p className="text-2xl font-bold text-red-600">R$ 352.000</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 'cofrinho':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Alocação de Investimentos - Cofrinho</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { user: 'Ana Lima', amount: 5000, period: '6 meses', allocation: 'Pendente' },
                  { user: 'Carlos Souza', amount: 12000, period: '12 meses', allocation: 'Energia Solar' },
                  { user: 'Fernanda Costa', amount: 8000, period: '3 meses', allocation: 'Criptoativos' },
                ].map((investment, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{investment.user}</h4>
                      <p className="text-sm text-muted-foreground">R$ {investment.amount.toLocaleString()} • {investment.period}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={investment.allocation === 'Pendente' ? 'secondary' : 'default'}>
                        {investment.allocation}
                      </Badge>
                      {investment.allocation === 'Pendente' && (
                        <Button size="sm" className="ml-2">Alocar</Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case 'whitelabel':
        return (
          <Card>
            <CardHeader>
              <CardTitle>White Label - Criação de Novos Bancos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button className="w-full bg-[#0057FF] hover:bg-[#0047CC]">
                  <Building className="w-4 h-4 mr-2" />
                  Criar Novo Banco
                </Button>
                
                <div className="space-y-3">
                  <h4 className="font-medium">Bancos Ativos</h4>
                  {[
                    { name: 'Banco Empresarial Plus', users: 156, status: 'Ativo' },
                    { name: 'Fintech Jovem', users: 89, status: 'Ativo' },
                    { name: 'Banco Rural Pro', users: 34, status: 'Em Configuração' },
                  ].map((bank, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <h5 className="font-medium">{bank.name}</h5>
                        <p className="text-sm text-muted-foreground">{bank.users} usuários</p>
                      </div>
                      <Badge variant={bank.status === 'Ativo' ? 'default' : 'secondary'}>
                        {bank.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 'web3':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Integração Web3 e Controle Global</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg">
                  <h4 className="font-medium mb-2">Status da Blockchain</h4>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Conectado à rede Ethereum</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 border rounded">
                    <h5 className="font-medium">Carteiras Cripto</h5>
                    <p className="text-2xl font-bold">847</p>
                  </div>
                  <div className="p-3 border rounded">
                    <h5 className="font-medium">Transações DeFi</h5>
                    <p className="text-2xl font-bold">1.2K</p>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full">
                  <Zap className="w-4 h-4 mr-2" />
                  Configurar Smart Contracts
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-[#0057FF] text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/login')}
              className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Painel Administrativo</h1>
              <p className="text-blue-100">Controle total do Banco Pro</p>
            </div>
          </div>
          <img 
            src="/lovable-uploads/4712549c-a705-4aad-8498-4702dc3cdd8f.png" 
            alt="Banco Pro" 
            className="h-12 w-auto"
          />
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-card border-r min-h-screen p-4">
          <nav className="space-y-2">
            {adminSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveTab(section.id)}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  activeTab === section.id
                    ? 'bg-[#0057FF] text-white'
                    : 'hover:bg-muted'
                }`}
              >
                <section.icon className="w-5 h-5" />
                <span className="font-medium">{section.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default PainelAdmin;


import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useUserStatus } from '@/hooks/useUserStatus';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, Users, Settings, BarChart3, Calculator, FileText, Headphones, CreditCard, PiggyBank, TrendingUp, Zap, Send, QrCode, Shield } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from 'sonner';

const Home = () => {
  const navigate = useNavigate();
  const [nomeUsuario, setNomeUsuario] = useState<string | null>(null);
  const { status, loading, userData } = useUserStatus(null);

  useEffect(() => {
    const fetchUserName = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setNomeUsuario(user.email);
      }
    };

    fetchUserName();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Erro ao fazer logout.');
    } else {
      navigate('/login');
    }
  };

  const isAdminUser = userData?.role && ['admin', 'dono', 'gerente', 'analista'].includes(userData.role);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#001B3A] to-[#003F5C] text-white p-6">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">Olá, {nomeUsuario || 'Usuário'}!</h1>
              <p className="text-blue-100">Bem-vindo ao Banco Pro</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {isAdminUser && (
              <Button 
                variant="outline" 
                className="text-white border-white hover:bg-white hover:text-[#001B3A]"
                onClick={() => navigate('/painel-admin')}
              >
                <Shield className="mr-2 h-4 w-4" />
                Painel Admin
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <Settings className="h-4 w-4" />
                  <span className="sr-only">Abrir menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto p-6">
        {/* Status do Usuário */}
        {loading ? (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Status da Conta</CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-[200px]" />
            </CardContent>
          </Card>
        ) : status ? (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Status da Conta</CardTitle>
            </CardHeader>
            <CardContent>
              {status === 'pendente' && (
                <p className="text-yellow-500">Sua conta está pendente de aprovação.</p>
              )}
              {status === 'ativo' && (
                <p className="text-green-500">Sua conta está ativa!</p>
              )}
              {status === 'recusado' && (
                <p className="text-red-500">Sua conta foi recusada.</p>
              )}
            </CardContent>
          </Card>
        ) : null}

        {/* Ações Bancárias Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate('/transferir')}
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <Send className="mr-2 h-5 w-5 text-blue-600" />
                Transferir
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Envie dinheiro para outras contas
              </p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate('/pix')}
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <QrCode className="mr-2 h-5 w-5 text-green-600" />
                PIX
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Pagamentos instantâneos
              </p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate('/pagar')}
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <Zap className="mr-2 h-5 w-5 text-orange-600" />
                Pagar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Boletos e contas
              </p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate('/cartoes')}
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <CreditCard className="mr-2 h-5 w-5 text-purple-600" />
                Cartões
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Gerencie seus cartões
              </p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate('/cofrinho')}
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <PiggyBank className="mr-2 h-5 w-5 text-pink-600" />
                Cofrinho
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Economize para seus objetivos
              </p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate('/investimentos')}
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <TrendingUp className="mr-2 h-5 w-5 text-emerald-600" />
                Investimentos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Faça seu dinheiro render
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Seção de Financiamento */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Financiamento Veicular</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate('/simulacao')}
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <Calculator className="mr-2 h-5 w-5 text-green-600" />
                  Simular Financiamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Simule seu financiamento veicular e gere uma proposta
                </p>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate('/propostas')}
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <FileText className="mr-2 h-5 w-5 text-blue-600" />
                  Minhas Propostas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Visualize o histórico das suas propostas de financiamento
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Painel do Operador (apenas para operadores) */}
        {userData?.role === 'operador' && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Área do Operador</h2>
            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate('/operador')}
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <Headphones className="mr-2 h-5 w-5 text-orange-600" />
                  Painel Operador
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Gerencie seus clientes e propostas atribuídas
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

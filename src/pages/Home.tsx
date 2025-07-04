import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useUserStatus } from '@/hooks/useUserStatus';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, Users, Settings, BarChart3, Calculator, FileText, Headphones } from 'lucide-react';
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

          {/* Ações Principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

            {/* Mostrar painel do operador se for operador */}
            {userData?.role === 'operador' && (
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
            )}

            {/* Ações Administrativas (visível apenas para admins) */}
            {userData?.role === 'admin' && (
              <>
                <Card
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => navigate('/admin/users')}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-lg">
                      <Users className="mr-2 h-5 w-5 text-blue-600" />
                      Gerenciar Usuários
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Visualizar, editar e gerenciar todos os usuários do sistema
                    </p>
                  </CardContent>
                </Card>

                <Card
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => navigate('/admin/relatorios')}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-lg">
                      <BarChart3 className="mr-2 h-5 w-5 text-purple-600" />
                      Relatórios
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Visualizar relatórios e estatísticas do sistema
                    </p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
      </div>
    </div>
  );
};

export default Home;

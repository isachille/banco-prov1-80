
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, CheckCircle, XCircle, Clock, Search, Shield, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface Usuario {
  id: string;
  email: string;
  nome: string;
  nome_completo: string;
  cpf: string;
  cpf_cnpj: string;
  telefone: string;
  tipo: string;
  role: string;
  status: string;
  created_at: string;
}

const PainelAdmin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [filtro, setFiltro] = useState('');
  const [updatingUsers, setUpdatingUsers] = useState<Set<string>>(new Set());

  // Verificar permissão de acesso
  useEffect(() => {
    const checkUserPermission = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      if (!userData || !['admin', 'dono'].includes(userData.role)) {
        toast.error('Acesso negado. Você não tem permissão para acessar esta área.');
        navigate('/home');
        return;
      }
    };

    checkUserPermission();
  }, [navigate]);

  // Buscar usuários pendentes com refetch automático
  const { data: usuariosPendentes = [], isLoading, refetch } = useQuery({
    queryKey: ['usuarios_pendentes'],
    queryFn: async () => {
      console.log('Carregando usuários pendentes...');
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('status', 'pendente')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar usuários pendentes:', error);
        throw error;
      }

      console.log('Usuários pendentes carregados:', data);
      return data as Usuario[];
    },
    refetchInterval: 5000, // Atualizar a cada 5 segundos
  });

  // Filtrar usuários baseado no termo de busca
  const usuariosFiltrados = usuariosPendentes.filter(usuario => {
    if (filtro.trim() === '') return true;
    
    const termoBusca = filtro.toLowerCase();
    return (
      usuario.nome_completo?.toLowerCase().includes(termoBusca) ||
      usuario.email?.toLowerCase().includes(termoBusca) ||
      usuario.cpf_cnpj?.includes(filtro.replace(/\D/g, ''))
    );
  });

  const ativarUsuario = async (userId: string) => {
    if (updatingUsers.has(userId)) return;
    
    setUpdatingUsers(prev => new Set(prev).add(userId));
    
    try {
      console.log('Ativando usuário:', userId);
      const { error } = await supabase
        .from('users')
        .update({ status: 'ativo' })
        .eq('id', userId);

      if (error) {
        console.error('Erro ao ativar usuário:', error);
        toast.error('Erro ao ativar conta');
        return;
      }

      toast.success('Conta ativada com sucesso!');
      
      // Invalidar e refetch da query para atualizar a lista
      queryClient.invalidateQueries({ queryKey: ['usuarios_pendentes'] });
      
      // Refetch imediato
      setTimeout(() => {
        refetch();
      }, 1000);
      
    } catch (error) {
      console.error('Erro ao ativar usuário:', error);
      toast.error('Erro ao ativar conta');
    } finally {
      setUpdatingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  const alterarPermissao = async (userId: string, novaRole: string) => {
    if (updatingUsers.has(userId)) return;
    
    setUpdatingUsers(prev => new Set(prev).add(userId));
    
    try {
      console.log('Alterando permissão do usuário:', userId, 'para:', novaRole);
      const { error } = await supabase
        .from('users')
        .update({ role: novaRole })
        .eq('id', userId);

      if (error) {
        console.error('Erro ao alterar permissão:', error);
        toast.error('Erro ao alterar permissão');
        return;
      }

      toast.success(`Permissão atualizada para ${novaRole}`);
      
      // Invalidar e refetch da query para atualizar a lista
      queryClient.invalidateQueries({ queryKey: ['usuarios_pendentes'] });
      
      // Refetch imediato
      setTimeout(() => {
        refetch();
      }, 1000);
      
    } catch (error) {
      console.error('Erro ao alterar permissão:', error);
      toast.error('Erro ao alterar permissão');
    } finally {
      setUpdatingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  const formatarDocumento = (documento: string, tipo: string) => {
    if (!documento) return 'Não informado';
    
    if (tipo === 'PF' && documento.length === 11) {
      return documento.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (tipo === 'PJ' && documento.length === 14) {
      return documento.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    return documento;
  };

  const formatarTelefone = (telefone: string) => {
    if (!telefone) return 'Não informado';
    if (telefone.length === 11) {
      return telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return telefone;
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'dono': return 'bg-purple-100 text-purple-800';
      case 'admin': return 'bg-red-100 text-red-800';
      case 'gerente': return 'bg-blue-100 text-blue-800';
      case 'analista': return 'bg-green-100 text-green-800';
      case 'usuario': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#001B3A] to-[#003F5C] text-white p-6">
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
              <p className="text-blue-100">Gerenciar aprovações de usuários</p>
            </div>
          </div>
          <img 
            src="/lovable-uploads/4712549c-a705-4aad-8498-4702dc3cdd8f.png" 
            alt="Banco Pro" 
            className="h-12 w-auto"
          />
        </div>
      </div>

      <div className="container mx-auto p-6">
        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuários Pendentes</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usuariosPendentes.length}</div>
              <p className="text-xs text-muted-foreground">Aguardando aprovação</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Filtrados</CardTitle>
              <Search className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usuariosFiltrados.length}</div>
              <p className="text-xs text-muted-foreground">Resultado da busca</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Online</div>
              <p className="text-xs text-muted-foreground">Atualização automática ativa</p>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Usuários Pendentes */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Usuários Aguardando Aprovação</CardTitle>
                <p className="text-muted-foreground">
                  {usuariosFiltrados.length === 0 && filtro 
                    ? 'Nenhum usuário encontrado com os critérios de busca' 
                    : usuariosFiltrados.length === 0
                    ? 'Nenhum usuário pendente no momento'
                    : `${usuariosFiltrados.length} usuário(s) ${filtro ? 'encontrado(s)' : 'aguardando aprovação'}`
                  }
                </p>
              </div>
            </div>
            {/* Campo de busca */}
            <div className="flex items-center space-x-2 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por nome, email ou documento..."
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                  className="pl-10"
                />
              </div>
              {filtro && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFiltro('')}
                >
                  Limpar
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0057FF] mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Carregando usuários...</p>
              </div>
            ) : usuariosFiltrados.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {filtro ? 'Nenhum usuário encontrado' : 'Nenhum usuário pendente no momento'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {usuariosFiltrados.map((usuario) => (
                  <div key={usuario.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium">
                              {usuario.nome_completo || 'Nome não informado'}
                            </h4>
                            <Badge variant="secondary">
                              {usuario.tipo}
                            </Badge>
                            <Badge className={getRoleBadgeColor(usuario.role)}>
                              {usuario.role}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{usuario.email}</p>
                          <div className="flex space-x-4 text-xs text-muted-foreground mt-1">
                            <span>
                              {usuario.tipo === 'PF' ? 'CPF' : 'CNPJ'}: {formatarDocumento(usuario.cpf_cnpj, usuario.tipo)}
                            </span>
                            <span>Tel: {formatarTelefone(usuario.telefone)}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Cadastrado em: {new Date(usuario.created_at).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        Pendente
                      </Badge>
                      
                      {/* Dropdown para alterar permissão */}
                      <Select
                        value={usuario.role}
                        onValueChange={(value) => alterarPermissao(usuario.id, value)}
                        disabled={updatingUsers.has(usuario.id)}
                      >
                        <SelectTrigger className="w-28">
                          <Shield className="w-4 h-4 mr-1" />
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dono">Dono</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="gerente">Gerente</SelectItem>
                          <SelectItem value="analista">Analista</SelectItem>
                          <SelectItem value="usuario">Usuário</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600 border-green-600 hover:bg-green-50"
                        onClick={() => ativarUsuario(usuario.id)}
                        disabled={updatingUsers.has(usuario.id)}
                      >
                        {updatingUsers.has(usuario.id) ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                        ) : (
                          <>
                            <UserCheck className="w-4 h-4 mr-1" />
                            Ativar Conta
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PainelAdmin;

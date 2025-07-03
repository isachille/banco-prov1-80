
import React, { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, UserCheck, Settings, Search, Edit, Save, X, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface User {
  id: string;
  email: string;
  nome_completo: string;
  cpf_cnpj: string;
  telefone: string;
  endereco: string;
  cep: string;
  cidade: string;
  estado: string;
  nome_mae: string;
  data_nascimento: string;
  status: string;
  role: string;
  tipo: string;
  created_at: string;
  updated_at: string;
}

const AdminUsers = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [updatingUsers, setUpdatingUsers] = useState<Set<string>>(new Set());
  const [filtro, setFiltro] = useState('');
  const [activeTab, setActiveTab] = useState('pendentes');
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<User>>({});

  // Fetch usuários pendentes com auto-refresh de 30s
  const { data: usuariosPendentes = [], isLoading: loadingPendentes, refetch: refetchPendentes } = useQuery({
    queryKey: ['usuarios_pendentes'],
    queryFn: async () => {
      console.log('Carregando usuários pendentes...');
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('status', 'pendente')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as User[];
    },
    refetchInterval: 30000, // 30 segundos
  });

  // Fetch usuários ativos
  const { data: usuariosAtivos = [], isLoading: loadingAtivos, refetch: refetchAtivos } = useQuery({
    queryKey: ['usuarios_ativos'],
    queryFn: async () => {
      console.log('Carregando usuários ativos...');
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('status', 'ativo')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as User[];
    },
    refetchInterval: 30000, // 30 segundos
  });

  // Fetch todos os usuários
  const { data: todosUsuarios = [], isLoading: loadingTodos, refetch: refetchTodos } = useQuery({
    queryKey: ['todos_usuarios'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as User[];
    },
    refetchInterval: 30000,
  });

  const handleActivateUser = async (userId: string) => {
    if (updatingUsers.has(userId)) return;
    
    setUpdatingUsers(prev => new Set(prev).add(userId));
    
    try {
      const { error } = await supabase
        .from('users')
        .update({ 
          status: 'ativo',
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;
      
      toast.success('Conta ativada com sucesso!');
      
      // Invalidar todas as queries para atualizar
      queryClient.invalidateQueries({ queryKey: ['usuarios_pendentes'] });
      queryClient.invalidateQueries({ queryKey: ['usuarios_ativos'] });
      queryClient.invalidateQueries({ queryKey: ['todos_usuarios'] });
      
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

  const handleUpdateRole = async (userId: string, newRole: string) => {
    if (updatingUsers.has(userId)) return;
    
    setUpdatingUsers(prev => new Set(prev).add(userId));
    
    try {
      const { error } = await supabase
        .from('users')
        .update({ 
          role: newRole,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;
      
      toast.success('Nível de acesso atualizado!');
      
      // Refetch todas as queries
      refetchPendentes();
      refetchAtivos();
      refetchTodos();
      
    } catch (error) {
      console.error('Erro ao atualizar role:', error);
      toast.error('Erro ao atualizar nível de acesso');
    } finally {
      setUpdatingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user.id);
    setEditData(user);
  };

  const handleSaveEdit = async () => {
    if (!editingUser || !editData) return;
    
    try {
      const { error } = await supabase
        .from('users')
        .update({
          ...editData,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingUser);

      if (error) throw error;
      
      toast.success('Dados atualizados com sucesso!');
      setEditingUser(null);
      setEditData({});
      
      // Refetch todas as queries
      refetchPendentes();
      refetchAtivos();
      refetchTodos();
      
    } catch (error) {
      console.error('Erro ao atualizar dados:', error);
      toast.error('Erro ao atualizar dados do usuário');
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditData({});
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo':
        return 'bg-green-100 text-green-800';
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'recusado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'dono':
        return 'bg-purple-100 text-purple-800';
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'gerente':
        return 'bg-blue-100 text-blue-800';
      case 'analista':
        return 'bg-green-100 text-green-800';
      case 'usuario':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  const filtrarUsuarios = (usuarios: User[]) => {
    if (filtro.trim() === '') return usuarios;
    
    const termoBusca = filtro.toLowerCase();
    return usuarios.filter(usuario => 
      usuario.nome_completo?.toLowerCase().includes(termoBusca) ||
      usuario.email?.toLowerCase().includes(termoBusca) ||
      usuario.cpf_cnpj?.includes(filtro.replace(/\D/g, ''))
    );
  };

  const renderUserCard = (user: User, showActions = true) => (
    <Card key={user.id} className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-lg">
                {editingUser === user.id ? (
                  <Input
                    value={editData.nome_completo || ''}
                    onChange={(e) => setEditData({...editData, nome_completo: e.target.value})}
                    className="text-lg font-semibold"
                  />
                ) : (
                  user.nome_completo || 'Nome não informado'
                )}
              </h4>
              <Badge className={getStatusColor(user.status)}>
                {user.status}
              </Badge>
              <Badge className={getRoleColor(user.role)}>
                {user.role}
              </Badge>
            </div>
            
            {showActions && (
              <div className="flex items-center gap-2">
                {editingUser === user.id ? (
                  <>
                    <Button size="sm" onClick={handleSaveEdit} className="bg-green-600 hover:bg-green-700">
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => handleEditUser(user)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Email:</strong> 
              {editingUser === user.id ? (
                <Input
                  value={editData.email || ''}
                  onChange={(e) => setEditData({...editData, email: e.target.value})}
                  className="mt-1"
                />
              ) : (
                <span className="ml-2">{user.email}</span>
              )}
            </div>
            
            <div>
              <strong>Telefone:</strong>
              {editingUser === user.id ? (
                <Input
                  value={editData.telefone || ''}
                  onChange={(e) => setEditData({...editData, telefone: e.target.value})}
                  className="mt-1"
                />
              ) : (
                <span className="ml-2">{user.telefone || 'Não informado'}</span>
              )}
            </div>
            
            <div>
              <strong>{user.tipo === 'PF' ? 'CPF' : 'CNPJ'}:</strong>
              {editingUser === user.id ? (
                <Input
                  value={editData.cpf_cnpj || ''}
                  onChange={(e) => setEditData({...editData, cpf_cnpj: e.target.value})}
                  className="mt-1"
                />
              ) : (
                <span className="ml-2">{formatarDocumento(user.cpf_cnpj, user.tipo)}</span>
              )}
            </div>
            
            <div>
              <strong>Nome da Mãe:</strong>
              {editingUser === user.id ? (
                <Input
                  value={editData.nome_mae || ''}
                  onChange={(e) => setEditData({...editData, nome_mae: e.target.value})}
                  className="mt-1"
                />
              ) : (
                <span className="ml-2">{user.nome_mae || 'Não informado'}</span>
              )}
            </div>
            
            <div className="md:col-span-2">
              <strong>Endereço:</strong>
              {editingUser === user.id ? (
                <Input
                  value={editData.endereco || ''}
                  onChange={(e) => setEditData({...editData, endereco: e.target.value})}
                  className="mt-1"
                />
              ) : (
                <span className="ml-2">{user.endereco || 'Não informado'}</span>
              )}
            </div>
          </div>

          {showActions && user.status === 'pendente' && (
            <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
              <Select
                value={user.role}
                onValueChange={(value) => handleUpdateRole(user.id, value)}
                disabled={updatingUsers.has(user.id)}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usuario">Usuário</SelectItem>
                  <SelectItem value="analista">Analista</SelectItem>
                  <SelectItem value="gerente">Gerente</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="dono">Dono</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                onClick={() => handleActivateUser(user.id)}
                disabled={updatingUsers.has(user.id)}
                className="bg-green-600 hover:bg-green-700 flex-1"
              >
                {updatingUsers.has(user.id) ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    <UserCheck className="h-4 w-4 mr-2" />
                    Ativar Conta
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gerenciamento de Usuários</h1>
          <p className="text-gray-600">Administre contas de usuários com atualização automática a cada 30s</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por nome, email ou documento..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="pl-10 w-80"
            />
          </div>
          {filtro && (
            <Button variant="outline" size="sm" onClick={() => setFiltro('')}>
              Limpar
            </Button>
          )}
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Pendentes</CardTitle>
            <UserCheck className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{usuariosPendentes.length}</div>
            <p className="text-xs text-muted-foreground">Aguardando aprovação</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{usuariosAtivos.length}</div>
            <p className="text-xs text-muted-foreground">Contas ativas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{todosUsuarios.length}</div>
            <p className="text-xs text-muted-foreground">Todas as contas</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs para diferentes visualizações */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pendentes">Pendentes ({usuariosPendentes.length})</TabsTrigger>
          <TabsTrigger value="ativos">Ativos ({usuariosAtivos.length})</TabsTrigger>
          <TabsTrigger value="todos">Todos ({todosUsuarios.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pendentes" className="space-y-4">
          {loadingPendentes ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0047AB] mx-auto"></div>
              <p className="mt-2">Carregando usuários pendentes...</p>
            </div>
          ) : filtrarUsuarios(usuariosPendentes).length === 0 ? (
            <div className="text-center py-8">
              <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {filtro ? 'Nenhum usuário encontrado' : 'Nenhum usuário pendente no momento'}
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filtrarUsuarios(usuariosPendentes).map(user => renderUserCard(user, true))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="ativos" className="space-y-4">
          {loadingAtivos ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0047AB] mx-auto"></div>
              <p className="mt-2">Carregando usuários ativos...</p>
            </div>
          ) : filtrarUsuarios(usuariosAtivos).length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {filtro ? 'Nenhum usuário encontrado' : 'Nenhum usuário ativo encontrado'}
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filtrarUsuarios(usuariosAtivos).map(user => renderUserCard(user, true))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="todos" className="space-y-4">
          {loadingTodos ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0047AB] mx-auto"></div>
              <p className="mt-2">Carregando todos os usuários...</p>
            </div>
          ) : filtrarUsuarios(todosUsuarios).length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {filtro ? 'Nenhum usuário encontrado' : 'Nenhum usuário encontrado'}
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filtrarUsuarios(todosUsuarios).map(user => renderUserCard(user, true))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminUsers;

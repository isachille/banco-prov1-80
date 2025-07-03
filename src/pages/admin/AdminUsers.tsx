
import React, { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, UserCheck, Settings, Edit, Save, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  status: string;
  role: string;
  nome_completo?: string;
  cpf?: string;
  cpf_cnpj?: string;
  nascimento?: string;
  mae?: string;
  profissao?: string;
  telefone?: string;
  endereco?: string;
  cep?: string;
  cidade?: string;
  estado?: string;
  created_at: string;
  criado_em?: string;
  is_admin?: boolean;
  nome?: string;
  tipo?: string;
}

const AdminUsers = () => {
  const navigate = useNavigate();
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [activeUsers, setActiveUsers] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<User>>({});

  const fetchUsers = async () => {
    try {
      // Buscar usuários pendentes
      const { data: pending, error: pendingError } = await supabase
        .from('users')
        .select('*')
        .eq('status', 'pendente')
        .order('created_at', { ascending: false });

      if (pendingError) throw pendingError;
      setPendingUsers(pending as User[] || []);

      // Buscar usuários ativos
      const { data: active, error: activeError } = await supabase
        .from('users')
        .select('*')
        .eq('status', 'ativo')
        .order('created_at', { ascending: false });

      if (activeError) throw activeError;
      setActiveUsers(active as User[] || []);

      // Buscar todos os usuários
      const { data: all, error: allError } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (allError) throw allError;
      setAllUsers(all as User[] || []);

    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      toast.error('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    
    // Auto-refresh a cada 30 segundos
    const interval = setInterval(fetchUsers, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleActivateUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ status: 'ativo' })
        .eq('id', userId);

      if (error) throw error;
      
      toast.success('Conta ativada com sucesso!');
      fetchUsers();
    } catch (error) {
      console.error('Erro ao ativar usuário:', error);
      toast.error('Erro ao ativar conta');
    }
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;
      
      toast.success('Nível de acesso atualizado!');
      fetchUsers();
    } catch (error) {
      console.error('Erro ao atualizar role:', error);
      toast.error('Erro ao atualizar nível de acesso');
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user.id);
    setEditData(user);
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;

    try {
      const { error } = await supabase
        .from('users')
        .update(editData)
        .eq('id', editingUser);

      if (error) throw error;
      
      toast.success('Dados atualizados com sucesso!');
      setEditingUser(null);
      setEditData({});
      fetchUsers();
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      toast.error('Erro ao salvar alterações');
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
      case 'gerente':
        return 'bg-blue-100 text-blue-800';
      case 'usuario':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderUserCard = (user: User, showActivateButton: boolean = false) => (
    <div key={user.id} className="border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="font-medium">{user.email}</span>
            <Badge className={getStatusColor(user.status)}>
              {user.status}
            </Badge>
            <Badge className={getRoleColor(user.role)}>
              {user.role}
            </Badge>
          </div>
          <p className="text-sm text-gray-500">ID: {user.id}</p>
          <p className="text-sm text-gray-500">
            Criado em: {new Date(user.created_at).toLocaleDateString('pt-BR')}
          </p>
        </div>
        <div className="flex gap-2">
          {editingUser === user.id ? (
            <>
              <Button size="sm" onClick={handleSaveEdit}>
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
      </div>

      {/* Informações editáveis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Nome Completo</label>
          {editingUser === user.id ? (
            <Input
              value={editData.nome_completo || ''}
              onChange={(e) => setEditData({...editData, nome_completo: e.target.value})}
            />
          ) : (
            <p className="text-sm">{user.nome_completo || 'Não informado'}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium">CPF/CNPJ</label>
          {editingUser === user.id ? (
            <Input
              value={editData.cpf_cnpj || editData.cpf || ''}
              onChange={(e) => setEditData({...editData, cpf_cnpj: e.target.value})}
            />
          ) : (
            <p className="text-sm">{user.cpf_cnpj || user.cpf || 'Não informado'}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium">Telefone</label>
          {editingUser === user.id ? (
            <Input
              value={editData.telefone || ''}
              onChange={(e) => setEditData({...editData, telefone: e.target.value})}
            />
          ) : (
            <p className="text-sm">{user.telefone || 'Não informado'}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium">Nome da Mãe</label>
          {editingUser === user.id ? (
            <Input
              value={editData.mae || ''}
              onChange={(e) => setEditData({...editData, mae: e.target.value})}
            />
          ) : (
            <p className="text-sm">{user.mae || 'Não informado'}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium">Profissão</label>
          {editingUser === user.id ? (
            <Input
              value={editData.profissao || ''}
              onChange={(e) => setEditData({...editData, profissao: e.target.value})}
            />
          ) : (
            <p className="text-sm">{user.profissao || 'Não informado'}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium">Cidade</label>
          {editingUser === user.id ? (
            <Input
              value={editData.cidade || ''}
              onChange={(e) => setEditData({...editData, cidade: e.target.value})}
            />
          ) : (
            <p className="text-sm">{user.cidade || 'Não informado'}</p>
          )}
        </div>
      </div>

      {/* Ações */}
      <div className="flex flex-col sm:flex-row gap-2">
        {showActivateButton && (
          <Button
            size="sm"
            onClick={() => handleActivateUser(user.id)}
            className="flex-1"
          >
            <UserCheck className="h-4 w-4 mr-2" />
            Ativar Conta
          </Button>
        )}

        <div className="flex items-center space-x-2 flex-1">
          <Settings className="h-4 w-4" />
          <Select
            value={user.role}
            onValueChange={(value) => handleUpdateRole(user.id, value)}
          >
            <SelectTrigger className="flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="usuario">Usuário</SelectItem>
              <SelectItem value="gerente">Gerente</SelectItem>
              <SelectItem value="dono">Dono</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Administração de Usuários</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-green-600">
            <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
            <span className="text-sm">Atualização automática (30s)</span>
          </div>
          <Button variant="outline" size="sm" onClick={fetchUsers}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{pendingUsers.length}</div>
            <p className="text-sm text-gray-600">Contas Pendentes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{activeUsers.length}</div>
            <p className="text-sm text-gray-600">Contas Ativas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{allUsers.length}</div>
            <p className="text-sm text-gray-600">Total de Contas</p>
          </CardContent>
        </Card>
      </div>

      {/* Usuários Pendentes */}
      <Card>
        <CardHeader>
          <CardTitle>Usuários Pendentes ({pendingUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {pendingUsers.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              Nenhum usuário pendente encontrado
            </p>
          ) : (
            <div className="space-y-4">
              {pendingUsers.map((user) => renderUserCard(user, true))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Usuários Ativos */}
      <Card>
        <CardHeader>
          <CardTitle>Usuários Ativos ({activeUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {activeUsers.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              Nenhum usuário ativo encontrado
            </p>
          ) : (
            <div className="space-y-4">
              {activeUsers.map((user) => renderUserCard(user, false))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers;

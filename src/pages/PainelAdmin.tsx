
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface Usuario {
  id: string;
  email: string;
  nome: string;
  cpf: string;
  telefone: string;
  created_at: string;
}

const PainelAdmin = () => {
  const navigate = useNavigate();
  const [usuariosPendentes, setUsuariosPendentes] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarUsuariosPendentes();
  }, []);

  const carregarUsuariosPendentes = async () => {
    try {
      console.log('Carregando usuários pendentes...');
      const { data, error } = await supabase
        .from('usuarios_pendentes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar usuários pendentes:', error);
        toast.error('Erro ao carregar usuários pendentes');
        return;
      }

      console.log('Usuários pendentes carregados:', data);
      setUsuariosPendentes(data || []);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      toast.error('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const aprovarUsuario = async (userId: string) => {
    try {
      console.log('Aprovando usuário:', userId);
      const { error } = await supabase
        .from('users')
        .update({ status: 'ativo' })
        .eq('id', userId);

      if (error) {
        console.error('Erro ao aprovar usuário:', error);
        toast.error('Erro ao aprovar usuário');
        return;
      }

      toast.success('Usuário aprovado com sucesso!');
      carregarUsuariosPendentes(); // Recarregar a lista
    } catch (error) {
      console.error('Erro ao aprovar usuário:', error);
      toast.error('Erro ao aprovar usuário');
    }
  };

  const recusarUsuario = async (userId: string) => {
    try {
      console.log('Recusando usuário:', userId);
      const { error } = await supabase
        .from('users')
        .update({ status: 'recusado' })
        .eq('id', userId);

      if (error) {
        console.error('Erro ao recusar usuário:', error);
        toast.error('Erro ao recusar usuário');
        return;
      }

      toast.success('Usuário recusado.');
      carregarUsuariosPendentes(); // Recarregar a lista
    } catch (error) {
      console.error('Erro ao recusar usuário:', error);
      toast.error('Erro ao recusar usuário');
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
              <CardTitle className="text-sm font-medium">Ações Disponíveis</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">Aprovar ou Recusar</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Online</div>
              <p className="text-xs text-muted-foreground">Sistema funcionando</p>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Usuários Pendentes */}
        <Card>
          <CardHeader>
            <CardTitle>Usuários Aguardando Aprovação</CardTitle>
            <p className="text-muted-foreground">
              {usuariosPendentes.length === 0 
                ? 'Nenhum usuário aguardando aprovação no momento' 
                : `${usuariosPendentes.length} usuário(s) aguardando aprovação`
              }
            </p>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0057FF] mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Carregando usuários...</p>
              </div>
            ) : usuariosPendentes.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhum usuário pendente no momento</p>
              </div>
            ) : (
              <div className="space-y-4">
                {usuariosPendentes.map((usuario) => (
                  <div key={usuario.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h4 className="font-medium">{usuario.nome || 'Nome não informado'}</h4>
                          <p className="text-sm text-muted-foreground">{usuario.email}</p>
                          <div className="flex space-x-4 text-xs text-muted-foreground mt-1">
                            <span>CPF: {usuario.cpf || 'Não informado'}</span>
                            <span>Tel: {usuario.telefone || 'Não informado'}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Cadastrado em: {new Date(usuario.created_at).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">Pendente</Badge>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600 border-green-600 hover:bg-green-50"
                        onClick={() => aprovarUsuario(usuario.id)}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Aprovar
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-600 hover:bg-red-50"
                        onClick={() => recusarUsuario(usuario.id)}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Recusar
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


import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Camera, Mail, Phone, Lock, Key, User, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const Perfil = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState({
    nome: '',
    nome_completo: '',
    email: '',
    telefone: '',
    cpf_cnpj: '',
    avatar: ''
  });

  const [isEditing, setIsEditing] = useState({
    nome: false,
    nome_completo: false,
    telefone: false
  });

  const [editValues, setEditValues] = useState({
    nome: '',
    nome_completo: '',
    telefone: ''
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      // Buscar dados do usuário na tabela users
      const { data: userProfile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Erro ao buscar perfil:', error);
        toast.error('Erro ao carregar dados do perfil');
        return;
      }

      if (userProfile) {
        const profileData = {
          nome: userProfile.nome || '',
          nome_completo: userProfile.nome_completo || '',
          email: userProfile.email || user.email || '',
          telefone: userProfile.telefone || '',
          cpf_cnpj: userProfile.cpf_cnpj || '',
          avatar: ''
        };
        
        setUserData(profileData);
        setEditValues({
          nome: profileData.nome,
          nome_completo: profileData.nome_completo,
          telefone: profileData.telefone
        });
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados do usuário');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (field: keyof typeof isEditing) => {
    if (isEditing[field]) {
      // Salvar as alterações
      setSaving(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase
          .from('users')
          .update({ [field]: editValues[field] })
          .eq('id', user.id);

        if (error) throw error;

        setUserData(prev => ({
          ...prev,
          [field]: editValues[field]
        }));

        toast.success(`${getFieldLabel(field)} atualizado com sucesso!`);
      } catch (error) {
        console.error('Erro ao atualizar:', error);
        toast.error('Erro ao atualizar dados');
      } finally {
        setSaving(false);
      }
    }

    setIsEditing(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const getFieldLabel = (field: string) => {
    switch (field) {
      case 'nome': return 'Nome';
      case 'nome_completo': return 'Nome completo';
      case 'telefone': return 'Telefone';
      default: return field;
    }
  };

  const handleInputChange = (field: keyof typeof editValues, value: string) => {
    setEditValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatTelefone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  const formatDocumento = (documento: string) => {
    if (!documento) return 'Não informado';
    
    if (documento.length === 11) {
      return documento.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (documento.length === 14) {
      return documento.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    return documento;
  };

  const handleChangePassword = () => {
    toast.info('Funcionalidade de alteração de senha em desenvolvimento');
  };

  const handleChangePIN = () => {
    toast.info('Funcionalidade de alteração de PIN em desenvolvimento');
  };

  const handleAvatarChange = () => {
    toast.info('Funcionalidade de upload de foto em desenvolvimento');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-blue-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0057FF]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-blue-900 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/configuracoes')}
            className="text-[#0057FF] hover:bg-blue-100"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-[#0057FF]">Meu Perfil</h1>
            <p className="text-muted-foreground">Gerencie suas informações pessoais</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-foreground">Informações Pessoais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={userData.avatar} />
                  <AvatarFallback className="text-2xl bg-[#0057FF] text-white">
                    {userData.nome_completo ? userData.nome_completo.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U'}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-[#0057FF] hover:bg-[#0047CC]"
                  onClick={handleAvatarChange}
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">Clique no ícone para alterar sua foto</p>
            </div>

            {/* Informações Pessoais */}
            <div className="space-y-4">
              {/* Nome */}
              <div className="flex items-center space-x-4">
                <User className="w-5 h-5 text-muted-foreground" />
                <div className="flex-1">
                  <Label htmlFor="nome">Nome</Label>
                  {isEditing.nome ? (
                    <Input
                      id="nome"
                      value={editValues.nome}
                      onChange={(e) => handleInputChange('nome', e.target.value)}
                      className="mt-1"
                      disabled={saving}
                    />
                  ) : (
                    <p className="text-foreground font-medium mt-1">{userData.nome || 'Não informado'}</p>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit('nome')}
                  disabled={saving}
                >
                  {isEditing.nome ? 'Salvar' : 'Editar'}
                </Button>
              </div>

              {/* Nome Completo */}
              <div className="flex items-center space-x-4">
                <User className="w-5 h-5 text-muted-foreground" />
                <div className="flex-1">
                  <Label htmlFor="nome_completo">Nome Completo</Label>
                  {isEditing.nome_completo ? (
                    <Input
                      id="nome_completo"
                      value={editValues.nome_completo}
                      onChange={(e) => handleInputChange('nome_completo', e.target.value)}
                      className="mt-1"
                      disabled={saving}
                    />
                  ) : (
                    <p className="text-foreground font-medium mt-1">{userData.nome_completo || 'Não informado'}</p>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit('nome_completo')}
                  disabled={saving}
                >
                  {isEditing.nome_completo ? 'Salvar' : 'Editar'}
                </Button>
              </div>

              {/* Email (apenas leitura) */}
              <div className="flex items-center space-x-4">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div className="flex-1">
                  <Label htmlFor="email">E-mail</Label>
                  <p className="text-foreground font-medium mt-1">{userData.email}</p>
                  <p className="text-xs text-muted-foreground">Email não pode ser alterado</p>
                </div>
              </div>

              {/* Telefone */}
              <div className="flex items-center space-x-4">
                <Phone className="w-5 h-5 text-muted-foreground" />
                <div className="flex-1">
                  <Label htmlFor="telefone">Telefone</Label>
                  {isEditing.telefone ? (
                    <Input
                      id="telefone"
                      value={editValues.telefone}
                      onChange={(e) => handleInputChange('telefone', formatTelefone(e.target.value))}
                      className="mt-1"
                      maxLength={15}
                      disabled={saving}
                    />
                  ) : (
                    <p className="text-foreground font-medium mt-1">{userData.telefone || 'Não informado'}</p>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit('telefone')}
                  disabled={saving}
                >
                  {isEditing.telefone ? 'Salvar' : 'Editar'}
                </Button>
              </div>

              {/* CPF/CNPJ (apenas leitura) */}
              <div className="flex items-center space-x-4">
                <User className="w-5 h-5 text-muted-foreground" />
                <div className="flex-1">
                  <Label>Documento</Label>
                  <p className="text-foreground font-medium mt-1">{formatDocumento(userData.cpf_cnpj)}</p>
                  <p className="text-xs text-muted-foreground">Documento não pode ser alterado</p>
                </div>
              </div>
            </div>

            {/* Segurança */}
            <div className="space-y-4 pt-6 border-t">
              <h3 className="text-lg font-semibold text-foreground mb-4">Segurança</h3>
              
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleChangePassword}
                >
                  <Lock className="w-5 h-5 mr-3" />
                  Alterar Senha
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleChangePIN}
                >
                  <Key className="w-5 h-5 mr-3" />
                  Alterar PIN de Transação
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Perfil;
